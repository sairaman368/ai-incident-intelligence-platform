from database.database import get_connection, create_tables
from datetime import datetime, timedelta
import random

TARGET_COUNT = 100

INCIDENTS = [
    ("Windows Server CPU High", "Windows", ["tasklist", "wmic cpu get loadpercentage", "Get-Process | Sort-Object CPU -Descending"]),
    ("Windows Server Memory Leak", "Windows", ["Get-Process | Sort-Object WS -Descending", "tasklist /v", "perfmon"]),
    ("Windows Service Not Starting", "Windows", ["Get-Service", "sc query", "Get-EventLog -LogName System"]),
    ("Active Directory Login Failure", "Active Directory", ["dcdiag", "repadmin /replsummary", "nltest /dsgetdc:domain.local"]),
    ("Group Policy Not Applying", "Active Directory", ["gpupdate /force", "gpresult /r", "eventvwr"]),
    ("User Account Locked Out", "Active Directory", ["Search-ADAccount -LockedOut", "Get-ADUser", "Event Viewer Security logs"]),
    ("Exchange Mail Queue Stuck", "Exchange", ["Get-Queue", "Get-TransportService", "Restart-Service MSExchangeTransport"]),
    ("Exchange Mailbox Access Failure", "Exchange", ["Get-Mailbox", "Test-MAPIConnectivity", "Get-ServerHealth"]),
    ("IIS Website Down", "IIS", ["iisreset /status", "Get-WebSite", "Get-EventLog -LogName Application"]),
    ("IIS Application Pool Stopped", "IIS", ["Get-WebAppPoolState", "Restart-WebAppPool", "Get-EventLog -LogName Application"]),
    ("SQL Server Blocking Sessions", "SQL Server", ["sp_who2", "DBCC OPENTRAN", "SELECT * FROM sys.dm_exec_requests"]),
    ("SQL Server Database Full", "SQL Server", ["sp_spaceused", "DBCC SQLPERF(LOGSPACE)", "SELECT name, size FROM sys.database_files"]),
    ("SQL Server Job Failure", "SQL Server", ["sp_help_job", "sp_help_jobhistory", "SQL Agent logs"]),
    ("Oracle Listener Down", "Oracle", ["lsnrctl status", "lsnrctl start", "tnsping ORCL"]),
    ("Oracle Tablespace Full", "Oracle", ["SELECT tablespace_name FROM dba_data_files", "df -h", "alert log check"]),
    ("Linux Disk Space Full", "Linux", ["df -h", "du -sh /var/log/*", "journalctl --disk-usage"]),
    ("Linux Service Down", "Linux", ["systemctl status app", "journalctl -u app", "systemctl restart app"]),
    ("Linux High Load Average", "Linux", ["uptime", "top", "ps aux --sort=-%cpu"]),
    ("Linux SSH Login Failure", "Linux", ["systemctl status sshd", "tail -f /var/log/secure", "lastb"]),
    ("Nginx 502 Bad Gateway", "Nginx", ["systemctl status nginx", "nginx -t", "tail -f /var/log/nginx/error.log"]),
    ("Apache Service Unavailable", "Apache", ["systemctl status httpd", "apachectl configtest", "tail -f /var/log/httpd/error_log"]),
    ("Kubernetes Pod CrashLoopBackOff", "Kubernetes", ["kubectl get pods", "kubectl describe pod app", "kubectl logs app"]),
    ("Kubernetes ImagePullBackOff", "Kubernetes", ["kubectl get pods", "kubectl describe pod app", "kubectl get secrets"]),
    ("Kubernetes Node Not Ready", "Kubernetes", ["kubectl get nodes", "kubectl describe node worker01", "journalctl -u kubelet"]),
    ("Kubernetes Deployment Failed", "Kubernetes", ["kubectl rollout status deployment/app", "kubectl describe deployment app", "kubectl get events"]),
    ("Docker Container Restarting", "Docker", ["docker ps -a", "docker logs app", "docker inspect app"]),
    ("Docker Image Pull Failure", "Docker", ["docker pull image", "docker login", "docker system info"]),
    ("Azure VM Unreachable", "Azure", ["az vm get-instance-view", "az network nsg rule list", "Test-NetConnection"]),
    ("Azure App Service Down", "Azure", ["az webapp show", "az webapp log tail", "az monitor metrics list"]),
    ("Azure SQL Connection Failure", "Azure SQL", ["az sql db show", "az sql server firewall-rule list", "sqlcmd test"]),
    ("Azure Storage Access Denied", "Azure Storage", ["az storage account show", "az role assignment list", "az storage blob list"]),
    ("Azure AKS Node Pool Issue", "Azure AKS", ["az aks show", "kubectl get nodes", "kubectl describe node"]),
    ("Azure Key Vault Access Failure", "Azure Key Vault", ["az keyvault show", "az keyvault secret list", "az role assignment list"]),
    ("AWS EC2 Status Check Failed", "AWS EC2", ["aws ec2 describe-instance-status", "aws cloudwatch get-metric-statistics", "systemctl status"]),
    ("AWS RDS CPU High", "AWS RDS", ["aws rds describe-db-instances", "aws cloudwatch get-metric-statistics", "mysqladmin processlist"]),
    ("AWS ALB 5xx Errors", "AWS ALB", ["aws elbv2 describe-target-health", "aws logs tail", "curl -I endpoint"]),
    ("AWS Lambda Timeout", "AWS Lambda", ["aws lambda get-function", "aws logs tail", "aws cloudwatch get-metric-statistics"]),
    ("AWS S3 Access Denied", "AWS S3", ["aws s3 ls", "aws iam get-policy", "aws cloudtrail lookup-events"]),
    ("AWS ECS Task Stopped", "AWS ECS", ["aws ecs describe-tasks", "aws logs tail", "aws ecs describe-services"]),
    ("VMware VM Not Responding", "VMware", ["esxtop", "vim-cmd vmsvc/getallvms", "vmware.log check"]),
    ("VMware Datastore Full", "VMware", ["df -h", "esxcli storage filesystem list", "vCenter datastore check"]),
    ("VMware Snapshot Growth", "VMware", ["vim-cmd vmsvc/snapshot.get", "datastore browser check", "vmware.log check"]),
    ("Citrix User Session Failure", "Citrix", ["Get-BrokerSession", "Get-BrokerMachine", "Citrix Director check"]),
    ("Citrix VDA Registration Failed", "Citrix", ["Get-BrokerMachine", "VDA service status", "Event Viewer check"]),
    ("Citrix Profile Load Slow", "Citrix", ["Profile Management logs", "Get-BrokerSession", "Event Viewer check"]),
    ("Network Packet Loss", "Network", ["ping gateway", "tracert destination", "show interface counters"]),
    ("Firewall Rule Blocking Traffic", "Firewall", ["show access-list", "packet-tracer input", "firewall log check"]),
    ("VPN Authentication Failure", "VPN", ["radius logs", "vpn sessiondb", "auth log check"]),
    ("DNS Resolution Failure", "DNS", ["nslookup app.local", "dig app.local", "ipconfig /flushdns"]),
    ("DHCP Scope Exhausted", "DHCP", ["netsh dhcp show scope", "dhcp logs", "ipconfig /renew"]),
    ("Switch Port Down", "Network", ["show interface status", "show logs", "show spanning-tree"]),
    ("BGP Neighbor Down", "Network", ["show ip bgp summary", "show log", "ping peer"]),
    ("Load Balancer Pool Down", "Network", ["show pool status", "curl backend", "health probe logs"]),
    ("Security Malware Alert", "Security", ["Defender scan", "Get-MpThreat", "isolate endpoint"]),
    ("Unauthorized Login Attempts", "Security", ["Event Viewer Security logs", "Get-ADUser", "SIEM alert review"]),
    ("Certificate Expired", "Security", ["openssl s_client", "certmgr.msc", "Get-ChildItem Cert:"]),
    ("EDR Agent Offline", "Security", ["EDR console check", "service status", "endpoint event logs"]),
    ("Suspicious PowerShell Activity", "Security", ["Event ID 4104 review", "Get-Process powershell", "SIEM alert review"]),
    ("Application API Latency High", "Application", ["curl -w response_time", "kubectl logs api", "APM trace check"]),
    ("Payment API Outage", "Application", ["kubectl get pods", "kubectl logs payment-api", "kubectl rollout status deployment/payment-api"]),
    ("Database Connection Pool Exhausted", "Application", ["application logs", "database sessions", "connection pool metrics"]),
    ("Login Service Failure", "Application", ["curl login endpoint", "application logs", "auth service health check"]),
    ("Message Queue Backlog", "Middleware", ["rabbitmqctl list_queues", "consumer logs", "queue depth metrics"]),
    ("Kafka Consumer Lag High", "Kafka", ["kafka-consumer-groups --describe", "broker logs", "consumer logs"]),
    ("Redis Cache Memory High", "Redis", ["redis-cli info memory", "redis-cli client list", "redis-cli slowlog get"]),
    ("ElasticSearch Cluster Yellow", "Elasticsearch", ["_cluster/health", "_cat/indices", "_cat/shards"]),
    ("Grafana Dashboard No Data", "Monitoring", ["datasource health check", "query inspector", "prometheus targets"]),
    ("Prometheus Target Down", "Monitoring", ["prometheus targets", "curl exporter", "systemctl status node_exporter"]),
    ("Datadog Agent Not Reporting", "Monitoring", ["datadog-agent status", "agent logs", "service restart"]),
    ("SolarWinds Node Down", "Monitoring", ["node poll check", "ping device", "SNMP walk"]),
    ("Freshservice Ticket Automation Failed", "ITSM", ["workflow logs", "API integration check", "automation rule review"]),
    ("Azure DevOps Pipeline Failed", "DevOps", ["pipeline logs", "agent status", "build artifact check"]),
    ("GitHub Actions Workflow Failed", "DevOps", ["workflow logs", "runner status", "secret configuration check"]),
    ("Jenkins Build Agent Offline", "DevOps", ["agent status", "jenkins logs", "node reconnect"]),
    ("Backup Job Failed", "Backup", ["backup console logs", "repository status", "agent service status"]),
    ("Storage Latency High", "Storage", ["iostat -x", "storage controller logs", "SAN health check"]),
    ("File Share Access Denied", "Storage", ["icacls", "net share", "Event Viewer Security logs"]),
    ("Print Server Queue Stuck", "Windows", ["Get-PrintJob", "Restart-Service Spooler", "Event Viewer check"]),
    ("Intune Device Sync Failed", "Intune", ["Intune portal device check", "Company Portal sync", "MDM diagnostics"]),
    ("Microsoft Defender Update Failed", "Security", ["Get-MpComputerStatus", "Update-MpSignature", "Event Viewer Defender logs"]),
    ("AVD User Login Failure", "Azure Virtual Desktop", ["Get-AzWvdSessionHost", "eventvwr", "FSLogix logs"]),
    ("FSLogix Profile Mount Failure", "Azure Virtual Desktop", ["FSLogix logs", "disk attach check", "Event Viewer check"]),
    ("Teams Sign-In Issue", "Microsoft 365", ["M365 service health", "Teams cache clear", "Azure AD sign-in logs"]),
    ("SharePoint Access Failure", "Microsoft 365", ["M365 service health", "SharePoint permissions", "Azure AD logs"]),
    ("OneDrive Sync Failure", "Microsoft 365", ["OneDrive sync client logs", "reset OneDrive", "M365 service health"]),
    ("Email Delivery Delay", "Microsoft 365", ["message trace", "MX record check", "transport rule review"]),
    ("SSL Handshake Failure", "Application Security", ["openssl s_client", "curl -v", "certificate chain check"]),
    ("API Gateway 504 Timeout", "Application", ["gateway logs", "upstream health check", "curl backend"]),
    ("WebSocket Connection Failure", "Application", ["browser console logs", "nginx logs", "application logs"]),
    ("Service Bus Message Deadletter", "Azure Service Bus", ["az servicebus queue show", "deadletter queue check", "consumer logs"]),
    ("Container Registry Authentication Failure", "DevOps", ["docker login", "registry logs", "secret check"]),
    ("Helm Release Failed", "Kubernetes", ["helm list", "helm status release", "kubectl get events"]),
    ("Ingress TLS Misconfiguration", "Kubernetes", ["kubectl describe ingress", "kubectl get secret", "openssl s_client"]),
    ("Cron Job Failure", "Linux", ["crontab -l", "grep CRON /var/log/syslog", "journalctl"]),
    ("NTP Time Drift", "Infrastructure", ["timedatectl", "chronyc tracking", "w32tm /query /status"]),
    ("SMTP Relay Failure", "Email", ["telnet smtp 25", "mail logs", "relay connector check"]),
    ("License Server Unavailable", "Application", ["license service status", "port connectivity test", "vendor logs"]),
    ("REST API 401 Unauthorized", "Application", ["curl -v endpoint", "auth token validation", "application logs"]),
    ("REST API 500 Error", "Application", ["application logs", "APM trace", "database logs"]),
]


