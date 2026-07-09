from database.database import get_connection, create_tables


SAMPLE_INCIDENTS = [
    {
        "title": "Database Down",
        "commands": "systemctl status mysql\nsystemctl restart mysql\njournalctl -u mysql",
        "runbook": """# AI Incident Intelligence Report

## 1. Incident Summary
Database service is unavailable.

## 2. Severity Assessment
Severity: High

## 3. Business Impact
Application users may face login, transaction, or reporting failures.

## 4. Probable Root Cause
Database service crash or resource exhaustion.

## 5. Diagnostic Commands
- systemctl status mysql
- journalctl -u mysql
- df -h
- free -m

## 6. Resolution Plan
Restart database service and verify connectivity.

## 7. Rollback Plan
Revert recent database configuration changes.

## 8. Validation Steps
Confirm application can connect to database.

## 9. Preventive Actions
Enable monitoring and alerting.

## 10. Estimated Resolution Time
15 to 30 minutes.

## 11. AI Confidence Score
85%
"""
    },
    {
        "title": "Payment API Outage",
        "commands": "kubectl get pods\nkubectl logs payment-api\nkubectl rollout restart deployment/payment-api",
        "runbook": """# AI Incident Intelligence Report

## 1. Incident Summary
Payment API is unavailable after deployment.

## 2. Severity Assessment
Severity: Critical

## 3. Business Impact
Payment transactions may fail.

## 4. Probable Root Cause
Bad deployment or pod crash.

## 5. Diagnostic Commands
- kubectl get pods
- kubectl logs payment-api
- kubectl describe pod payment-api

## 6. Resolution Plan
Restart or rollback payment-api deployment.

## 7. Rollback Plan
Rollback to previous stable version.

## 8. Validation Steps
Test payment API endpoint.

## 9. Preventive Actions
Add deployment health checks.

## 10. Estimated Resolution Time
20 to 45 minutes.

## 11. AI Confidence Score
90%
"""
    },
    {
        "title": "Windows Server CPU High",
        "commands": "tasklist\nGet-Process\nGet-EventLog -LogName System",
        "runbook": """# AI Incident Intelligence Report

## 1. Incident Summary
Windows server CPU utilization is high.

## 2. Severity Assessment
Severity: Medium

## 3. Business Impact
Applications may become slow.

## 4. Probable Root Cause
High CPU process or background service issue.

## 5. Diagnostic Commands
- tasklist
- Get-Process
- perfmon
- eventvwr

## 6. Resolution Plan
Identify and restart problematic process.

## 7. Rollback Plan
Restore previous application state if recent change caused issue.

## 8. Validation Steps
Confirm CPU usage returns to normal.

## 9. Preventive Actions
Configure CPU monitoring alerts.

## 10. Estimated Resolution Time
15 to 30 minutes.

## 11. AI Confidence Score
80%
"""
    },
    {
        "title": "Disk Space Full",
        "commands": "df -h\ndu -sh /var/log/*\nls -lh /var/log",
        "runbook": """# AI Incident Intelligence Report

## 1. Incident Summary
Server disk space is full.

## 2. Severity Assessment
Severity: High

## 3. Business Impact
Applications may fail to write logs or data.

## 4. Probable Root Cause
Large log files or storage growth.

## 5. Diagnostic Commands
- df -h
- du -sh /*
- ls -lh /var/log

## 6. Resolution Plan
Clean logs and rotate large files.

## 7. Rollback Plan
Restore deleted files from backup if needed.

## 8. Validation Steps
Confirm free disk space is available.

## 9. Preventive Actions
Enable log rotation and disk alerts.

## 10. Estimated Resolution Time
10 to 25 minutes.

## 11. AI Confidence Score
88%
"""
    },
    {
        "title": "Kubernetes Pod CrashLoopBackOff",
        "commands": "kubectl get pods\nkubectl describe pod app\nkubectl logs app",
        "runbook": """# AI Incident Intelligence Report

## 1. Incident Summary
Kubernetes pod is stuck in CrashLoopBackOff.

## 2. Severity Assessment
Severity: High

## 3. Business Impact
Application service may be unavailable.

## 4. Probable Root Cause
Application crash, bad config, or missing dependency.

## 5. Diagnostic Commands
- kubectl get pods
- kubectl describe pod
- kubectl logs

## 6. Resolution Plan
Fix configuration or rollback deployment.

## 7. Rollback Plan
Rollback Kubernetes deployment.

## 8. Validation Steps
Confirm pods are running.

## 9. Preventive Actions
Add readiness and liveness probes.

## 10. Estimated Resolution Time
20 to 40 minutes.

## 11. AI Confidence Score
87%
"""
    }
]


def seed_to_100():
    create_tables()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as count FROM incidents")
    current_count = cursor.fetchone()["count"]

    target_count = 100
    records_needed = target_count - current_count

    if records_needed <= 0:
        print(f"Database already has {current_count} runbooks.")
        conn.close()
        return

    for index in range(records_needed):
        sample = SAMPLE_INCIDENTS[index % len(SAMPLE_INCIDENTS)]

        title = sample["title"]
        commands = sample["commands"]
        runbook = sample["runbook"]

        cursor.execute(
            """
            INSERT INTO incidents
            (
                incident_title,
                commands,
                runbook
            )
            VALUES (?, ?, ?)
            """,
            (
                title,
                commands,
                runbook
            )
        )

    conn.commit()

    cursor.execute("SELECT COUNT(*) as count FROM incidents")
    final_count = cursor.fetchone()["count"]

    conn.close()

    print("Seed completed successfully.")
    print(f"Previous count: {current_count}")
    print(f"Final count: {final_count}")


if __name__ == "__main__":
    seed_to_100()