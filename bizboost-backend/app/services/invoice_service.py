# app/services/invoice_service.py
import io
from jinja2 import Template
from xhtml2pdf import pisa
from app.schemas.invoice import InvoiceRequest

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: bold; color: #1E3A8A; text-transform: uppercase; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { vertical-align: top; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th { background-color: #1E3A8A; color: white; padding: 8px; text-align: left; }
        .items-table td { border-bottom: 1px solid #ddd; padding: 8px; }
        .totals-table { width: 40%; float: right; margin-bottom: 20px; }
        .totals-table td { padding: 4px; text-align: right; }
        .bold { font-weight: bold; }
        .footer { text-align: center; font-size: 10px; color: #777; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">{{ data.document_type }}</div>
        <div>N° : {{ data.invoice_number }}</div>
    </div>

    <table class="info-table">
        <tr>
            <td width="50%">
                <span class="bold">Émetteur :</span><br>
                {{ data.company_name }}<br>
                Tél : {{ data.company_phone }}<br>
                {{ data.company_address or '' }}
            </td>
            <td width="50%">
                <span class="bold">Client :</span><br>
                {{ data.client_name }}<br>
                {% if data.client_phone %}Tél : {{ data.client_phone }}<br>{% endif %}
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th>Désignation</th>
                <th style="text-align: center;">Qté</th>
                <th style="text-align: right;">Prix Unitaire (FCFA)</th>
                <th style="text-align: right;">Total (FCFA)</th>
            </tr>
        </thead>
        <tbody>
            {% for item in items_calculated %}
            <tr>
                <td>{{ item.description }}</td>
                <td style="text-align: center;">{{ item.quantity }}</td>
                <td style="text-align: right;">{{ "{:,.0f}".format(item.unit_price) }}</td>
                <td style="text-align: right;">{{ "{:,.0f}".format(item.total) }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>

    <table class="totals-table">
        <tr>
            <td>Sous-total :</td>
            <td class="bold">{{ "{:,.0f}".format(subtotal) }} FCFA</td>
        </tr>
        {% if data.discount > 0 %}
        <tr>
            <td>Remise :</td>
            <td>- {{ "{:,.0f}".format(data.discount) }} FCFA</td>
        </tr>
        {% endif %}
        <tr>
            <td class="bold" style="font-size: 14px;">Total à payer :</td>
            <td class="bold" style="font-size: 14px; color: #1E3A8A;">{{ "{:,.0f}".format(final_total) }} FCFA</td>
        </tr>
    </table>

    <div style="clear: both;"></div>

    <p><span class="bold">Mode de paiement :</span> {{ data.payment_method }}</p>

    <div class="footer">
        Merci pour votre confiance ! — Généré par BizBoost AI Bénin 🇧🇯
    </div>
</body>
</html>
"""

def generate_invoice_pdf(data: InvoiceRequest) -> io.BytesIO:
    # Calcul des totaux
    items_calculated = []
    subtotal = 0.0
    
    for item in data.items:
        item_total = item.quantity * item.unit_price
        subtotal += item_total
        items_calculated.append({
            "description": item.description,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "total": item_total
        })

    final_total = max(0.0, subtotal - data.discount)

    # Rendu Jinja2
    template = Template(HTML_TEMPLATE)
    rendered_html = template.render(
        data=data,
        items_calculated=items_calculated,
        subtotal=subtotal,
        final_total=final_total
    )

    # Conversion HTML -> PDF
    pdf_buffer = io.BytesIO()
    pisa_status = pisa.CreatePDF(rendered_html, dest=pdf_buffer)

    if pisa_status.err:
        raise Exception("Erreur lors de la génération du document PDF")

    pdf_buffer.seek(0)
    return pdf_buffer