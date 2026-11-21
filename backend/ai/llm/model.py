from django.conf import settings
from langchain_google_genai import ChatGoogleGenerativeAI

def get_chat_model(
        temperature=0.4,
        max_output_tokens=800
):
    if not settings.GEMINI_API_KEY:
        raise ValueError(
            'Gemini API key is not configured'
        )
    return ChatGoogleGenerativeAI(
        model='gemini-3.8-flash',
        google_api_key=settings.GEMINI_API_KEY,
        temperature=temperature,
        max_output_tokens=max_output_tokens
    )