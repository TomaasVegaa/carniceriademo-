import { VercelRequest, VercelResponse } from '@vercel/node';
import { Arca, MemoryTicketStorage } from '@arcasdk/core';
import path from 'path';
import fs from 'fs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { total, docTipo = 99, docNro = 0 } = req.body;

    const certPath = path.join(process.cwd(), 'api', 'certs', 'CARNICERIA_7e08029a895e08ec.crt');
    const keyPath = path.join(process.cwd(), 'api', 'certs', 'carniceria.key');

    // Inicializar SDK de ARCA con almacenamiento en memoria para evitar errores de Read-Only en Vercel
    const arca = new Arca({
      cuit: 20404375491,
      production: true, 
      cert: fs.readFileSync(certPath, 'utf8'),
      key: fs.readFileSync(keyPath, 'utf8'),
      ticketStorage: new MemoryTicketStorage({ cuit: 20404375491, production: true })
    });

    const puntoDeVenta = 2;
    const tipoDeComprobante = 11; // 11 = Factura C

    // Obtener el número de la última factura creada
    const lastVoucher = await arca.electronicBillingService.getLastVoucher(puntoDeVenta, tipoDeComprobante);
    const numeroDeFactura = lastVoucher.cbteNro + 1;

    // Fecha en formato yyyymmdd
    const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0]
      .replace(/-/g, '');

    const condicionIva = (docTipo === 99 || docTipo === 96) ? 5 : 1; // 5 = Cons. Final, 1 = Resp. Inscripto

    const data = {
      CantReg    : 1,
      PtoVta     : puntoDeVenta,
      CbteTipo   : tipoDeComprobante, 
      Concepto   : 1, // 1: Productos
      DocTipo    : docTipo,
      DocNro     : docNro,
      CbteDesde  : numeroDeFactura,
      CbteHasta  : numeroDeFactura,
      CbteFch    : date,
      ImpTotal   : total,
      ImpTotConc : 0, 
      ImpNeto    : total, 
      ImpOpEx    : 0, 
      ImpIVA     : 0, 
      ImpTrib    : 0, 
      MonId      : 'PES', 
      MonCotiz   : 1, 
      CondicionIVAReceptorId: condicionIva
    };

    // Crear el comprobante
    const resAfip = await arca.electronicBillingService.createVoucher(data);

    // Devolver los datos del CAE a la aplicación
    return res.status(200).json({
      cae: resAfip.cae,
      caeVto: resAfip.caeFchVto,
      voucherNumber: numeroDeFactura,
      cuit: 20404375491,
      ptoVta: puntoDeVenta,
      cbteTipo: tipoDeComprobante,
      docTipo,
      docNro,
      total,
      date
    });

  } catch (error: any) {
    console.error('Error generando factura en ARCA:', error);
    return res.status(500).json({ 
      error: 'Error de ARCA: ' + (error.message || 'Error interno del servidor') 
    });
  }
}
