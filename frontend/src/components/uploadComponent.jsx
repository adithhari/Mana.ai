import { useRef } from "react";
import axios from "axios";

export default function UploadComponent({ onFileSelect: onFileUploaded }) {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // backend should expect field named 'file'

    try {
     
      // mock
      onFileUploaded({
        "audioSummary": {
            "summary": "Discussions revolve around winning the hackathon, completing the project on time, and donating blood/sperm. Emotional tone is generally excitement and amusement with moments of confusion and determination."
        },
        "emotionSummary": {
            "A": [
                {
                    "emotion": "Amusement",
                    "score": 1.476
                },
                {
                    "emotion": "Excitement",
                    "score": 1.364
                },
                {
                    "emotion": "Joy",
                    "score": 1.158
                },
                {
                    "emotion": "Interest",
                    "score": 0.843
                },
                {
                    "emotion": "Surprise (positive)",
                    "score": 0.624
                },
                {
                    "emotion": "Confusion",
                    "score": 0.457
                },
                {
                    "emotion": "Nostalgia",
                    "score": 0.409
                },
                {
                    "emotion": "Fear",
                    "score": 0.397
                },
                {
                    "emotion": "Awkwardness",
                    "score": 0.396
                },
                {
                    "emotion": "Distress",
                    "score": 0.362
                }
            ],
            "B": [
                {
                    "emotion": "Determination",
                    "score": 1.466
                },
                {
                    "emotion": "Amusement",
                    "score": 1.125
                },
                {
                    "emotion": "Interest",
                    "score": 1.011
                },
                {
                    "emotion": "Concentration",
                    "score": 0.885
                },
                {
                    "emotion": "Excitement",
                    "score": 0.745
                },
                {
                    "emotion": "Calmness",
                    "score": 0.578
                },
                {
                    "emotion": "Surprise (positive)",
                    "score": 0.555
                },
                {
                    "emotion": "Confusion",
                    "score": 0.513
                },
                {
                    "emotion": "Joy",
                    "score": 0.471
                },
                {
                    "emotion": "Pride",
                    "score": 0.461
                }
            ],
            "C": [
                {
                    "emotion": "Surprise (positive)",
                    "score": 0.86
                },
                {
                    "emotion": "Excitement",
                    "score": 0.67
                },
                {
                    "emotion": "Amusement",
                    "score": 0.594
                },
                {
                    "emotion": "Realization",
                    "score": 0.541
                },
                {
                    "emotion": "Awe",
                    "score": 0.483
                },
                {
                    "emotion": "Interest",
                    "score": 0.44
                },
                {
                    "emotion": "Determination",
                    "score": 0.419
                },
                {
                    "emotion": "Surprise (negative)",
                    "score": 0.4
                },
                {
                    "emotion": "Confusion",
                    "score": 0.354
                },
                {
                    "emotion": "Joy",
                    "score": 0.304
                }
            ]
        },
        "mindMap": {
            "edges": [
                {
                    "from": 1,
                    "to": 2
                },
                {
                    "from": 1,
                    "to": 3
                },
                {
                    "from": 3,
                    "to": 4
                },
                {
                    "from": 4,
                    "to": 5
                },
                {
                    "from": 5,
                    "to": 6
                },
                {
                    "from": 6,
                    "to": 7
                },
                {
                    "from": 1,
                    "to": 8
                },
                {
                    "from": 8,
                    "to": 9
                },
                {
                    "from": 9,
                    "to": 10
                },
                {
                    "from": 10,
                    "to": 11
                }
            ],
            "nodes": [
                {
                    "id": 1,
                    "label": "Hackathon"
                },
                {
                    "id": 2,
                    "label": "Winning the Hackathon"
                },
                {
                    "id": 3,
                    "label": "MVP"
                },
                {
                    "id": 4,
                    "label": "IU Classifieds"
                },
                {
                    "id": 5,
                    "label": "Alcohol Study"
                },
                {
                    "id": 6,
                    "label": "MRI Scanning"
                },
                {
                    "id": 7,
                    "label": "No Risk"
                },
                {
                    "id": 8,
                    "label": "Blood Donation"
                },
                {
                    "id": 9,
                    "label": "Donating Sperm"
                },
                {
                    "id": 10,
                    "label": "Dream"
                },
                {
                    "id": 11,
                    "label": "Money"
                }
            ]
        },
        "segmentResults": [
            {
                "dominant_emotion": {
                    "name": "Confusion",
                    "score": 0.224
                },
                "file": "speakerA_utt0.wav",
                "speaker": "A",
                "text": "I wish we win this hackathon. What do you guys think?"
            },
            {
                "dominant_emotion": {
                    "name": "Determination",
                    "score": 0.626
                },
                "file": "speakerB_utt1.wav",
                "speaker": "B",
                "text": "I want thousand dollars. So we need to win this hackathon."
            },
            {
                "error": "No prosody result",
                "file": "speakerC_utt2.wav",
                "speaker": "C",
                "text": "We need to make sure that we complete the project on time as well as make it polished so that we could get the first prize."
            },
            {
                "error": "No predictions",
                "file": "speakerB_utt3.wav",
                "speaker": "B",
                "text": "Okay? Okay. Okay."
            },
            {
                "dominant_emotion": {
                    "name": "Interest",
                    "score": 0.21
                },
                "file": "speakerA_utt4.wav",
                "speaker": "A",
                "text": "I just won the first MVP to be built by today."
            },
            {
                "dominant_emotion": {
                    "name": "Interest",
                    "score": 0.331
                },
                "file": "speakerB_utt5.wav",
                "speaker": "B",
                "text": "Morning to apply for IU classifieds."
            },
            {
                "dominant_emotion": {
                    "name": "Excitement",
                    "score": 0.247
                },
                "file": "speakerA_utt6.wav",
                "speaker": "A",
                "text": "Oh, yeah. Alcohol study."
            },
            {
                "dominant_emotion": {
                    "name": "Determination",
                    "score": 0.464
                },
                "file": "speakerB_utt7.wav",
                "speaker": "B",
                "text": "Yeah, they're getting 325 bucks for free. I need to do that."
            },
            {
                "dominant_emotion": {
                    "name": "Interest",
                    "score": 0.159
                },
                "file": "speakerC_utt8.wav",
                "speaker": "C",
                "text": "It's MRI scanning, right?"
            },
            {
                "error": "No predictions",
                "file": "speakerA_utt9.wav",
                "speaker": "A",
                "text": "Yeah, MRI scanning."
            },
            {
                "dominant_emotion": {
                    "name": "Amusement",
                    "score": 0.227
                },
                "file": "speakerB_utt10.wav",
                "speaker": "B",
                "text": "And I also researched about those MRI scannings. The radiation should not affect there. So there is no risk in it."
            },
            {
                "error": "No predictions",
                "file": "speakerC_utt11.wav",
                "speaker": "C",
                "text": "Okay."
            },
            {
                "dominant_emotion": {
                    "name": "Amusement",
                    "score": 0.141
                },
                "file": "speakerA_utt12.wav",
                "speaker": "A",
                "text": "There never was."
            },
            {
                "error": "No prosody result",
                "file": "speakerB_utt13.wav",
                "speaker": "B",
                "text": "Yeah. So I just need to go there for six and a half hours, simply sit and drink and get 325 bucks for free."
            },
            {
                "dominant_emotion": {
                    "name": "Excitement",
                    "score": 0.352
                },
                "file": "speakerC_utt14.wav",
                "speaker": "C",
                "text": "So is there something you could donate something and get money?"
            },
            {
                "dominant_emotion": {
                    "name": "Excitement",
                    "score": 0.461
                },
                "file": "speakerA_utt15.wav",
                "speaker": "A",
                "text": "This is guy's dream."
            },
            {
                "dominant_emotion": {
                    "name": "Calmness",
                    "score": 0.149
                },
                "file": "speakerB_utt16.wav",
                "speaker": "B",
                "text": "You can donate sperm if you want."
            },
            {
                "dominant_emotion": {
                    "name": "Amusement",
                    "score": 0.35
                },
                "file": "speakerA_utt17.wav",
                "speaker": "A",
                "text": "$50."
            },
            {
                "dominant_emotion": {
                    "name": "Confusion",
                    "score": 0.152
                },
                "file": "speakerC_utt18.wav",
                "speaker": "C",
                "text": "No, I don't want to."
            },
            {
                "error": "No predictions",
                "file": "speakerB_utt19.wav",
                "speaker": "B",
                "text": "Lose my."
            },
            {
                "dominant_emotion": {
                    "name": "Amusement",
                    "score": 0.199
                },
                "file": "speakerA_utt20.wav",
                "speaker": "A",
                "text": "No, no. In general."
            },
            {
                "error": "No predictions",
                "file": "speakerB_utt21.wav",
                "speaker": "B",
                "text": "Yeah."
            },
            {
                "error": "No predictions",
                "file": "speakerA_utt22.wav",
                "speaker": "A",
                "text": "I don't know."
            },
            {
                "dominant_emotion": {
                    "name": "Surprise (positive)",
                    "score": 0.661
                },
                "file": "speakerC_utt23.wav",
                "speaker": "C",
                "text": "Oh, wow."
            },
            {
                "dominant_emotion": {
                    "name": "Amusement",
                    "score": 0.484
                },
                "file": "speakerB_utt24.wav",
                "speaker": "B",
                "text": "Hey, actually it's 100 bucks for blood donation."
            },
            {
                "error": "No predictions",
                "file": "speakerA_utt25.wav",
                "speaker": "A",
                "text": "What?"
            },
            {
                "dominant_emotion": {
                    "name": "Amusement",
                    "score": 0.134
                },
                "file": "speakerB_utt26.wav",
                "speaker": "B",
                "text": "In some cases they will."
            },
            {
                "error": "No predictions",
                "file": "speakerA_utt27.wav",
                "speaker": "A",
                "text": "How much will they take?"
            },
            {
                "error": "No predictions",
                "file": "speakerC_utt28.wav",
                "speaker": "C",
                "text": "10."
            }
        ],
        "taskMapping": {
            "tasks": [
                {
                    "person": "Speaker B",
                    "task": "Make sure we complete the project on time and make it polished to get the first prize"
                },
                {
                    "person": "Speaker B",
                    "task": "Go to IU classifieds and apply for 325 bucks"
                },
                {
                    "person": "Speaker B",
                    "task": "Donate sperm if wanted (for 325 bucks)"
                }
            ]
        },
        "trelloResults": [
            {
                "card": {
                    "attachments": [],
                    "badges": {
                        "attachments": 0,
                        "attachmentsByType": {
                            "trello": {
                                "board": 0,
                                "card": 0
                            }
                        },
                        "checkItems": 0,
                        "checkItemsChecked": 0,
                        "checkItemsEarliestDue": null,
                        "comments": 0,
                        "description": true,
                        "due": null,
                        "dueComplete": false,
                        "externalSource": null,
                        "fogbugz": "",
                        "lastUpdatedByAi": false,
                        "location": false,
                        "maliciousAttachments": 0,
                        "start": null,
                        "subscribed": false,
                        "viewingMemberVoted": false,
                        "votes": 0
                    },
                    "cardRole": null,
                    "checkItemStates": [],
                    "closed": false,
                    "cover": {
                        "brightness": "dark",
                        "color": null,
                        "idAttachment": null,
                        "idPlugin": null,
                        "idUploadedBackground": null,
                        "size": "normal"
                    },
                    "dateLastActivity": "2025-04-06T18:55:44.440Z",
                    "desc": "Responsible: Speaker B",
                    "descData": {
                        "emoji": {}
                    },
                    "due": null,
                    "dueComplete": false,
                    "dueReminder": null,
                    "email": null,
                    "id": "67f2ce30f3b633cd79d2306c",
                    "idAttachmentCover": null,
                    "idBoard": "67f2a1ee105f9d8d71c5dd1c",
                    "idChecklists": [],
                    "idLabels": [],
                    "idList": "67f2b0d5f97a735fa5eb2be2",
                    "idMembers": [],
                    "idMembersVoted": [],
                    "idShort": 38,
                    "isTemplate": false,
                    "labels": [],
                    "limits": {},
                    "manualCoverAttachment": false,
                    "mirrorSourceId": null,
                    "name": "Make sure we complete the project on time and make it polished to get the first prize",
                    "nodeId": "ari:cloud:trello::card/workspace/67f2a1ed2da3d915d159fde9/67f2ce30f3b633cd79d2306c",
                    "pinned": false,
                    "pos": 409600,
                    "shortLink": "i2mTdnR6",
                    "shortUrl": "https://trello.com/c/i2mTdnR6",
                    "start": null,
                    "stickers": [],
                    "subscribed": false,
                    "url": "https://trello.com/c/i2mTdnR6/38-make-sure-we-complete-the-project-on-time-and-make-it-polished-to-get-the-first-prize"
                },
                "status": "created",
                "task": {
                    "person": "Speaker B",
                    "task": "Make sure we complete the project on time and make it polished to get the first prize"
                }
            },
            {
                "card": {
                    "attachments": [],
                    "badges": {
                        "attachments": 0,
                        "attachmentsByType": {
                            "trello": {
                                "board": 0,
                                "card": 0
                            }
                        },
                        "checkItems": 0,
                        "checkItemsChecked": 0,
                        "checkItemsEarliestDue": null,
                        "comments": 0,
                        "description": true,
                        "due": null,
                        "dueComplete": false,
                        "externalSource": null,
                        "fogbugz": "",
                        "lastUpdatedByAi": false,
                        "location": false,
                        "maliciousAttachments": 0,
                        "start": null,
                        "subscribed": false,
                        "viewingMemberVoted": false,
                        "votes": 0
                    },
                    "cardRole": null,
                    "checkItemStates": [],
                    "closed": false,
                    "cover": {
                        "brightness": "dark",
                        "color": null,
                        "idAttachment": null,
                        "idPlugin": null,
                        "idUploadedBackground": null,
                        "size": "normal"
                    },
                    "dateLastActivity": "2025-04-06T18:55:44.740Z",
                    "desc": "Responsible: Speaker B",
                    "descData": {
                        "emoji": {}
                    },
                    "due": null,
                    "dueComplete": false,
                    "dueReminder": null,
                    "email": null,
                    "id": "67f2ce3099887cfb022bc5b6",
                    "idAttachmentCover": null,
                    "idBoard": "67f2a1ee105f9d8d71c5dd1c",
                    "idChecklists": [],
                    "idLabels": [],
                    "idList": "67f2b0d5f97a735fa5eb2be2",
                    "idMembers": [],
                    "idMembersVoted": [],
                    "idShort": 39,
                    "isTemplate": false,
                    "labels": [],
                    "limits": {},
                    "manualCoverAttachment": false,
                    "mirrorSourceId": null,
                    "name": "Go to IU classifieds and apply for 325 bucks",
                    "nodeId": "ari:cloud:trello::card/workspace/67f2a1ed2da3d915d159fde9/67f2ce3099887cfb022bc5b6",
                    "pinned": false,
                    "pos": 425984,
                    "shortLink": "op0wkj0v",
                    "shortUrl": "https://trello.com/c/op0wkj0v",
                    "start": null,
                    "stickers": [],
                    "subscribed": false,
                    "url": "https://trello.com/c/op0wkj0v/39-go-to-iu-classifieds-and-apply-for-325-bucks"
                },
                "status": "created",
                "task": {
                    "person": "Speaker B",
                    "task": "Go to IU classifieds and apply for 325 bucks"
                }
            },
            {
                "card": {
                    "attachments": [],
                    "badges": {
                        "attachments": 0,
                        "attachmentsByType": {
                            "trello": {
                                "board": 0,
                                "card": 0
                            }
                        },
                        "checkItems": 0,
                        "checkItemsChecked": 0,
                        "checkItemsEarliestDue": null,
                        "comments": 0,
                        "description": true,
                        "due": null,
                        "dueComplete": false,
                        "externalSource": null,
                        "fogbugz": "",
                        "lastUpdatedByAi": false,
                        "location": false,
                        "maliciousAttachments": 0,
                        "start": null,
                        "subscribed": false,
                        "viewingMemberVoted": false,
                        "votes": 0
                    },
                    "cardRole": null,
                    "checkItemStates": [],
                    "closed": false,
                    "cover": {
                        "brightness": "dark",
                        "color": null,
                        "idAttachment": null,
                        "idPlugin": null,
                        "idUploadedBackground": null,
                        "size": "normal"
                    },
                    "dateLastActivity": "2025-04-06T18:55:45.029Z",
                    "desc": "Responsible: Speaker B",
                    "descData": {
                        "emoji": {}
                    },
                    "due": null,
                    "dueComplete": false,
                    "dueReminder": null,
                    "email": null,
                    "id": "67f2ce312b0442d60dfcc86c",
                    "idAttachmentCover": null,
                    "idBoard": "67f2a1ee105f9d8d71c5dd1c",
                    "idChecklists": [],
                    "idLabels": [],
                    "idList": "67f2b0d5f97a735fa5eb2be2",
                    "idMembers": [],
                    "idMembersVoted": [],
                    "idShort": 40,
                    "isTemplate": false,
                    "labels": [],
                    "limits": {},
                    "manualCoverAttachment": false,
                    "mirrorSourceId": null,
                    "name": "Donate sperm if wanted (for 325 bucks)",
                    "nodeId": "ari:cloud:trello::card/workspace/67f2a1ed2da3d915d159fde9/67f2ce312b0442d60dfcc86c",
                    "pinned": false,
                    "pos": 442368,
                    "shortLink": "cNZmPkld",
                    "shortUrl": "https://trello.com/c/cNZmPkld",
                    "start": null,
                    "stickers": [],
                    "subscribed": false,
                    "url": "https://trello.com/c/cNZmPkld/40-donate-sperm-if-wanted-for-325-bucks"
                },
                "status": "created",
                "task": {
                    "person": "Speaker B",
                    "task": "Donate sperm if wanted (for 325 bucks)"
                }
            }
        ]
    })
    return;
      const response = await axios.post(
        "http://localhost:5500/upload-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Trigger result section after successful upload
      onFileUploaded({resultsData: response.data});
    } catch (error) {
      console.error("❌ Upload failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept="audio/*,video/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={handleFileClick}
        className="bg-primary hover:bg-purple-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow transition"
      >
        Upload
      </button>
    </div>
  );
}
