import logging
import requests # type: ignore
from core.config import OPENROUTER_API_KEY, AI_MODELS

logger = logging.getLogger(__name__)

def build_fallback_gist(disease_name: str, confidence: float, is_healthy: bool) -> str:
    if is_healthy:
        return (
            f"Result: {disease_name.title()} at {confidence:.1f}% confidence.\n"
            "Action: Keep watering steady and inspect new leaves for fresh spots.\n"
            "Treatment: No treatment needed now; focus on airflow and clean pruning."
        )

    return (
        f"Result: {disease_name.title()} detected at {confidence:.1f}% confidence.\n"
        "Action: Remove infected leaves and keep foliage dry after watering.\n"
        "Treatment: Start a labeled fungicide or neem spray and improve airflow."
    )

def get_treatment_gist(disease_name: str, confidence: float, is_healthy: bool) -> str:
    fallback_gist = build_fallback_gist(disease_name, confidence, is_healthy)

    if not OPENROUTER_API_KEY:
        return fallback_gist

    prompt = f"""
    A tomato leaf classifier predicted "{disease_name}" at {confidence:.1f}% confidence.
    Return a short UI-ready {'care' if is_healthy else 'treatment'} gist.
    Write exactly 3 plain-text lines in this format:
    Result: ...
    Action: ...
    Treatment: ...
    Keep the total response under {'45' if is_healthy else '55'} words and do not use markdown or emojis.
    """

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://127.0.0.1:5050",
        "X-Title": "LeafAI"
    }

    for model_id in AI_MODELS:
        try:
            body = {
                "model": model_id,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.4,
                "max_tokens": 150
            }
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions", 
                headers=headers, 
                json=body, 
                timeout=12
            )
            if response.status_code == 200:
                result = response.json()
                content = result.get('choices', [{}])[0].get('message', {}).get('content', '').strip()
                if content:
                    logger.info(f"AI advisory generated using model: {model_id}")
                    return content
            else:
                logger.warning(f"Model {model_id} failed with status {response.status_code}")
        except Exception as exc:
            logger.error(f"Error calling model {model_id}: {exc}")
            continue

    return fallback_gist
