# app/schemas/pricing.py
from pydantic import BaseModel, Field

class PricingRequest(BaseModel):
    purchase_price: float = Field(..., description="Prix d'achat du produit/service en FCFA", example=15000)
    transport: float = Field(0, description="Frais de transport en FCFA", example=2000)
    packaging: float = Field(0, description="Frais d'emballage en FCFA", example=500)
    desired_margin_pct: float = Field(..., description="Marge souhaitée en %", example=30)

class PricingResponse(BaseModel):
    cost_price: float
    recommended_price: float
    min_price: float
    promo_price: float


