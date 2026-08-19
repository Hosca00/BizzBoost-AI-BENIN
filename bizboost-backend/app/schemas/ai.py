from pydantic import BaseModel, Field

class MarketingAssistantRequest(BaseModel):
    product_description: str = Field(..., example="Je veux vendre des chaussures pour hommes importées de Cotonou.")
    target_audience: str | None = Field(None, example="Jeunes professionnels et étudiants à Parakou")

class MarketingAssistantResponse(BaseModel):
    strategy: str
    recommended_price_comment: str
    whatsapp_status: str
    facebook_post: str
    tiktok_ideas: list[str]
    slogan: str