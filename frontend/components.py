import streamlit as st


def page_header():

    st.markdown(
        """
        <div class='main-title'>
            🤖 AI Runbook Generator
        </div>

        <div class='sub-title'>
            Enterprise IT Service Delivery Assistant
        </div>

        <hr>
        """,
        unsafe_allow_html=True
    )