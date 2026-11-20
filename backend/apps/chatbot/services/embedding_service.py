import math
from django.conf import settings
from google import genai
from google.genai import types

EMBEDDING_MODEL='gemini-embedding-001'
EMBEDDING_DIMENSIONS=768

class GeminiEmbeddingService:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError(
                'gemini api key is not configured'
            )
        self.client=genai.Client(
            api_key=settings.GEMINI_API_KEY
        )
    def _normalize_embedding(self,values):
        magnitude=math.sqrt(
            sum(value*value for value in values)
        )
        if magnitude==0:
            raise ValueError(
                'gemini returned a zero magnitude embedding'
            )
        return [
            value/magnitude
            for value in values
        ]
    def _generate_embedding(self,text,task_type,title=None):
        if not text or not text.strip():
            return ValueError(
                'cannot generate embedding for empty text'
            )
        config=types.EmbedContentConfig(
            task_type=task_type,
            output_dimensionality=EMBEDDING_DIMENSIONS,
            title=title
        )
        response=self.client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=text,
            config=config
        )
        if not response.embeddings:
            raise RuntimeError(
                'gemini returned no embeddings'
            )
        values=response.embeddings[0].values
        if not values:
            raise RuntimeError(
                'gemini returned an empty embedding vecgor'
            )
        if len(values)!=EMBEDDING_DIMENSIONS:
            raise ValueError(
                f'expected {EMBEDDING_DIMENSIONS} dimensions, got {len(values)}'
            )
        return self._normalize_embedding(values)
    def generate_document_embedding(self,text,title=None): 
        return self._generate_embedding(
            text=text,
            task_type='RETRIEVAL_DOCUMENT',
            title=title
        )
    def generate_query_embedding(self,query):
        return self._generate_embedding(
            text=query,
            task_type='RETRIEVAL_QUERY'
        )
def generate_document_embedding(text,title=None):
    service=GeminiEmbeddingService()
    return service.generate_document_embedding(
        text=text,
        title=title
    )
def generate_query_embedding(query):
    service=GeminiEmbeddingService()
    return service.generate_query_embedding(query)