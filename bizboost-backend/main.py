import json
import os
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.schemas.ai import MarketingAssistantRequest, MarketingAssistantResponse
from app.schemas.invoice import InvoiceRequest
from app.schemas.pricing import PricingRequest, PricingResponse
from app.services.ai_service import generate_marketing_strategy
from app.services.invoice_service import generate_invoice_pdf
from app.services.pricing_service import calculate_pricing

load_dotenv()

app = FastAPI(
    title="BizBoost AI Bénin API",
    description="API Backend pour le MVP BizBoost AI Bénin (Propulsé par Google GenAI)",
    version="0.1.0",
)

# Configuration CORS sécurisée et compatible avec React (Vite)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Stockage local des articles
CATALOG_FILE = "catalog.json"


def load_catalog() -> List[str]:
    if not os.path.exists(CATALOG_FILE):
        return ["Création site web", "Conception Logo", "Gestion réseaux sociaux"]
    try:
        with open(CATALOG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_catalog(items: List[str]):
    with open(CATALOG_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)


@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API BizBoost AI Bénin (Google GenAI) 🇧🇯"}


# --- MODULE CATALOGUE ARTICLES ---
class ArticleListPayload(BaseModel):
    articles: List[str]


@app.get("/api/articles", tags=["Catalogue"])
def get_articles():
    return load_catalog()


@app.post("/api/articles", tags=["Catalogue"])
def add_articles(payload: ArticleListPayload):
    current_catalog = set(load_catalog())
    new_items = [item.strip() for item in payload.articles if item.strip()]

    updated_catalog = list(current_catalog.union(new_items))
    save_catalog(updated_catalog)

    return {"status": "success", "catalog": updated_catalog}


# --- MODULE CALCULATEUR DE PRIX ---
@app.post(
    "/api/v1/pricing/calculate",
    response_model=PricingResponse,
    tags=["Calculateur"],
)
def api_calculate_pricing(payload: PricingRequest):
    return calculate_pricing(payload)


# --- MODULE ASSISTANT IA & MARKETING ---
@app.post(
    "/api/v1/ai/marketing",
    response_model=MarketingAssistantResponse,
    tags=["Assistant IA"],
)
async def api_marketing_assistant(payload: MarketingAssistantRequest):
    try:
        return await generate_marketing_strategy(payload)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erreur avec Gemini API : {str(e)}"
        )


# --- MODULE FACTURATION / DEVIS ---
@app.post("/api/v1/invoices/generate-pdf", tags=["Facturation"])
def api_generate_invoice_pdf(payload: InvoiceRequest):
    try:
        pdf_file = generate_invoice_pdf(payload)
        filename = f"{payload.document_type.lower()}_{payload.invoice_number}.pdf"

        return StreamingResponse(
            pdf_file,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Lancement du serveur local
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)