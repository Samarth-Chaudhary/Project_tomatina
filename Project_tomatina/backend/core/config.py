import os
from pathlib import Path

# Base Directories
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
FRONTEND_DIR = BASE_DIR.parent / "frontend"

# Model Paths
MODEL_PATH = MODELS_DIR / "best_model.h5"
CLASS_NAMES_PATH = MODELS_DIR / "class_names.json"

# API Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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").strip()
PORT = int(os.environ.get('PORT', 5050))
HOST = '0.0.0.0'
DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"

# Model Preference for Advisories
AI_MODELS = [
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "open-vertex/gemini-1.5-flash:free"
]
