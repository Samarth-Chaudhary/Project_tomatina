import logging
from flask import Flask # type: ignore
from flask_cors import CORS # type: ignore
from core.config import FRONTEND_DIR, HOST, PORT, DEBUG
from api.routes import register_routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path='')
    CORS(app)
    
    # Register API routes
    register_routes(app)
    
    return app

app = create_app()

if __name__ == '__main__':
    logger.info(f"Starting LeafAI production-ready backend on {HOST}:{PORT}")
    app.run(debug=DEBUG, port=PORT, host=HOST)
