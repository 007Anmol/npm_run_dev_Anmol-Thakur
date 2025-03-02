<<<<<<< HEAD
import requests

class LLMConnector:
    def __init__(self, api_url: str):
        self.api_url = api_url

    def generate_legal_summary(self, text: str) -> str:
        """Calls an external LLM API to summarize a legal document."""
        payload = {"text": text}
        try:
            response = requests.post(f"{self.api_url}/summarize", json=payload)
            if response.status_code == 200:
                return response.json().get("summary", "No summary available.")
            return "Error: Failed to connect to LLM API."
        except Exception as e:
            return f"Exception occurred: {str(e)}"

# Example usage:
if __name__ == "__main__":
    connector = LLMConnector("https://free-llm-api.com")
    sample_text = "This legal case involves a dispute over property ownership..."
    print(connector.generate_legal_summary(sample_text))
=======
import requests

class LLMConnector:
    def __init__(self, api_url: str):
        self.api_url = api_url

    def generate_legal_summary(self, text: str) -> str:
        """Calls an external LLM API to summarize a legal document."""
        payload = {"text": text}
        try:
            response = requests.post(f"{self.api_url}/summarize", json=payload)
            if response.status_code == 200:
                return response.json().get("summary", "No summary available.")
            return "Error: Failed to connect to LLM API."
        except Exception as e:
            return f"Exception occurred: {str(e)}"

# Example usage:
if __name__ == "__main__":
    connector = LLMConnector("https://free-llm-api.com")
    sample_text = "This legal case involves a dispute over property ownership..."
    print(connector.generate_legal_summary(sample_text))
>>>>>>> ac73e99c020b2d7bb0bc31f1d8f215e36d80d296
