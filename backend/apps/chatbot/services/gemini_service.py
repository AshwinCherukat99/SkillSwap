from django.conf import settings
from google import genai
from google.genai import types
from datetime import time

client=genai.Client(
        api_key=settings.GEMINI_API_KEY
    )

GEMINI_MODELS = [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-3-flash',
]

RETRIES=3

SYSTEM_PROMPT="""
You are the official AI assistant of SkillSwap.

ABOUT SKILLSWAP:
SkillSwap is a social learning and mentoring platform where
users can learn skills, connect with mentors, attend sessions,
enroll in courses and interact with other learners.

YOUR RESPONSIBILITIES:
1. Explain SkillSwap features and functionality.
2. Help users understand how to navigate the platform.
3. Answer questions about courses, mentors, sessions,
   skill exchange, profiles, reviews and other platform features.
4. Provide clear and friendly instructions.
5. Understand follow-up questions using conversation history.

IMPORTANT RULES:
1. Only answer questions related to SkillSwap and its platform.
2. If a question is unrelated to SkillSwap, politely explain
   that you can only assist with SkillSwap-related questions.
3. Never invent features, policies, payment details or functionality.
4. If you do not know something about SkillSwap, say so honestly.
5. Do not claim that you have performed an action in the application.
6. You cannot access private user information or application databases.
7. Keep responses helpful, clear and reasonably concise.

Your name is SkillSwap Assistant.
"""
def generate_chat_response(messages):
    if not settings.GEMINI_API_KEY:
        raise ValueError('gemini api key is not configured')
    recent_messages=messages[-20:]
    conversation_history=[]
    for message in recent_messages:
        role=message['role']
        if role=='USER':
            gemini_role='user'
        elif role=='ASSISTANT':
            gemini_role='model'
        else:
            continue
        conversation_history.append(
            types.Content(
                role=gemini_role,
                parts=[
                    types.Part(
                        text=message['content']
                    )
                ]
            )
        )
    last_exception=None
    for model in GEMINI_MODELS:
        for attempt in range(RETRIES):
            try:
                print(
                    f'trying gemini model:{model}'
                    f'(attempt {attempt+1}/{RETRIES})'
                )
                response=client.models.generate_content(
        model=model,
        contents=conversation_history,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.4,
            max_output_tokens=800
        )
    )
                if response.text:
                    print(f'successfully generated response using model {model}')
                    return response.text.strip()
                raise ValueError(
                    f'{model} reutrned an empty response'
                )
            except Exception as exc:
                last_exception=exc
                print(
                    f'gemini model {model} failed'
                    f'on attempt {attempt+1}:{exc}'
                )
                if attempt<RETRIES-1:
                    time.sleep(3)
    raise RuntimeError(
        'all gemini models failed after retries'
    ) from last_exception