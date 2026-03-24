import logging
import json
import numpy as np # type: ignore
import tensorflow as tf # type: ignore
from PIL import Image # type: ignore
from typing import Optional

logger = logging.getLogger(__name__)

class ModelManager:
    def __init__(self, model_path: str, class_names_path: str):
        self.model_path = model_path
        self.class_names_path = class_names_path
        self.model = None
        self.class_names = []
        self.error: Optional[str] = None
        self.load_resources()

    def load_resources(self):
        try:
            logger.info(f"Loading model from {self.model_path}...")
            self.model = tf.keras.models.load_model(self.model_path)
            logger.info("Model loaded successfully.")
            
            with open(self.class_names_path, 'r') as f:
                self.class_names = json.load(f)
            logger.info(f"Loaded {len(self.class_names)} class names.")
        except Exception as e:
            self.error = str(e)
            logger.error(f"Failed to load resources: {e}")

    def preprocess_image(self, image_bytes: bytes):
        from io import BytesIO
        img = Image.open(BytesIO(image_bytes))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        return np.expand_dims(img_array, axis=0)

    def predict(self, image_bytes: bytes) -> dict:
        if not self.model:
            raise RuntimeError(f"Model not loaded: {self.error}")

        input_data = self.preprocess_image(image_bytes)
        if self.model is None:
             raise RuntimeError("Model is not loaded.")
        predictions = self.model.predict(input_data)[0]
        
        # Get Top Prediction
        top_idx = np.argmax(predictions)
        disease_name = self.class_names[top_idx].replace('_', ' ')
        confidence = float(predictions[top_idx])

        # Get Top 3 Breakdown
        top3_indices = np.argsort(predictions)[-3:][::-1]
        top3 = [
            {
                'disease': self.class_names[i].replace('_', ' '),
                'confidence': float(f"{float(predictions[i]) * 100:.1f}")
            } 
            for i in top3_indices
        ]

        return {
            'disease': disease_name,
            'confidence': float(f"{float(confidence) * 100:.1f}"),
            'top3': top3,
            'is_healthy': 'healthy' in disease_name.lower()
        }
