from django.conf import settings
from pgvector.django import CosineDistance
from apps.chatbot.models import KnowledgeChunk
from .embedding_service import GeminiEmbeddingService

class KnowledgeRetrievalService:
    def __init__(self,top_k=5,max_distance=None):
        if top_k<=0:
            raise ValueError(
                'top_k must be greater than zero'
            )
        self.top_k=top_k
        self.max_distance=(
            max_distance
            if max_distance is not None
            else getattr(
                settings,
                'CHATBOT_MAX_COSINE_DISTANCE',
                0.45
            )
        )
        if not 0<=max_distance<=2:
            raise ValueError(
                'max distance must be between 0 and 2'
            )
        self.embedding_service=GeminiEmbeddingService()
    def _get_allowed_audiences(self,account_type):
        if account_type=='USER':
            return ['BOTH','USER']
        if account_type=='MENTOR':
            return ['BOTH','MENTOR']
        raise ValueError('invalid account type')
    def retrieve_relevant_chunks(self,query,account_type):
        if not query or not query.strip():
            raise ValueError(
                'query cannot be empty'
            )
        query_embedding=(
            self.embedding_service.generate_query_embedding(query)
        )
        allowed_audiences=self._get_allowed_audiences(
            account_type
        )
        relevant_chunks=(
            KnowledgeChunk.objects.filter(
                document__is_active=True,
                document__audience__in=allowed_audiences
            ).annotate(
                distance=CosineDistance(
                    'embedding',
                    query_embedding
                )
            ).filter(
                distance__lte=self.max_distance
            )
            .select_related('document')
            .order_by('distance')[:self.top_k]
        )
        results=[]
        for chunk in relevant_chunks:
            results.append({
                'content':chunk.content,
                'document_title':chunk.document.title,
                'category':chunk.document.category,
                'distance':chunk.distance,
                'similarity':1-chunk.distance,
            })
        print('Account Type:',account_type)
        print('No of results:',len(results))
        return results
def retrieve_relevant_chunks(query,account_type,top_k=5,max_distance=None):
    service=KnowledgeRetrievalService(top_k=top_k,max_distance=max_distance)
    return service.retrieve_relevant_chunks(
        query=query,
        account_type=account_type
    )