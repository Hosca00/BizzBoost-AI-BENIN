# app/schemas/invoice.py
from pydantic import BaseModel, Field
from typing import List, Optional

class InvoiceItem(BaseModel):
    description: str = Field(..., example="Chaussure Cuir Homme - Pointure 42")
    quantity: int = Field(..., example=2)
    unit_price: float = Field(..., example=18500)

class InvoiceRequest(BaseModel):
    document_type: str = Field("FACTURE", example="FACTURE") # 'DEVIS' ou 'FACTURE'
    invoice_number: str = Field(..., example="FAC-2026-001")
    
    # Infos Vendeur
    company_name: str = Field(..., example="BizBoost Boutique")
    company_phone: str = Field(..., example="+229 97 00 00 00")
    company_address: Optional[str] = Field("Cotonou, Bénin", example="Cotonou, Akpakpa")
    
    # Infos Client
    client_name: str = Field(..., example="M. Jean KPADONOU")
    client_phone: Optional[str] = Field("+229 95 00 00 00", example="+229 95 00 00 00")
    
    # Articles & Financement
    items: List[InvoiceItem]
    discount: float = Field(0, description="Remise globale en FCFA", example=1000)
    payment_method: str = Field("MTN Mobile Money", example="MTN Mobile Money / Cash")