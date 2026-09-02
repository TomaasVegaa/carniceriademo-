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
  razonSocial: 'CARNICERÍA Y FIAMBRERÍA LA TRADICIÓN',
  nombreFantasia: 'La Tradición Carnes Seleccionadas',
  cuit: '30-71829304-8',
  iibb: '30-71829304-8',
  inicioActividades: '15/03/2021',
  condicionIva: 'Responsable Inscripto',
  domicilio: 'Av. San Martín 1420 - Local 2',
  ptoVta: 1
};

// Obtiene el último número de comprobante emitido desde localStorage
export function getNextInvoiceNumber(invoiceType: InvoiceType): number {
  const key = `pos_last_cbte_${invoiceType}`;
  const saved = localStorage.getItem(key);
  const current = saved ? parseInt(saved, 10) : 1045; // Comienza en un número realista
  const next = current + 1;
  localStorage.setItem(key, next.toString());
  return next;
}

/**
 * Genera el comprobante fiscal estructurado conforme a las normativas de ARCA (ex-AFIP).
 * Listo para integrar con Web Service WSAA + WSFE de ARCA en backend.
 */
export function generateArcaInvoice(
  items: CartItem[],
  total: number,
  invoiceType: InvoiceType = 'FACTURA_B',
  docTipo: DocType = '99',
  docNro: string = '0',
  customConfig?: Partial<BusinessConfig>
): FiscalData {
  const config = { ...DEFAULT_BUSINESS_CONFIG, ...customConfig };
  const cbteNro = getNextInvoiceNumber(invoiceType);
  
  // Código de comprobante oficial ARCA / AFIP
  // 6 = Factura B, 11 = Factura C
  const tipoCmpCode = invoiceType === 'FACTURA_C' ? 11 : 6;
  
  // Generar CAE simulado de 14 dígitos (en producción se recibe del WSFE de ARCA)
  const randomCaeSuffix = Math.floor(10000000 + Math.random() * 90000000).toString();
  const cae = `7438${randomCaeSuffix}`;
  
  // Vencimiento CAE: 10 días posteriores a la emisión
  const vtoDate = new Date();
  vtoDate.setDate(vtoDate.getDate() + 10);
  const caeVto = vtoDate.toISOString().split('T')[0];
  
  const cuitClean = config.cuit.replace(/\D/g, '');
  const docNroClean = docNro.replace(/\D/g, '') || '0';

  // Payload oficial de ARCA para Código QR (RG 4291 / 5048)
  const qrObject = {
    ver: 1,
    fecha: new Date().toISOString().split('T')[0],
    cuit: parseInt(cuitClean, 10) || 30718293048,
    ptoVta: config.ptoVta,
    tipoCmp: tipoCmpCode,
    nroCmp: cbteNro,
    importe: Number(total.toFixed(2)),
    moneda: 'PES',
    ctz: 1,
    tipoDocRec: parseInt(docTipo, 10),
    nroDocRec: parseInt(docNroClean, 10),
    tipoCodAut: 'E',
    codAut: parseInt(cae, 10)
  };

  const jsonStr = JSON.stringify(qrObject);
  const base64Payload = btoa(unescape(encodeURIComponent(jsonStr)));
  const qrDataUrl = `https://www.afip.gob.ar/fe/qr/?p=${base64Payload}`;

  return {
    invoiceType,
    ptoVta: config.ptoVta,
    cbteNro,
    docTipo,
    docNro: docNroClean,
    cae,
    caeVto,
    qrDataUrl,
    razonSocialEmisor: config.razonSocial,
    cuitEmisor: config.cuit,
    inicioActividades: config.inicioActividades,
    iibb: config.iibb,
    condicionIva: config.condicionIva,
    domicilioComercial: config.domicilio
  };
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
