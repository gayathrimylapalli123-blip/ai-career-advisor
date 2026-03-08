from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
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

# 🔴 Your Make webhook
MAKE_WEBHOOK = "https://hook.eu1.make.com/iker9497gakwnfjfve05gjh1yttfrawq"


# Homepage
@app.get("/")
def home():
    return FileResponse("index.html")


# AI analysis endpoint
@app.post("/analyze")
async def analyze(data: dict):
    try:
        response = requests.post(MAKE_WEBHOOK, json=data)
        return response.json()

    except Exception as e:
        return {
            "recommended_role": "Error",
            "missing_skills": str(e)
        }
