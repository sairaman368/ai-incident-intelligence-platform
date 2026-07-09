from services.ai_service import generate_runbook

print("Starting Test")

result = generate_runbook(
    "Database Down",
    "systemctl restart mysql"
)

print(result)