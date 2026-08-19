# app/services/pricing_service.py
from app.schemas.pricing import PricingRequest, PricingResponse

def calculate_pricing(data: PricingRequest) -> PricingResponse:
    cost_price = data.purchase_price + data.transport + data.packaging
    
    # Prix conseillé basé sur la marge souhaitée
    raw_recommended = cost_price * (1 + (data.desired_margin_pct / 100))
    # Prix minimum (couvre les frais + 5% de marge de sécurité)
    raw_min = cost_price * 1.05
    # Prix promo (marge divisée par 2)
    raw_promo = cost_price * (1 + ((data.desired_margin_pct / 2) / 100))

    # Arrondi à la centaine la plus proche pour le marché local (ex: 18 532 -> 18 500)
    return PricingResponse(
        cost_price=round(cost_price),
        recommended_price=round(raw_recommended, -2),
        min_price=round(raw_min, -2),
        promo_price=round(raw_promo, -2)
    )