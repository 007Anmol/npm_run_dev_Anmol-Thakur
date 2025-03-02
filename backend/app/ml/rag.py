from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class RAGModel:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.documents = {}

    def add_document(self, doc_id: str, text: str):
        """Stores document embeddings for retrieval."""
        embedding = self.model.encode([text])[0]
        self.documents[doc_id] = (text, embedding)

    def retrieve_relevant(self, query: str, top_k: int = 3):
        """Finds the most relevant documents using cosine similarity."""
        query_embedding = self.model.encode([query])[0]
        similarities = [
            (doc_id, cosine_similarity([embedding], [query_embedding])[0][0])
            for doc_id, (_, embedding) in self.documents.items()
        ]
        similarities.sort(key=lambda x: x[1], reverse=True)
        return [self.documents[doc_id][0] for doc_id, _ in similarities[:top_k]]

# Example usage:
if __name__ == "__main__":
    rag = RAGModel()
    rag.add_document("doc1", "The plaintiff filed a complaint about the land dispute.")
    print(rag.retrieve_relevant("land ownership case"))
