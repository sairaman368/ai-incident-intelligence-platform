from database.database import get_connection, create_tables
from datetime import datetime, timedelta
import random


TARGET_COUNT = 100


INCIDENTS = [
    {
        "title": "Windows Server CPU High",
        "platform": "Windows",
        "commands": [
            "tasklist",
            "wmic cpu get loadpercentage",
            "Get-Process | Sort-Object CPU -Descending"
        ]
    },
    {
        "title": "Windows Server Memory Leak",
        "platform": "Windows",
        "commands": [
            "Get-Process | Sort-Object WS -Descending",
            "tasklist /v",
            "perfmon"
        ]
    },
    {
        "title": "Windows Service Not Starting",
        "platform": "Windows",
        "commands": [
            "Get-Service",
            "sc query",
            "Get-EventLog -LogName System"
        ]
    },
    {
        "title": "Active Directory Login Failure",
        "platform": "Active Directory",
        "commands": [
            "dcdiag",
            "repadmin /replsummary",
            "nltest /dsgetdc:domain.local"
        ]
    },
    {
        "title": "Group Policy Not Applying",
        "platform": "Active Directory",
        "commands": [
            "gpupdate /force",
            "gpresult /r",
            "eventvwr"
        ]
    },
    {
        "title": "User Account Locked Out",
        "platform": "Active Directory",
        "commands": [
            "Search-ADAccount -LockedOut",
            "Get-ADUser",
            "Event Viewer Security logs"
        ]
    },
    {
        "title": "Exchange Mail Queue Stuck",
        "platform": "Exchange",
        "commands": [
            "Get-Queue",
            "Get-TransportService",
            "Restart-Service MSExchangeTransport"
        ]
    },
    {
        "title": "Exchange Mailbox Access Failure",
        "platform": "Exchange",
        "commands": [
            "Get-Mailbox",
            "Test-MAPIConnectivity",
            "Get-ServerHealth"
        ]
    },
    {
        "title": "IIS Website Down",
        "platform": "IIS",
        "commands": [
            "iisreset /status",
            "Get-WebSite",
            "Get-EventLog -LogName Application"
        ]
    },
    {
        "title": "IIS Application Pool Stopped",
        "platform": "IIS",
        "commands": [
            "Get-WebAppPoolState",
            "Restart-WebAppPool",
            "Get-EventLog -LogName Application"
        ]
    },
    {
        "title": "SQL Server Blocking Sessions",
        "platform": "SQL Server",
        "commands": [
            "sp_who2",
            "DBCC OPENTRAN",
            "SELECT * FROM sys.dm_exec_requests"
        ]
    },
    {
        "title": "SQL Server Database Full",
        "platform": "SQL Server",
        "commands": [
            "sp_spaceused",
            "DBCC SQLPERF(LOGSPACE)",
            "SELECT name, size FROM sys.database_files"
        ]
    },
    {
        "title": "SQL Server Job Failure",
        "platform": "SQL Server",
        "commands": [
            "sp_help_job",
            "sp_help_jobhistory",
            "SQL Agent logs"
        ]
    },
    {
        "title": "Oracle Listener Down",
        "platform": "Oracle",
        "commands": [
            "lsnrctl status",
            "lsnrctl start",
            "tnsping ORCL"
        ]
    },
    {
        "title": "Oracle Tablespace Full",
        "platform": "Oracle",
        "commands": [
            "SELECT tablespace_name FROM dba_data_files",
            "df -h",
            "alert log check"
        ]
    },
    {
        "title": "Linux Disk Space Full",
        "platform": "Linux",
        "commands": [
            "df -h",
            "du -sh /var/log/*",
            "journalctl --disk-usage"
        ]
    },
    {
        "title": "Linux Service Down",
        "platform": "Linux",
        "commands": [
            "systemctl status app",
            "journalctl -u app",
            "systemctl restart app"
        ]
    },
    {
        "title": "Linux High Load Average",
        "platform": "Linux",
        "commands": [
            "uptime",
            "top",
            "ps aux --sort=-%cpu"
        ]
    },
    {
        "title": "Linux SSH Login Failure",
        "platform": "Linux",
        "commands": [
            "systemctl status sshd",
            "tail -f /var/log/secure",
            "lastb"
        ]
    },
    {
        "title": "Nginx 502 Bad Gateway",
        "platform": "Nginx",
        "commands": [
            "systemctl status nginx",
            "nginx -t",
            "tail -f /var/log/nginx/error.log"
        ]
    },
    {
        "title": "Apache Service Unavailable",
        "platform": "Apache",
        "commands": [
            "systemctl status httpd",
            "apachectl configtest",
            "tail -f /var/log/httpd/error_log"
        ]
    },
    {
        "title": "Kubernetes Pod CrashLoopBackOff",
        "platform": "Kubernetes",
        "commands": [
            "kubectl get pods",
            "kubectl describe pod app",
            "kubectl logs app"
        ]
    },
    {
        "title": "Kubernetes ImagePullBackOff",
        "platform": "Kubernetes",
        "commands": [
            "kubectl get pods",
            "kubectl describe pod app",
            "kubectl get secrets"
        ]
    },
    {
        "title": "Kubernetes Node Not Ready",
        "platform": "Kubernetes",
        "commands": [
            "kubectl get nodes",
            "kubectl describe node worker01",
            "journalctl -u kubelet"
        ]
    },
    {
        "title": "Kubernetes Deployment Failed",
        "platform": "Kubernetes",
        "commands": [
            "kubectl rollout status deployment/app",
            "kubectl describe deployment app",
            "kubectl get events"
        ]
    },    {
        "title": "Docker Container Restarting",
        "platform": "Docker",
        "commands": [
            "docker ps -a",
            "docker logs app",
            "docker inspect app"
        ]
    },
    {
        "title": "Docker Image Pull Failure",
        "platform": "Docker",
        "commands": [
            "docker pull image",
            "docker login",
            "docker system info"
        ]
    },
    {
        "title": "Azure VM Unreachable",
        "platform": "Azure",
        "commands": [
            "az vm get-instance-view",
            "az network nsg rule list",
            "Test-NetConnection"
        ]
    },
    {
        "title": "Azure App Service Down",
        "platform": "Azure",
        "commands": [
            "az webapp show",
            "az webapp log tail",
            "az monitor metrics list"
        ]
    },
    {
        "title": "Azure SQL Connection Failure",
        "platform": "Azure SQL",
        "commands": [
            "az sql db show",
            "az sql server firewall-rule list",
            "sqlcmd test"
        ]
    },
    {
        "title": "Azure Storage Access Denied",
        "platform": "Azure Storage",
        "commands": [
            "az storage account show",
            "az role assignment list",
            "az storage blob list"
        ]
    },
    {
        "title": "AWS EC2 Status Check Failed",
        "platform": "AWS EC2",
        "commands": [
            "aws ec2 describe-instance-status",
            "aws cloudwatch get-metric-statistics",
            "systemctl status"
        ]
    },
    {
        "title": "AWS RDS CPU High",
        "platform": "AWS RDS",
        "commands": [
            "aws rds describe-db-instances",
            "aws cloudwatch get-metric-statistics",
            "mysqladmin processlist"
        ]
    },
    {
        "title": "AWS ALB 5xx Errors",
        "platform": "AWS ALB",
        "commands": [
            "aws elbv2 describe-target-health",
            "aws logs tail",
            "curl -I endpoint"
        ]
    },
    {
        "title": "AWS Lambda Timeout",
        "platform": "AWS Lambda",
        "commands": [
            "aws lambda get-function",
            "aws logs tail",
            "aws cloudwatch get-metric-statistics"
        ]
    },
    {
        "title": "VMware VM Not Responding",
        "platform": "VMware",
        "commands": [
            "esxtop",
            "vim-cmd vmsvc/getallvms",
            "vmware.log check"
        ]
    },
    {
        "title": "VMware Datastore Full",
        "platform": "VMware",
        "commands": [
            "df -h",
            "esxcli storage filesystem list",
            "vCenter datastore check"
        ]
    },
    {
        "title": "Citrix User Session Failure",
        "platform": "Citrix",
        "commands": [
            "Get-BrokerSession",
            "Get-BrokerMachine",
            "Citrix Director check"
        ]
    },
    {
        "title": "Citrix VDA Registration Failed",
        "platform": "Citrix",
        "commands": [
            "Get-BrokerMachine",
            "VDA service status",
            "Event Viewer check"
        ]
    },
    {
        "title": "Network Packet Loss",
        "platform": "Network",
        "commands": [
            "ping gateway",
            "tracert destination",
            "show interface counters"
        ]
    },
    {
        "title": "Firewall Rule Blocking Traffic",
        "platform": "Firewall",
        "commands": [
            "show access-list",
            "packet-tracer input",
            "firewall log check"
        ]
    },
    {
        "title": "VPN Authentication Failure",
        "platform": "VPN",
        "commands": [
            "radius logs",
            "vpn sessiondb",
            "auth log check"
        ]
    },
    {
        "title": "DNS Resolution Failure",
        "platform": "DNS",
        "commands": [
            "nslookup app.local",
            "dig app.local",
            "ipconfig /flushdns"
        ]
    },
    {
        "title": "DHCP Scope Exhausted",
        "platform": "DHCP",
        "commands": [
            "netsh dhcp show scope",
            "dhcp logs",
            "ipconfig /renew"
        ]
    },
    {
        "title": "Security Malware Alert",
        "platform": "Security",
        "commands": [
            "Defender scan",
            "Get-MpThreat",
            "isolate endpoint"
        ]
    },
    {
        "title": "Unauthorized Login Attempts",
        "platform": "Security",
        "commands": [
            "Event Viewer Security logs",
            "Get-ADUser",
            "SIEM alert review"
        ]
    },
    {
        "title": "Certificate Expired",
        "platform": "Security",
        "commands": [
            "openssl s_client",
            "certmgr.msc",
            "Get-ChildItem Cert:"
        ]
    },
    {
        "title": "Application API Latency High",
        "platform": "Application",
        "commands": [
            "curl -w response_time",
            "kubectl logs api",
            "APM trace check"
        ]
    },
    {
        "title": "Payment API Outage",
        "platform": "Application",
        "commands": [
            "kubectl get pods",
            "kubectl logs payment-api",
            "kubectl rollout status deployment/payment-api"
        ]
    },
    {
        "title": "Database Connection Pool Exhausted",
        "platform": "Application",
        "commands": [
            "application logs",
            "database sessions",
            "connection pool metrics"
        ]
    }
]

