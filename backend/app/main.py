from dotenv import load_dotenv
load_dotenv()

import os
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.routes.health import router as health_router
from app.routes.plan import router as plan_router

# Logger do Uvicorn (aparece nos logs do Railway)
logger = logging.getLogger("uvicorn.error")

app = FastAPI()

# -------------------------
# CORS
# -------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5179",
    "http://127.0.0.1:5179",
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

# -------------------------
# Startup (DB init controlado)
# -------------------------
@app.on_event("startup")
def on_startup():
    # Em produção (Railway), NÃO cria tabela automaticamente
    if os.getenv("ENV") != "production":
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("DB tables created (non-production).")
        except Exception:
            logger.exception("DB init failed")
    else:
        logger.info("Production mode: skipping DB table creation.")

# -------------------------
# Rota raiz para teste
# -------------------------
@app.get("/")
def root():
    return {"status": "ok"}

# -------------------------
# Routers
# -------------------------
app.include_router(health_router)
app.include_router(plan_router)