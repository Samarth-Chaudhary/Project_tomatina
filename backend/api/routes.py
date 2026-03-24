import logging
from flask import request, jsonify, send_from_directory # type: ignore
from core.model import ModelManager
from core.advisory import get_treatment_gist
from core.config import MODEL_PATH, CLASS_NAMES_PATH

logger = logging.getLogger(__name__)

# Single instances
model_manager = ModelManager(str(MODEL_PATH), str(CLASS_NAMES_PATH))

def register_routes(app):
    @app.route('/')
    def index():
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/<path:path>')
    def static_proxy(path):
        return send_from_directory(app.static_folder, path)

    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({
            'status': 'ready' if model_manager.model else 'error',
            'model_loaded': model_manager.model is not None,
            'error': model_manager.error
        })

    @app.route('/predict', methods=['POST'])
    def predict():
        if model_manager.model is None:
            return jsonify({'error': model_manager.error or 'Model not loaded'}), 503

        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        try:
            content = file.read()
            if not content:
                return jsonify({'error': 'Empty file uploaded'}), 400

            # Run Inference
            result = model_manager.predict(content)
            
            # Get Advisory Gist
            gist_text = get_treatment_gist(result['disease'], result['confidence'], result['is_healthy'])

            return jsonify({
                'disease': result['disease'],
                'confidence': result['confidence'],
                'top3': result['top3'],
                'advisory': gist_text,
                'gist': gist_text,
                'status': 'healthy' if result['is_healthy'] else 'diseased'
            })

        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return jsonify({'error': str(e)}), 500