def build_runbook(title, platform, commands, severity, confidence, resolution_minutes):
    command_bullets = "\n".join([f"- {cmd}" for cmd in commands])
    commands_text = "\n".join(commands)

    return f"""# AI Incident Intelligence Report

## 1. Incident Summary
The incident "{title}" was detected in the {platform} environment and requires investigation by the operations team.

## 2. Severity Assessment
Severity: {severity}

The severity is based on the affected service, user impact, operational risk, and expected recovery complexity.

## 3. Business Impact
Users may experience degraded performance, failed transactions, login failures, service unavailability, delayed processing, or SLA breach depending on the affected component.

## 4. Probable Root Cause
Likely causes include service failure, configuration drift, failed deployment, infrastructure degradation, network issue, permission problem, expired certificate, database contention, resource exhaustion, or dependency outage.

## 5. Diagnostic Commands
{command_bullets}

## 6. Resolution Plan
1. Confirm the alert and identify the affected service.
2. Review recent changes, deployments, patches, and configuration updates.
3. Run the diagnostic commands listed above.
4. Check logs, monitoring dashboards, and dependency health.
5. Restart, rollback, scale, clean up, or remediate the affected component as required.
6. Escalate to the owning application, infrastructure, database, network, or security team if the issue is not resolved.

## 7. Rollback Plan
Rollback the most recent deployment, configuration change, access rule, patch, or infrastructure update if it is confirmed as the trigger. Validate rollback impact before applying it in production.

## 8. Validation Steps
1. Confirm the affected component is healthy.
2. Validate end-user functionality.
3. Confirm monitoring dashboards are green.
4. Confirm no new alerts are triggered.
5. Document closure notes and incident timeline.

## 9. Preventive Actions
1. Improve monitoring and alert thresholds.
2. Add automated health checks.
3. Review capacity and scaling policies.
4. Strengthen change validation.
5. Update SOP and known-error documentation.

## 10. Estimated Resolution Time
{resolution_minutes} minutes.

## 11. AI Confidence Score
{confidence}%

The confidence score is based on the platform, incident pattern, and diagnostic command coverage.

## Commands Used
```text
{commands_text}
```
"""


def seed_enterprise_data():
    create_tables()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM incidents")

    severities = ["Critical", "High", "Medium", "Low"]
    start_date = datetime.now() - timedelta(days=30)

    for i in range(TARGET_COUNT):
        title, platform, commands = INCIDENTS[i % len(INCIDENTS)]

        severity = random.choice(severities)
        confidence = random.randint(80, 98)
        resolution_minutes = random.choice([15, 20, 30, 45, 60, 90])

        final_title = f"{title} - Case {i + 1:03d}"

        runbook = build_runbook(
            final_title,
            platform,
            commands,
            severity,
            confidence,
            resolution_minutes
        )

        created_at = start_date + timedelta(
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
            VALUES (?, ?, ?, ?)
            """,
            (
                final_title,
                "\n".join(commands),
                runbook,
                created_at.strftime("%Y-%m-%d %H:%M:%S")
            )
        )

    conn.commit()

    cursor.execute("SELECT COUNT(*) AS total FROM incidents")
    total = cursor.fetchone()["total"]

    conn.close()

    print("=" * 60)
    print("Enterprise Dataset Created Successfully")
    print(f"Total Runbooks : {total}")
    print("=" * 60)


if __name__ == "__main__":
    seed_enterprise_data()
