# Mana.ai

An all-in-one solution for automated audio transcription, emotion analysis, mind map generation, meeting minutes synthesis, and actionable task extraction with seamless integration into Trello. This project leverages state-of-the-art APIs and libraries to process audio files, extract meaningful insights, and streamline workflow management.

We send information to the Trello board (third-party integration) that helps us identify the critical tasks to be done.

Link to web extension - unpack and have fun https://github.iu.edu/Luddy-Hackathon/mana-gmeet-chrome


## Overview
This repository provides a comprehensive audio analysis system that processes audio files through multiple stages:
- **Transcription & Speaker Segmentation**: Utilizes AssemblyAI to transcribe audio and identify speakers.
- **Emotion Analysis**: Employs Hume to analyze prosody and extract emotional metrics per speaker.
- **Mind Map Generation**: Uses Groq to convert transcriptions into visually appealing JSON-based mind maps.
- **Audio Summary & Task Mapping**: Generates professional meeting minutes and extracts actionable tasks directly from conversation data.
- **Trello Integration**: Automatically creates Trello cards for each identified task to streamline project management.
- **Audio Conversion & Storage**: Converts non-MP3 files to MP3 using `pydub` and stores them on Supabase Storage.

This robust pipeline is implemented as a Flask application, making it easy to integrate into any existing ecosystem or to run as a standalone service.

## Features
- **Automated Transcription**: Fast and accurate speech-to-text conversion with speaker labeling.
- **Emotion & Sentiment Analysis**: In-depth analysis of audio segments to gauge speaker emotions.
- **Mind Map Creation**: Converts transcripts into structured JSON mind maps for a quick overview of discussion topics.
- **Meeting Minutes & Task Extraction**: Summarizes audio content into professional meeting minutes and actionable tasks.
- **Trello Integration**: Directly pushes tasks to Trello boards for improved workflow management.
- **Dynamic Audio Conversion**: Supports multiple audio formats by converting files to MP3 when necessary.
- **Scalable & Modular**: Easily extendable to include additional processing steps or integrations.

## Architecture
The system is organized into several key components:
- **Transcription & Emotion Analysis**: Combines AssemblyAI for transcription and Hume for emotion analysis. Audio is segmented per speaker, and each segment is analyzed for dominant emotions.
- **Mind Map Generation**: Leverages Groq’s language model to transform transcripts into a predefined JSON mind map structure.
- **Audio Summary & Task Mapping**: Processes the conversation data to generate meeting summaries and extract tasks using structured JSON outputs from Groq.
- **Trello Integration**: Pushes task mappings as cards to a Trello board using Trello API credentials.
- **Flask API & File Handling**: A Flask-based API endpoint `/upload-audio` handles file uploads, conversion (if necessary), Supabase Storage uploads, and triggers the full analysis pipeline.

## Installation & Setup
### Prerequisites
- Python 3.7+
- Pipenv / Virtualenv (recommended for dependency isolation)
- External API keys for:
  - AssemblyAI
  - Hume
  - Groq
  - Trello
  - Supabase

### Dependencies
Install the required Python packages using `pip`:

pip install python-dotenv requests flask supabase nest_asyncio pydub assemblyai groq hume

# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS (via Homebrew)
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS (via Homebrew)
brew install ffmpeg

.env file edit
# API Keys
ASSEMBLYAI_KEY=your_assemblyai_key
HUME_KEY=your_hume_key
GROQ_API_KEY=your_groq_api_key

# Trello
TRELLO_KEY=your_trello_key
TRELLO_TOKEN=your_trello_token
TRELLO_LIST_ID=your_trello_list_id

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Usage
python your_script.py
# Mana.ai
