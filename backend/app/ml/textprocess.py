import re
import spacy

class TextProcessor:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")

    def clean_text(self, text: str) -> str:
        """Removes special characters and converts text to lowercase."""
        return re.sub(r"[^a-zA-Z0-9\s]", "", text).lower()

    def extract_entities(self, text: str):
        """Uses NLP to extract named entities."""
        doc = self.nlp(text)
        return {ent.text: ent.label_ for ent in doc.ents}

    def process(self, text: str):
        """Cleans, extracts named entities, and returns insights."""
        cleaned_text = self.clean_text(text)
        entities = self.extract_entities(text)
        return {"cleaned_text": cleaned_text, "entities": entities}

# Example usage:
if __name__ == "__main__":
    processor = TextProcessor()
    sample_text = "On 5th March 2024, John Doe filed a lawsuit in the New York Supreme Court."
    print(processor.process(sample_text))
