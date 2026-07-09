import streamlit as st

from api_client import generate_runbook
from components import page_header
from styles import load_css

st.set_page_config(
    page_title="AI Runbook Generator",
    page_icon="🤖",
    layout="wide"
)

st.markdown(load_css(), unsafe_allow_html=True)

page_header()

st.subheader("📝 Generate AI Runbook")

incident = st.text_input(
    "Incident Title",
    placeholder="Example: Payment API outage after deployment"
)

commands = st.text_area(
    "Commands Executed",
    height=250,
    placeholder="""kubectl get pods
kubectl logs payment-api
kubectl rollout restart deployment/payment-api"""
)

if st.button("🚀 Generate Runbook", use_container_width=True):

    if not incident.strip():
        st.warning("Please enter an incident title.")
        st.stop()

    if not commands.strip():
        st.warning("Please enter the executed commands.")
        st.stop()

    with st.spinner("Generating AI Runbook..."):

        result = generate_runbook(
            incident,
            commands
        )

    if result.get("success"):

        st.success(result["message"])

        st.markdown("---")

        st.subheader("📄 AI Generated Runbook")

        st.markdown(result["runbook"])

    else:

        st.error(result.get("message", "Unknown error"))