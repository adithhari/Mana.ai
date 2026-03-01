import os
import dotenv
import json
import asyncio
import tempfile
import requests
from collections import defaultdict
from flask import Flask, request, jsonify
from supabase import create_client, Client
import nest_asyncio
from pydub import AudioSegment
import assemblyai as aai
from groq import Groq
from hume import AsyncHumeClient
from hume.expression_measurement.stream import Config
from hume.expression_measurement.stream.socket_client import StreamConnectOptions


from flask import Flask, request
from flask_cors import CORS

# Load environment variables from .env
dotenv.load_dotenv()

# Set your API keys (you may also load these from environment variables)
ASSEMBLYAI_KEY = os.environ.get("ASSEMBLYAI_KEY", "")
HUME_KEY = os.environ.get("HUME_KEY", "")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

# Trello credentials
TRELLO_KEY = os.environ.get("TRELLO_KEY", "")
TRELLO_TOKEN = os.environ.get("TRELLO_TOKEN", "")
# Replace with your actual Trello list ID
TRELLO_LIST_ID = os.environ.get("TRELLO_LIST_ID", "67f2b0d5f97a735fa5eb2be2")

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Enable nest_asyncio to allow nested event loops
nest_asyncio.apply()

# ================================================================
# 1. Transcription and Emotion Analysis Function
# ================================================================
def analyze_emotions_and_transcript(file_path: str, aai_key: str, hume_key: str, expected_speakers: int = 3, top_n_emotions: int = 10):
    aai.settings.api_key = aai_key
    HUME_API_KEY = hume_key

    segment_results = []
    emotion_tracker = defaultdict(lambda: defaultdict(float))

    async def analyze_all_segments(segments):
        async def analyze_segment(segment):
            result_entry = {
                "speaker": segment["speaker"],
                "text": segment["text"],
                "file": segment["file"],
            }
            try:
                client = AsyncHumeClient(api_key=HUME_API_KEY)
                model_config = Config(prosody={})
                stream_options = StreamConnectOptions(config=model_config)
                async with client.expression_measurement.stream.connect(options=stream_options) as socket:
                    result = await socket.send_file(segment["file"])
                    if not hasattr(result, "prosody") or result.prosody is None:
                        result_entry["error"] = "No prosody result"
                        segment_results.append(result_entry)
                        return
                    predictions = result.prosody.predictions
                    if not predictions:
                        result_entry["error"] = "No predictions"
                        segment_results.append(result_entry)
                        return
                    emotions = predictions[0].emotions
                    for emotion in emotions:
                        emotion_tracker[segment["speaker"]][emotion.name] += emotion.score
                    top_emotion = max(emotions, key=lambda e: e.score)
                    result_entry["dominant_emotion"] = {
                        "name": top_emotion.name,
                        "score": round(top_emotion.score, 3)
                    }
            except Exception as e:
                result_entry["error"] = str(e)
            segment_results.append(result_entry)
        for segment in segments:
            await analyze_segment(segment)

    # Step 1: Transcription using AssemblyAI
    config = aai.TranscriptionConfig(
        speech_model=aai.SpeechModel.best,
        summarization=True,
        iab_categories=True,
        auto_highlights=True,
        entity_detection=True,
        speaker_labels=True,
        speakers_expected=expected_speakers,
        language_detection=True
    )
    transcriber = aai.Transcriber(config=config)
    transcript = transcriber.transcribe(file_path)
    if transcript.status == aai.TranscriptStatus.error:
        return {"error": f"Transcription failed: {transcript.error}"}, {}
    # Step 2: Audio Segmentation
    audio = AudioSegment.from_mp3(file_path)
    segments = []
    for i, utt in enumerate(transcript.utterances):
        start_ms = utt.start
        end_ms = utt.end
        speaker = utt.speaker
        text = utt.text
        chunk = audio[start_ms:end_ms]
        filename = f"speaker{speaker}_utt{i}.wav"
        chunk.export(filename, format="wav")
        segments.append({
            "file": filename,
            "speaker": speaker,
            "text": text
        })
    # Step 3: Emotion Analysis with Hume
    asyncio.run(analyze_all_segments(segments))
    # Step 4: Aggregated Emotion Summary
    emotion_summary = {}
    for speaker, emotions in emotion_tracker.items():
        sorted_emotions = sorted(emotions.items(), key=lambda x: x[1], reverse=True)[:top_n_emotions]
        emotion_summary[speaker] = [
            {"emotion": emotion, "score": round(score, 3)} for emotion, score in sorted_emotions
        ]
    return segment_results, emotion_summary

