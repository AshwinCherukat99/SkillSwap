import re

class TextChunkingService:
    def __init__(self,max_words=350,overlap_words=40): 
        if max_words<=0:
            raise ValueError(
                'max words must be greate than 0'
            )
        if overlap_words<0 or overlap_words>=max_words:
            raise ValueError(
                'overlap words must be non-negative and less than max words'
            )
        self.max_words=max_words
        self.overlap_words=overlap_words
    def _split_sentences(self,text):
        sentences=re.split(
            r'(?<=[.!?])\s+',
            text.strip()
        )
        return [
            sentence.strip()
            for sentence in sentences 
            if sentence.strip()
        ]
    def chunk_text(self,text):
        if not text or not text.strip():
            raise ValueError(
                'cannot chunk empty text'
            )
        sentences=self._split_sentences(text)
        chunks=[]
        current_sentences=[] 
        current_word_count=0
        for sentence in sentences:
            sentence_word_count=len(sentence.split())
            if sentence_word_count>self.max_words:
                if current_sentences:
                    chunks.append(
                        ' '.join(current_sentences)
                    )
                    current_sentences=[]
                    current_word_count=0
                words=sentence.split()
                for start in range(
                    0,
                    len(words),
                    self.max_words-self.overlap_words
                ):
                    word_chunk=words[
                        start:start+self.max_words
                    ]
                    if word_chunk:
                        chunks.append(
                            ' '.join(word_chunk)
                        )
                continue
            if (
                current_word_count+sentence_word_count>self.max_words
            ):
                chunks.append(
                    ' '.join(current_sentences)
                )
                previous_text=' '.join(current_sentences)
                previous_words=previous_text.split()
                overlap=previous_words[
                    -self.overlap_words:
                ] if self.overlap_words else []
                current_sentences=(
                    [' '.join(overlap)] if overlap else []
                )
                current_word_count=len(overlap)
                if current_word_count+sentence_word_count>self.max_words:
                    current_sentences=[]
                    current_word_count=0
            current_sentences.append(sentence)
            current_word_count+=sentence_word_count
        if current_sentences:
            chunks.append(
                ' '.join(current_sentences)
            )
        return [
            chunk.strip()
            for chunk in chunks
            if chunk.strip()
        ]
def chunk_text(text,max_words=350,overlap_words=40):
    service=TextChunkingService(
        max_words=max_words,
        overlap_words=overlap_words
    )
    return service.chunk_text(text)