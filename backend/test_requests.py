import requests

print("Step 1")

r = requests.post(
    "http://127.0.0.1:11434/api/chat",
    json={
        "model": "llama3:latest",
        "messages": [
            {
                "role": "user",
                "content": "Say Hello"
            }
        ],
        "stream": False
    },
    timeout=120
)

print("Step 2")
print(r.status_code)
print(r.text)