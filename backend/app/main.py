from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.routes.health import router as health_router
from app.routes.plan import router as plan_router

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5179",
    "http://127.0.0.1:5179",

    # seu deploy atual (EXATO)
    "https://health-saude-dashboard-dieyksantos.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)

Base.metadata.create_all(bind=engine)

app.include_router(health_router)
app.include_router(plan_router)