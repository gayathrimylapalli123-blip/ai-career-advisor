from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Allow frontend (your HTML page) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔴 PASTE YOUR MAKE WEBHOOK URL HERE
MAKE_WEBHOOK = "https://hook.eu1.make.com/iker9497gakwnfjfve05gjh1yttfrawq"


@app.post("/analyze")
async def analyze(data: dict):
    try:
        # Send data from website to Make
        response = requests.post(MAKE_WEBHOOK, json=data)

        # Return Make response back to website
        return response.json()

    except Exception as e:
        return {
            "recommended_role": "Error",
            "missing_skills": str(e)
        }