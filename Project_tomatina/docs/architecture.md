# Architecture Overview

## Backend Flow
1. **Request**: Frontend sends a multipart-form image to `/predict`.
2. **Inference**: `ModelManager` (in `core/model.py`) preprocesses the image (224x224) and runs it through `best_model.h5`.
3. **AI Insight**: `get_treatment_gist` (in `core/advisory.py`) takes the top prediction and hits a pool of LLMs via OpenRouter to get a 3-line treatment gist.
4. **Response**: A unified JSON object containing diagnosis, confidence bars, and AI advice.

## Frontend State Machine
- **Upload**: Initial state with parallax background.
- **Analyzing**: Loading state during backend processing.
- **Result**: Data-rich view with glass-morphic cards and animations.