# ================================================================
# 2. Mind Map Generation Function
# ================================================================
def generate_json_mind_map(audio_url: str) -> str:
    response = requests.get(audio_url)
    if response.status_code != 200:
        return json.dumps({"status": "error", "error": f"Failed to fetch audio file: HTTP {response.status_code}"})
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
        temp_audio.write(response.content)
        temp_file_path = temp_audio.name
    try:
        aai.settings.api_key = ASSEMBLYAI_KEY
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(temp_file_path)
        if transcript.status == aai.TranscriptStatus.error:
            return json.dumps({"status": "error", "error": transcript.error})
        # Updated prompt: we insist on strictly valid JSON output with proper starting and ending braces.
        prompt = (
            "ONLY GIVE THE JSON OUTPUT, NOTHING ELSE. DO NOT WRITE ANY EXPLANATIONS OR EXTRA TEXT. "
            "Return a mind map in JSON format that strictly follows this format and ensure the JSON is well-formed: \n\n"
            '{ "nodes": [ { "id": 1, "label": "Main Topic" }, { "id": 2, "label": "Subtopic A" }, { "id": 3, "label": "Subtopic B" }, { "id": 4, "label": "Related Idea" } ], '
            '"edges": [ { "from": 1, "to": 2 }, { "from": 1, "to": 3 }, { "from": 2, "to": 4 } ] }\n\n'
            "Ensure that your output starts with '{' and ends with '}'." \
            "Additional information about the transcript attached after"
        )
        final_prompt = prompt + transcript.text
        client = Groq(api_key=GROQ_API_KEY)
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": final_prompt}],
            model="llama3-8b-8192",
        )
        return chat_completion.choices[0].message.content
    finally:
        os.remove(temp_file_path)

# ================================================================
# 3. Audio Summary Generation Function (Meeting Minutes)
# ================================================================
def generate_audio_summary_from_json_data(conversation_data: dict) -> dict:
    conversation_str = json.dumps(conversation_data, indent=2)
    prompt = f"""
ONLY GIVE THE JSON OUTPUT, NOTHING ELSE.
Write professional meeting minutes that capture the key discussion points and overall emotions expressed by the speakers.
Return the output as strictly valid JSON following exactly this format:
{{
  "summary": "Concise summary of the audio"
}}
Do not include any additional text.
Conversation Data:
{conversation_str}
    """
    client = Groq(api_key=GROQ_API_KEY)
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-8b-8192"
    )
    summary_json_str = chat_completion.choices[0].message.content.strip()
    try:
        summary_json = json.loads(summary_json_str)
    except json.JSONDecodeError as e:
        summary_json = {
            "error": "Invalid JSON output from LLM",
            "details": str(e),
            "raw_output": summary_json_str
        }
    return summary_json

# ================================================================
# 4. Task Mapping Generation Function
# ================================================================
def generate_task_mapping_from_json_data(conversation_data: dict) -> dict:
    conversation_str = json.dumps(conversation_data, indent=2)
    prompt = f"""
ONLY GIVE THE JSON OUTPUT, NOTHING ELSE.
Extract actionable items from the conversation. For each task, identify the responsible person and a brief description.
Return the output as strictly valid JSON matching this format:
{{
  "tasks": [
    {{
      "person": "Name of person",
      "task": "Brief description of the task"
    }}
  ]
}}
Do not include any extra text.
Conversation Data:
{conversation_str}
    """
    client = Groq(api_key=GROQ_API_KEY)
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-8b-8192"
    )
    task_json_str = chat_completion.choices[0].message.content.strip()
    try:
        task_json = json.loads(task_json_str)
    except json.JSONDecodeError as e:
        task_json = {
            "error": "Invalid JSON output from LLM",
            "details": str(e),
            "raw_output": task_json_str
        }
    return task_json

