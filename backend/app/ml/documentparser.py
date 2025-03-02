import re
from typing import List, Dict

class DocumentParser:
    def __init__(self, document: str):
        self.document = document

    def extract_dates(self) -> List[str]:
        """Extracts dates from the document in multiple formats."""
        date_patterns = [
            r"\d{2}/\d{2}/\d{4}",  # 12/05/2023
            r"\d{4}-\d{2}-\d{2}",  # 2023-05-12
            r"\d{1,2} [A-Za-z]+ \d{4}"  # 12 May 2023
        ]
        matches = []
        for pattern in date_patterns:
            matches.extend(re.findall(pattern, self.document))
        return matches

    def extract_legal_terms(self) -> List[str]:
        """Finds common legal terms in the document."""
        legal_terms = ["plaintiff", "defendant", "jurisdiction", "affidavit", "testimony"]
        found_terms = [term for term in legal_terms if term.lower() in self.document.lower()]
        return found_terms

    def parse(self) -> Dict:
        """Parses the document and extracts structured data."""
        return {
            "dates": self.extract_dates(),
            "legal_terms": self.extract_legal_terms(),
            "word_count": len(self.document.split())
        }

# Example usage:
if __name__ == "__main__":
    doc = """On 12 May 2023, the plaintiff submitted an affidavit to the court..."""
    parser = DocumentParser(doc)
    print(parser.parse())
