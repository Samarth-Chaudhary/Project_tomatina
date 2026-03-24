# How to Run LeafAI 🚀

This guide provides detailed instructions on setting up and running the LeafAI project in different environments.

## 💻 Local Development

### 1. Environment Setup
We recommend using **Python 3.11** for the best compatible with TensorFlow weights.

```bash
# Navigate to the project root
cd Project_tomatina

# Create a virtual environment
python3.11 -m venv venv

# Activate the environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 3. Configuration
Create a `.env` file in the `backend/` directory or set environment variables:
```bash
export OPENROUTER_API_KEY=your_sk_key_here
export FLASK_DEBUG=True
```

### 4. Running the Backend
From the `Project_tomatina` directory:
```bash
cd backend
PYTHONPATH=. python3 app.py
```
The app will be live at `http://127.0.0.1:5050`.

---

## ☁️ Production Deployment (Gunicorn)

For production, it is recommended to use **Gunicorn** instead of the Flask development server.

```bash
cd backend
PYTHONPATH=. gunicorn app:app --bind 0.0.0.0:5050
```

### Deploying to Platforms (Render/Railway)
- **Root Directory**: `Project_tomatina`
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `gunicorn --chdir backend app:app --bind 0.0.0.0:$PORT`

---

## 🧪 Testing the API
You can test the classification API using `curl`:
```bash
curl -X POST -F "file=@path/to/leaf_image.jpg" http://127.0.0.1:5050/predict
```

## 🛠️ Troubleshooting
- **Port 5050 in use**: Run `lsof -ti:5050 | xargs kill -9` to clear the port.
- **Model Loading Error**: Ensure `backend/models/best_model.h5` exists and matches the version of TensorFlow installed.