# ================================================================
# 5. Wrapper Function to Collect All JSON Outputs
# ================================================================
def run_full_analysis(file_path: str, audio_file_url: str, aai_key: str, hume_key: str, expected_speakers: int = 3, top_n_emotions: int = 10) -> dict:
    segment_results, emotion_summary = analyze_emotions_and_transcript(file_path, aai_key, hume_key, expected_speakers, top_n_emotions)
    mind_map_str = generate_json_mind_map(audio_file_url)
    try:
        mind_map = json.loads(mind_map_str)
    except Exception:
        mind_map = {"error": "Invalid mind map JSON", "raw": mind_map_str}
    audio_summary = generate_audio_summary_from_json_data(segment_results)
    task_mapping = generate_task_mapping_from_json_data(segment_results)
    return {
        "segmentResults": segment_results,
        "emotionSummary": emotion_summary,
        "mindMap": mind_map,
        "audioSummary": audio_summary,
        "taskMapping": task_mapping
    }

# ================================================================
# Function to Push Task Mapping to Trello
# ================================================================
def push_tasks_to_trello(task_mapping: dict) -> list:
    tasks = task_mapping.get("tasks", [])
    results = []
    for task in tasks:
        person = task.get("person", "Unassigned")
        task_description = task.get("task", "No task description")
        # Create card with task description as name and include the responsible person in the description.
        card_name = task_description
        card_desc = f"Responsible: {person}"
        query = {
            'idList': TRELLO_LIST_ID,
            'name': card_name,
            'desc': card_desc,
            'key': TRELLO_KEY,
            'token': TRELLO_TOKEN
        }
        url = "https://api.trello.com/1/cards"
        response = requests.post(url, params=query)
        if response.status_code in [200, 201]:
            results.append({"task": task, "status": "created", "card": response.json()})
        else:
            results.append({"task": task, "status": "failed", "error": response.text})
    return results

# ================================================================
# Flask App Setup with File Conversion for Non-MP3 Files
# ================================================================
app = Flask(__name__)

CORS(app)

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    # Check if file is provided
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    uploaded_file = request.files['file']
    if uploaded_file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # Save the original file temporarily
        temp_dir = tempfile.gettempdir()
        original_file_path = os.path.join(temp_dir, uploaded_file.filename)
        uploaded_file.save(original_file_path)

        # Convert file to MP3 if it isn't already in MP3 format
        if not uploaded_file.filename.lower().endswith('.mp3'):
            converted_file_path = os.path.splitext(original_file_path)[0] + '.mp3'
            audio = AudioSegment.from_file(original_file_path)
            audio.export(converted_file_path, format="mp3")
            processed_file_path = converted_file_path
        else:
            processed_file_path = original_file_path

        # Upload the processed file (now guaranteed to be MP3) to Supabase Storage
        supabase_path = f"public/{os.path.basename(processed_file_path)}"
        with open(processed_file_path, "rb") as f:
            file_content = f.read()
        upload_response = supabase.storage.from_("mana-audio").upload(
            supabase_path,
            file_content,
            file_options={"cache-control": "3600", "upsert": False}
        )
        # print(upload_response._dict_)

        # Construct the public URL for the uploaded file
        audio_file_url = f"https://yaxvtxditbbjikmnbnql.supabase.co/storage/v1/object/public/mana-audio/{supabase_path}"

        # Run the full analysis on the processed file and public URL
        analysis_result = run_full_analysis(processed_file_path, audio_file_url, ASSEMBLYAI_KEY, HUME_KEY)
        
        # If taskMapping exists, push the tasks directly to Trello
        trello_results = []
        if "taskMapping" in analysis_result:
            trello_results = push_tasks_to_trello(analysis_result["taskMapping"])
            analysis_result["trelloResults"] = trello_results

        # Clean up temporary files
        os.remove(original_file_path)
        if processed_file_path != original_file_path:
            os.remove(processed_file_path)

        return jsonify(analysis_result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5500)