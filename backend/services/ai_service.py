import requests
import time

OLLAMA_URL = "http://127.0.0.1:11434/api/chat"
MODEL_NAME = "qwen2.5:3b"
TIMEOUT = 180


def call_ollama(prompt, max_tokens=900):
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "stream": False,
        "options": {
            "temperature": 0.2,
            "num_predict": max_tokens
        }
    }

    try:
        start = time.time()

        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=TIMEOUT
        )

        elapsed = round(time.time() - start, 2)

        print(f"Ollama completed in {elapsed} seconds")
        print(f"HTTP Status : {response.status_code}")

        if response.status_code != 200:
            print(response.text)
            response.raise_for_status()

        data = response.json()

        return data["message"]["content"]

    except requests.exceptions.Timeout:
        raise Exception("Request timed out while waiting for Ollama.")

    except requests.exceptions.ConnectionError:
        raise Exception("Unable to connect to Ollama. Verify Ollama is running.")

    except Exception as ex:
        raise Exception(f"AI Generation Failed: {str(ex)}")


def generate_runbook(incident, commands):
    print("=" * 60)
    print("AI INCIDENT INTELLIGENCE STARTED")

    prompt = f"""
You are a Senior Enterprise IT Service Delivery Manager and Incident Commander.

Create an AI Incident Intelligence Report for the below incident.

Incident Title:
{incident}

Commands / Observations:
{commands}

Return the response in this exact format:

# AI Incident Intelligence Report

## 1. Incident Summary
Briefly explain what happened.

## 2. Severity Assessment
Classify severity as Critical, High, Medium, or Low. Explain why.

## 3. Business Impact
Explain possible impact on users, applications, services, revenue, SLA, or operations.

## 4. Probable Root Cause
Explain the most likely technical root cause based on the incident and commands.

## 5. Diagnostic Commands
List the best commands to investigate the issue.

## 6. Resolution Plan
Give step-by-step actions to resolve the incident.

## 7. Rollback Plan
Explain how to safely rollback if the fix fails.

## 8. Validation Steps
Explain how to confirm the issue is fixed.

## 9. Preventive Actions
Suggest long-term improvements to prevent recurrence.

## 10. Estimated Resolution Time
Give an estimated time range.

## 11. AI Confidence Score
Give a confidence score from 0 to 100 and explain briefly.

Rules:
- Keep it professional.
- Use enterprise IT operations language.
- Be practical and action-oriented.
- Do not add unrelated content.
- Do not say you are an AI model.
"""

    return call_ollama(prompt, max_tokens=900)


def generate_root_cause_analysis(incident, commands, runbook):
    print("=" * 60)
    print("AI ROOT CAUSE ANALYSIS STARTED")

    prompt = f"""
You are a Principal Site Reliability Engineer.

Analyse the following incident and produce an executive RCA.

Incident:
{incident}

Commands Executed:
{commands}

Generated Runbook:
{runbook}

Return ONLY this format:

# Executive Root Cause Analysis

## Severity

## Business Impact

## Most Probable Root Cause

## Evidence Supporting Root Cause

## Affected Components

## Estimated MTTR

## Confidence Score

## Immediate Fix

## Long Term Preventive Actions

## Executive Summary

Keep it concise, professional, and enterprise-ready.
"""

    return call_ollama(prompt, max_tokens=700)