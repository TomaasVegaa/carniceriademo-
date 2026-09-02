# Contexto y Directivas para el Agente (Google Antigravity)

Este archivo contiene el contexto del proyecto, directivas de diseño y especificaciones técnicas para el **Sistema de Punto de Venta (POS) para Carnicería**.

---

## 🎯 Objetivo y Enfoque del Proyecto
Sistema POS optimizado **100% Mobile-First** para funcionar exclusivamente desde celulares (smartphones y tablets) en carnicerías, fiambrerías y comercios de barrio.

### Prioridades Clave Definidas con el Cliente:
- **Mobile-First Real:** Navegación por barra inferior (Venta, Carrito, Caja, Precios) y botones táctiles ergonómicos.
- **Seguridad en la Nube:** Pantalla de Login con PIN de 4 dígitos para proteger la aplicación web.
- **Facturación Electrónica ARCA (ex-AFIP) - Foco Principal:**
  - Factura B / C con CAE, fecha de vencimiento y Código QR oficial (RG 4291/5048).
  - Envío directo de tickets fiscales por WhatsApp y vista de impresión térmica.
  - Servicio `arcaService.ts` preparado para conectar con Web Services de ARCA (WSAA/WSFE).
- **Simplicidad de Mostrador:** Sin sobrecarga innecesaria de módulos descartados (sin cuenta corriente ni control de stock de media res).
- **Estética Rústica / Natural:** Tonos madera (`#8B4513`), verde (`#4F7942`), vino (`#A52A2A`) y fondo cálido (`#FDFBF7` / `#EFEBE9`).

---

## 🏗️ Estado Actual del Código

1. **`src/types.ts`**:
   - `Product`: `{ id, name, price, category, unit: 'kg' | 'unidad', color }`
   - `CartItem`: `{ id, product, quantity }`
   - `FiscalData`: `{ invoiceType, ptoVta, cbteNro, docTipo, docNro, cae, caeVto, qrDataUrl, ... }`
   - `Sale`: `{ id, items, total, paymentMethod, invoice, fiscalData, timestamp, shift, cashierName }`
   - `ShiftState`: `{ isOpen, shift: 'Mañana' | 'Tarde' | null, initialBalance, openedAt }`
   - `AuthUser`: `{ id, name, role: 'cajero' | 'administrador', pin }`

2. **`src/services/arcaService.ts`**:
   - `generateArcaInvoice()`: Genera el comprobante fiscal, calcula totales, genera CAE y construye el payload oficial de QR de ARCA (base64 RG 4291).
   - `formatWhatsAppTicket()`: Genera el texto formateado del ticket para enviar por WhatsApp.

3. **`src/components/LoginScreen.tsx`**:
   - Acceso seguro mediante teclado numérico táctil de PIN con perfiles de Cajero (`1234`) y Administrador (`9999`).

4. **`src/components/InvoiceModal.tsx`**:
   - Modal de comprobante fiscal ARCA en formato ticket térmico con QR oficial de ARCA (`qrcode.react`), CAE, vencimiento, botón de WhatsApp y botón de imprimir.

5. **`src/components/ProductGrid.tsx`**:
   - Buscador rápido táctil, barra de categorías deslizable y grilla móvil de 2 columnas de cortes.

6. **`src/components/KeypadModal.tsx`**:
   - Bottom sheet para smartphone con teclado numérico gigante y botones rápidos de presets (+0.5 kg, +1 kg, etc.).

7. **`src/components/Cart.tsx`**:
   - Detalle del pedido, selector de métodos de pago (`Efectivo`, `Tarjeta`, `Transferencia`), switch de Facturación ARCA (Factura B/C, Consumidor Final, DNI o CUIT) y cobro.

8. **`src/components/FooterModals.tsx`**:
   - `CashRegisterView`: Apertura de turno con fondo inicial, cálculo de arqueo (efectivo, tarjeta, transferencia), historial de ventas con botón para ver/reimprimir factura ARCA y cierre de turno.
   - `PricesView`: Edición rápida de precios por kilo/unidad y creación de cortes/categorías directamente desde el celular.

9. **`src/App.tsx`**:
   - Gestión de autenticación, barra superior con estado de caja en vivo, barra de navegación inferior móvil (`bottom-nav`), barra flotante de cobro rápido y persistencia en `localStorage`.

---

## ⚙️ Reglas de Código
- Usar **TypeScript** con tipado estricto.
- Usar **Tailwind CSS** para todo el styling; mantener la paleta rústica consistente.
- Iconografía exclusivamente mediante **`lucide-react`**.
- No utilizar `window.alert` o `window.confirm`; usar estados y componentes interactivos integrados en la UI.
