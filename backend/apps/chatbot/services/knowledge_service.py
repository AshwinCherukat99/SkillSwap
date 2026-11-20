from django.db import transaction
from apps.chatbot.models import KnowledgeChunk
from .chunking_service import TextChunkingService
from .embedding_service import GeminiEmbeddingService

class KnowledgeIngestionService:
    def __init__(self):
        self.chunker=TextChunkingService(
            max_words=350,
            overlap_words=40
        )
        self.embedding_service=GeminiEmbeddingService()
    def process_document(self,document):
        if not document.content or not document.content.strip():
            raise ValueError(
                'knowledge document content cannot be empty'
            )
        chunks=self.chunker.chunk_text(
            document.content
        )
        if not chunks: 
            raise ValueError(
                'no chunks were generated'
            )
        knowledge_chunks=[]
        for index,chunk_content in enumerate(chunks):
            embedding=(
                self.embedding_service.generate_document_embedding(
                    text=chunk_content,
                    title=document.title
                )
            )
            knowledge_chunks.append(
                KnowledgeChunk(
                    document=document,
                    content=chunk_content,
                    embedding=embedding,
                    chunk_index=index
                )
            )
        with transaction.atomic():
            KnowledgeChunk.objects.filter(
                document=document
            ).delete()
            KnowledgeChunk.objects.bulk_create(
                knowledge_chunks,
                batch_size=100
            )
        return {
            'document_id':document.id,
            'total_chunks':len(knowledge_chunks),
            'message':'knowledge document processed successfully'
        }
def process_knowledge_document(document):
    service=KnowledgeIngestionService()
    return service.process_document(document)