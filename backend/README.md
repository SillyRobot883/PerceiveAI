# PerceiveAI Speech-to-Text Backend

This is the FastAPI backend for the PerceiveAI speech-to-text transcription service. It uses the OpenAI Whisper-tiny model to transcribe audio from YouTube videos and uploaded files.

## Requirements

- Python 3.8+
- FFmpeg (required for audio processing)
- CUDA-capable GPU (optional, for faster processing)

## Installation

1. Install FFmpeg:
   - Windows: Download from https://ffmpeg.org/download.html or install via Chocolatey: `choco install ffmpeg`
   - Linux: `sudo apt-get install ffmpeg`
   - macOS: `brew install ffmpeg`

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
cd app
python main.py
```

The server will start at http://localhost:8000

## API Endpoints

- `GET /`: Check if the API is running
- `POST /youtube-transcribe/`: Transcribe audio from a YouTube video (requires URL)
- `POST /upload-transcribe/`: Transcribe audio from an uploaded file

## Environment Variables

You can create a `.env` file in the `app` directory with the following variables:

```
PORT=8000
HOST=0.0.0.0
MODEL_NAME=openai/whisper-tiny
```

## Usage with Frontend

Make sure the API is running before using the frontend. The frontend will send requests to the API at `http://localhost:8000/youtube-transcribe/`.