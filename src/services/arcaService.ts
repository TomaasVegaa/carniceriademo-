import { CartItem, FiscalData, InvoiceType, DocType } from '../types';

export interface BusinessConfig {
  razonSocial: string;
  nombreFantasia: string;
  cuit: string;
  iibb: string;
  inicioActividades: string;
  condicionIva: string;
  domicilio: string;
  ptoVta: number;
}

export const DEFAULT_BUSINESS_CONFIG: BusinessConfig = {
  razonSocial: 'ROSAS RODRIGO ALEJANDRO',
  nombreFantasia: 'Carniceria Web Service',
  cuit: '20-40437549-1',
  iibb: '20-40437549-1',
  inicioActividades: '18/09/2026',
  condicionIva: 'Monotributo',
  domicilio: 'San Lorenzo 1997, San Miguel de Tucumán',
  ptoVta: 2
};



/**
 * Genera el comprobante fiscal estructurado conforme a las normativas de ARCA (ex-AFIP).
 * Listo para integrar con Web Service WSAA + WSFE de ARCA en backend.
 */
export async function generateArcaInvoice(
  items: CartItem[],
  total: number,
  invoiceType: InvoiceType = 'FACTURA_C',
  docTipo: DocType = '99',
  docNro: string = '0',
  customConfig?: Partial<BusinessConfig>
): Promise<FiscalData> {
  const config = { ...DEFAULT_BUSINESS_CONFIG, ...customConfig };
  
  // Código de comprobante oficial ARCA / AFIP
  // 6 = Factura B, 11 = Factura C
  const tipoCmpCode = invoiceType === 'FACTURA_C' ? 11 : 6;
  
  const cuitClean = config.cuit.replace(/\D/g, '');
  const docNroClean = docNro.replace(/\D/g, '') || '0';

  try {
    const response = await fetch('/api/facturar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        total: Number(total.toFixed(2)),
        docTipo: parseInt(docTipo, 10),
        docNro: parseInt(docNroClean, 10) || 0
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al conectar con ARCA');
    }

    const { cae, caeVto, voucherNumber, date } = await response.json();
    
    // Payload oficial de ARCA para Código QR (RG 4291 / 5048)
    const qrObject = {
      ver: 1,
      fecha: `${date.substring(0,4)}-${date.substring(4,6)}-${date.substring(6,8)}`,
      cuit: parseInt(cuitClean, 10),
      ptoVta: config.ptoVta,
      tipoCmp: tipoCmpCode,
      nroCmp: voucherNumber,
      importe: Number(total.toFixed(2)),
      moneda: 'PES',
      ctz: 1,
      tipoDocRec: parseInt(docTipo, 10),
      nroDocRec: parseInt(docNroClean, 10) || 0,
      tipoCodAut: 'E',
      codAut: parseInt(cae, 10)
    };

    const jsonStr = JSON.stringify(qrObject);
    const base64Payload = btoa(unescape(encodeURIComponent(jsonStr)));
    const qrDataUrl = `https://www.afip.gob.ar/fe/qr/?p=${base64Payload}`;

    // Format caeVto to yyyy-mm-dd for visual display
    const caeVtoFormatted = caeVto ? `${caeVto.substring(0,4)}-${caeVto.substring(4,6)}-${caeVto.substring(6,8)}` : '';

    return {
      invoiceType,
      ptoVta: config.ptoVta,
      cbteNro: voucherNumber,
      docTipo,
      docNro: docNroClean,
      cae,
      caeVto: caeVtoFormatted,
      qrDataUrl,
      razonSocialEmisor: config.razonSocial,
      cuitEmisor: config.cuit,
      inicioActividades: config.inicioActividades,
      iibb: config.iibb,
      condicionIva: config.condicionIva,
      domicilioComercial: config.domicilio
    };

  } catch (error) {
    console.error('Error generando factura real:', error);
    throw error;
  }
}

/**
 * Formatea el texto del comprobante para compartir directamente por WhatsApp
 */
export function formatWhatsAppTicket(
  items: CartItem[],
  total: number,
  fiscal?: FiscalData,
  paymentMethod: string = 'Efectivo'
): string {
  const dateStr = new Date().toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let text = `🥩 *${DEFAULT_BUSINESS_CONFIG.nombreFantasia.toUpperCase()}*\n`;
  text += `📍 ${DEFAULT_BUSINESS_CONFIG.domicilio}\n`;
  text += `CUIT: ${DEFAULT_BUSINESS_CONFIG.cuit}\n`;
  text += `--------------------------------\n`;
  
  if (fiscal) {
    const tipoLabel = fiscal.invoiceType === 'FACTURA_B' ? 'FACTURA B' : 'FACTURA C';
    text += `📄 *${tipoLabel}* N° ${String(fiscal.ptoVta).padStart(4, '0')}-${String(fiscal.cbteNro).padStart(8, '0')}\n`;
    text += `📅 Fecha: ${dateStr}\n`;
    text += `👤 Cliente: ${fiscal.docTipo === '99' ? 'Consumidor Final' : `${fiscal.docTipo === '80' ? 'CUIT' : 'DNI'} ${fiscal.docNro}`}\n`;
  } else {
    text += `🧾 *TICKET DE VENTA*\n`;
    text += `📅 Fecha: ${dateStr}\n`;
  }
  
  text += `--------------------------------\n`;
  text += `*DETALLE DE COMPRA:*\n`;
  
  items.forEach(item => {
    const subtotal = (item.quantity * item.product.price).toLocaleString('es-AR');
    text += `• ${item.product.name}\n  ${item.quantity} ${item.product.unit} x $${item.product.price.toLocaleString('es-AR')} = *$${subtotal}*\n`;
  });
  
  text += `--------------------------------\n`;
  text += `💰 *TOTAL: $${total.toLocaleString('es-AR')}*\n`;
  text += `💳 Forma de Pago: ${paymentMethod}\n`;
  
  if (fiscal) {
    text += `--------------------------------\n`;
    text += `🏛️ *ARCA (ex-AFIP) - COMPROBANTE AUTORIZADO*\n`;
    text += `CAE: ${fiscal.cae}\n`;
    text += `Vto. CAE: ${fiscal.caeVto}\n`;
    text += `Verificar: ${fiscal.qrDataUrl}\n`;
  }
  
  text += `\n¡Muchas gracias por su compra! 🥩✨`;
  return encodeURIComponent(text);
}
