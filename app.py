from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import skill_model

app = FastAPI()

# Allow browser requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Homepage
@app.get("/")
def home():
    return FileResponse("index.html")

# AI analysis endpoint
@app.post("/analyze")
def analyze(data: dict):

    result = skill_model.predict_role(data)

    return result