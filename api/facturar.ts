import { VercelRequest, VercelResponse } from '@vercel/node';
import Afip from '@afipsdk/afip.js';
import path from 'path';
import fs from 'fs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { total, docTipo = 99, docNro = 0 } = req.body;

    // Configuración de rutas a los certificados (usando process.cwd() que apunta a la raíz del proyecto en Vercel)
    const certPath = path.join(process.cwd(), 'api', 'certs', 'CARNICERIA_7e08029a895e08ec.crt');
    const keyPath = path.join(process.cwd(), 'api', 'certs', 'carniceria.key');

    // Inicializar SDK de AFIP
    const afip = new Afip({
      CUIT: 20404375491,
      production: true, // Modo Producción
      cert: fs.readFileSync(certPath, 'utf8'),
      key: fs.readFileSync(keyPath, 'utf8')
    });

    const puntoDeVenta = 2;
    const tipoDeComprobante = 11; // 11 = Factura C

    // Obtener el número de la última factura creada
    const lastVoucher = await afip.ElectronicBilling.getLastVoucher(puntoDeVenta, tipoDeComprobante);
    const numeroDeFactura = lastVoucher + 1;

    // Fecha en formato yyyymmdd
    const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0]
      .replace(/-/g, '');

    const data = {
      'CantReg'    : 1, // Cantidad de comprobantes a registrar
      'PtoVta'     : puntoDeVenta,
      'CbteTipo'   : tipoDeComprobante, 
      'Concepto'   : 1, // 1: Productos
      'DocTipo'    : docTipo,
      'DocNro'     : docNro,
      'CbteDesde'  : numeroDeFactura,
      'CbteHasta'  : numeroDeFactura,
      'CbteFch'    : parseInt(date),
      'ImpTotal'   : total,
      'ImpTotConc' : 0, // Importe neto no gravado
      'ImpNeto'    : total, // En Factura C, el neto es igual al total
      'ImpOpEx'    : 0, // Operaciones exentas
      'ImpIVA'     : 0, // IVA
      'ImpTrib'    : 0, // Tributos
      'MonId'      : 'PES', // Moneda
      'MonCotiz'   : 1, // Cotización
    };

    // Crear el comprobante
    const resAfip = await afip.ElectronicBilling.createVoucher(data);

    // Devolver los datos del CAE a la aplicación
    return res.status(200).json({
      cae: resAfip.CAE,
      caeVto: resAfip.CAEFchVto,
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
    console.error('Error generando factura en AFIP:', error);
    return res.status(500).json({ 
      error: 'Error de AFIP: ' + (error.message || 'Error interno del servidor') 
    });
  }
}