def build_runbook(title, platform, commands, severity, confidence):

    command_text = "\n".join([f"- {cmd}" for cmd in commands])

    return f"""# AI Incident Intelligence Report

## 1. Incident Summary
The incident "{title}" was detected in the {platform} environment and requires immediate investigation.

## 2. Severity Assessment
Severity: {severity}

The severity is based on the affected service, business impact, and operational risk.

## 3. Business Impact
Users may experience service degradation, transaction failures, slow response, or complete outage depending on the affected workload.

## 4. Probable Root Cause
Possible causes include service failure, configuration drift, infrastructure issue, deployment failure, dependency outage, resource exhaustion, or networking problems.

## 5. Diagnostic Commands

{command_text}

## 6. Resolution Plan

1. Validate alerts.
2. Review logs.
3. Verify infrastructure health.
4. Restart or recover affected services.
5. Escalate if required.

## 7. Rollback Plan

Rollback the latest deployment, configuration, patch, or infrastructure change if identified as the trigger.

## 8. Validation Steps

1. Verify service health.
2. Validate application functionality.
3. Confirm monitoring is green.
4. Perform user validation.
5. Close incident.

## 9. Preventive Actions

- Improve monitoring
- Configure alert thresholds
- Review capacity
- Update runbooks
- Schedule preventive maintenance

## 10. Estimated Resolution Time

20–60 Minutes

## 11. AI Confidence Score

{confidence}%

The confidence score is based on historical enterprise incident patterns.
"""


