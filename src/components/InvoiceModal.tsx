import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Share2, Printer, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import { Sale } from '../types';
import { formatWhatsAppTicket } from '../services/arcaService';

interface InvoiceModalProps {
  sale: Sale;
  onClose: () => void;
}

export function InvoiceModal({ sale, onClose }: InvoiceModalProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const fiscal = sale.fiscalData;

  const handleShareWhatsApp = () => {
    const textEncoded = formatWhatsAppTicket(
      sale.items,
      sale.total,
      fiscal,
      sale.paymentMethod
    );
    window.open(`https://api.whatsapp.com/send?text=${textEncoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const tipoComprobanteLabel = fiscal?.invoiceType === 'FACTURA_C' 
    ? 'FACTURA "C"' 
    : fiscal?.invoiceType === 'FACTURA_B' 
    ? 'FACTURA "B"' 
    : 'TICKET DE VENTA';

  const tipoLetra = fiscal?.invoiceType === 'FACTURA_C' ? 'C' : 'B';

  return (
    <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-[#FDFBF7] w-full max-w-md rounded-3xl shadow-2xl border-2 border-[#D7CCC8] overflow-hidden flex flex-col max-h-[92dvh] print:max-h-none print:border-none print:shadow-none print:w-full">
        
        {/* Header no imprimible en modal */}
        <div className="bg-[#8B4513] text-white p-4 flex justify-between items-center shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-emerald-300" />
            <div>
              <h2 className="text-lg font-bold leading-none">Comprobante Fiscal ARCA</h2>
              <span className="text-xs text-amber-200">Factura Electrónica Autorizada</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Ticket Térmico Imprimible */}
        <div 
          ref={ticketRef} 
          className="flex-1 overflow-y-auto p-5 bg-white text-[#222] font-mono text-xs leading-relaxed print:p-0 print:text-black"
        >
          {/* Encabezado Fiscal */}
          <div className="text-center pb-3 border-b border-dashed border-gray-400">
            {/* Letra de Factura */}
            <div className="inline-flex items-center justify-center w-9 h-9 border-2 border-black font-black text-lg mb-1 rounded-sm">
              {tipoLetra}
            </div>
            <p className="font-black text-sm uppercase tracking-wide">
              {fiscal?.razonSocialEmisor || 'CARNICERÍA Y FIAMBRERÍA'}
            </p>
            <p className="text-[11px] text-gray-700">{fiscal?.domicilioComercial || 'Av. San Martín 1420'}</p>
            <p className="text-[11px] text-gray-700">IVA: {fiscal?.condicionIva || 'Responsable Inscripto'}</p>
            <p className="text-[11px] text-gray-700">CUIT: {fiscal?.cuitEmisor || '30-71829304-8'}</p>
            <p className="text-[11px] text-gray-700">Ingresos Brutos: {fiscal?.iibb || '30-71829304-8'}</p>
            <p className="text-[11px] text-gray-700">Inicio de Actividades: {fiscal?.inicioActividades || '15/03/2021'}</p>
          </div>

          {/* Datos del Comprobante */}
          <div className="py-2.5 border-b border-dashed border-gray-400">
            <div className="flex justify-between font-bold">
              <span>{tipoComprobanteLabel}</span>
              <span>
                N° {String(fiscal?.ptoVta || 1).padStart(4, '0')}-{String(fiscal?.cbteNro || 1).padStart(8, '0')}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Fecha: {sale.timestamp.toLocaleDateString('es-AR')}</span>
              <span>Hora: {sale.timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="mt-1 pt-1 border-t border-gray-200">
              <p className="font-bold">
                Receptor: {fiscal?.docTipo === '99' ? 'A CONSUMIDOR FINAL' : `${fiscal?.docTipo === '80' ? 'CUIT' : 'DNI'}: ${fiscal?.docNro}`}
              </p>
              <p className="text-gray-700">Condición de Venta: {sale.paymentMethod.toUpperCase()}</p>
            </div>
          </div>

          {/* Detalle de Productos */}
          <div className="py-2.5 border-b border-dashed border-gray-400">
            <div className="grid grid-cols-12 font-bold mb-1.5 pb-1 border-b border-gray-300">
              <span className="col-span-6">DESCRIPCIÓN</span>
              <span className="col-span-3 text-right">CANT</span>
              <span className="col-span-3 text-right">TOTAL</span>
            </div>
            <div className="space-y-1.5">
              {sale.items.map((item) => {
                const itemTotal = item.quantity * item.product.price;
                return (
                  <div key={item.id} className="grid grid-cols-12 items-start">
                    <div className="col-span-6">
                      <p className="font-bold">{item.product.name}</p>
                      <p className="text-[10px] text-gray-500">
                        ${item.product.price.toLocaleString('es-AR')} /{item.product.unit}
                      </p>
                    </div>
                    <span className="col-span-3 text-right font-medium">
                      {item.quantity} {item.product.unit}
                    </span>
                    <span className="col-span-3 text-right font-bold">
                      ${itemTotal.toLocaleString('es-AR')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Totales */}
          <div className="py-2.5 border-b border-dashed border-gray-400">
            <div className="flex justify-between text-sm font-black">
              <span>TOTAL ARS:</span>
              <span>${sale.total.toLocaleString('es-AR')}</span>
            </div>
            <p className="text-[10px] text-gray-500 text-right mt-0.5">
              Forma de pago: {sale.paymentMethod}
            </p>
          </div>

          {/* Bloque Fiscal ARCA (ex AFIP) */}
          <div className="pt-3 flex flex-col items-center text-center">
            {fiscal?.qrDataUrl && (
              <div className="bg-white p-2 rounded-lg border border-gray-300 mb-2">
                <QRCodeSVG 
                  value={fiscal.qrDataUrl} 
                  size={120} 
                  level="M" 
                  includeMargin={false} 
                />
              </div>
            )}
            
            <p className="font-bold text-[11px] uppercase tracking-wider text-gray-900">
              Comprobante Autorizado por ARCA
            </p>
            <p className="font-bold text-xs mt-1">
              CAE N°: <span className="tracking-wider">{fiscal?.cae || '74389102938491'}</span>
            </p>
            <p className="text-[10px] text-gray-600">
              Fecha de Vto. CAE: {fiscal?.caeVto || '10/09/2026'}
            </p>
            <p className="text-[9px] text-gray-400 mt-2">
              Régimen de Facturación Electrónica RG 4291 / 5048
            </p>
          </div>
        </div>

        {/* Acciones Móviles (WhatsApp, Imprimir, Siguiente Venta) */}
        <div className="p-4 bg-[#EFEBE9] border-t border-[#D7CCC8] flex flex-col gap-2 shrink-0 print:hidden">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="py-3 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Share2 size={18} />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-3 px-3 bg-white hover:bg-gray-100 text-[#3C2A21] border-2 border-[#D7CCC8] rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Printer size={18} />
              <span>Imprimir</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-[#4F7942] hover:brightness-110 text-white rounded-xl font-bold text-base shadow-sm border-b-4 border-[#2D4226] transition-all active:scale-98"
          >
            Siguiente Venta
          </button>
        </div>

      </div>
    </div>
  );
}
