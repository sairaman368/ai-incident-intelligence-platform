import requests
import time

prompt = "Incident: Database Down"

print("Sending...")

start = time.time()

response = requests.post(
    "http://127.0.0.1:11434/api/chat",
    json={
        "model": "llama3:latest",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "stream": False,
        "options": {
            "temperature": 0
        }
    },
    timeout=120
)

print("Done")
print(response.status_code)
print("Elapsed:", round(time.time() - start, 2))
print(response.text)