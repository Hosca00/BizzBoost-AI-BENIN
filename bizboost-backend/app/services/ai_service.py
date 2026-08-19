# app/services/ai_service.py
import json
import os
from google import genai
from google.genai import types
from app.schemas.ai import MarketingAssistantRequest, MarketingAssistantResponse

SYSTEM_PROMPT = """
Tu es l'assistant marketing et commercial de BizBoost AI Bénin, expert du marché béninois.
Ton objectif est de fournir des conseils pragmatiques et directement applicables sur le terrain :
- Canaux prioritaires : WhatsApp (Statuts/Groupes) et Facebook.
- Moyen de paiement principal : Mobile Money (MTN MoMo, Moov Money).
- Langage : Français accessible, dynamique, professionnel, adapté au contexte des entrepreneurs du Bénin.

Tu dois impérativement répondre au format JSON strict respectant exactement cette structure :
{
  "strategy": "Brève stratégie commerciale",
  "recommended_price_comment": "Avis rapide sur le positionnement prix",
  "whatsapp_status": "Texte prêt à copier/coller pour statut WhatsApp avec emojis et call-to-action MoMo",
  "facebook_post": "Texte engageant pour publication Facebook avec emojis et hashtags adaptés",
  "tiktok_ideas": ["Idée vidéo 1", "Idée vidéo 2"],
  "slogan": "Un slogan percutant"
}
"""

async def generate_marketing_strategy(data: MarketingAssistantRequest) -> MarketingAssistantResponse:
    # Le SDK instancie automatiquement le client grâce à GEMINI_API_KEY dans l'environnement
    client = genai.Client()
    
    user_content = f"Produit/Service : {data.product_description}"
    if data.target_audience:
        user_content += f"\nCible visée : {data.target_audience}"

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_content,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            temperature=0.7,
        )
    )

    result_json = json.loads(response.text)
    return MarketingAssistantResponse(**result_json)