def seed_enterprise_data():

    create_tables()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM incidents")

    severities = [
        "Critical",
        "High",
        "Medium",
        "Low"
    ]

    start_date = datetime.now() - timedelta(days=30)

    for i in range(TARGET_COUNT):

        incident = INCIDENTS[i % len(INCIDENTS)]

        title = incident["title"]
        platform = incident["platform"]
        commands = incident["commands"]

        severity = random.choice(severities)
        confidence = random.randint(80, 98)

        runbook = build_runbook(
            title,
            platform,
            commands,
            severity,
            confidence
        )

        created = start_date + timedelta(
            days=random.randint(0, 30),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )

        cursor.execute(
            """
            INSERT INTO incidents
            (
                incident_title,
                commands,
                runbook,
                created_at
            )
            VALUES
            (?, ?, ?, ?)
            """,
            (
                f"{title} - Case {i+1:03}",
                "\n".join(commands),
                runbook,
                created.strftime("%Y-%m-%d %H:%M:%S")
            )
        )

    conn.commit()

    cursor.execute(
        "SELECT COUNT(*) AS total FROM incidents"
    )

    total = cursor.fetchone()["total"]

    conn.close()

    print("=" * 60)
    print("Enterprise Dataset Created Successfully")
    print(f"Total Runbooks : {total}")
    print("=" * 60)
    if __name__ == "__main__":
    seed_enterprise_data()