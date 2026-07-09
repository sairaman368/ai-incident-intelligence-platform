from services.ai_service import generate_runbook

incident = "Payment API outage after deployment"

commands = """
kubectl get pods
kubectl logs payment-api
kubectl rollout restart deployment/payment-api
"""

print("Generating AI Runbook...\n")

result = generate_runbook(
    incident,
    commands
)

print(result)