# 🥩 Sistema de Punto de Venta (POS) para Carnicería - Mobile First

Sistema moderno, táctil y de alta velocidad diseñado específicamente para carnicerías, fiambrerías y comercios de barrio, optimizado **100% para su uso en celulares y tablets**. Desarrollado con **React, Vite, TypeScript y Tailwind CSS**.

---

## 📌 Resumen del Proyecto

El sistema es una **Terminal de Venta (POS) Mobile-First** pensada para operar desde smartphones en el mostrador de atención. Cuenta con:
- **Seguridad y Acceso con PIN** para despliegue web en Google / Vercel.
- **Facturación Electrónica ARCA (ex-AFIP)** con CAE, código QR oficial y envío de tickets por WhatsApp.
- **Control de Caja y Turnos** con arqueo en vivo de efectivo, tarjeta y transferencia.
- **Gestión Rápida de Precios** y cortes desde el celular.

---

## 🚀 Funcionalidades Implementadas

### 1. 🔐 Acceso Seguro y Login Táctil
- Acceso protegido mediante PIN de 4 dígitos para proteger la aplicación subida a la nube.
- Perfiles de usuario integrados:
  - **Cajero Mostrador:** PIN `1234`
  - **Administrador:** PIN `9999`
- Botón de cierre de sesión seguro en el encabezado.

### 2. 🥩 Terminal de Venta Mobile-First
- **Buscador de Cortes en Tiempo Real:** Búsqueda instantánea de productos.
- **Pestañas Deslizables de Categorías:** Vaca, Cerdo, Achuras, Pollo, Elaborados.
- **Grilla Móvil Táctil:** Botones de gran tamaño con precios por kilo (`kg`) o unidad (`un`).
- **Teclado Táctil de Pesaje:** Modal inferior con botones numéricos y accesos rápidos de pesada (+0.5 kg, +1 kg, +1.5 kg, etc.).
- **Barra Flotante de Cobro:** Muestra en tiempo real la cantidad de ítems y el subtotal para ir a cobrar en 1 toque.

### 3. 🧾 Facturación Electrónica ARCA (ex-AFIP)
- **Tipos de Comprobante:** Factura B (IVA Incluido) y Factura C.
- **Receptores:** Consumidor Final automático, DNI o CUIT.
- **Comprobante Fiscal Autorizado:**
  - Código **CAE** y Fecha de Vencimiento de CAE.
  - **Código QR oficial de ARCA** generado bajo la normativa RG 4291/5048.
  - Punto de venta y número correlativo de comprobante.
- **Envío Inmediato por WhatsApp:** Botón para abrir WhatsApp con el ticket formateado y el link de verificación de ARCA listo para enviar al cliente.
- **Impresión Térmica:** Formato compatible con impresoras de 58mm y 80mm o descarga directa en PDF.

### 4. 🏪 Control de Caja y Arqueo de Turno
- **Apertura de Turno:** Selección de turno (**Mañana** / **Tarde**) con ingreso de **Fondo Inicial en Efectivo**.
- **Arqueo y Desglose en Vivo:**
  - Dinero Físico en Caja (Fondo Inicial + Cobros en Efectivo).
  - Total recaudado por Tarjeta.
  - Total recaudado por Transferencia.
- **Historial de Ventas del Turno:** Registro detallado de ventas con botón para ver y reimprimir la factura ARCA de cualquier venta previa.
- **Cierre de Turno:** Confirmación de seguridad en pantalla para cerrar turno y reiniciar la caja.

### 5. 🏷️ Gestión de Catálogo y Precios
- Actualización de precios del kilo/unidad al instante desde el celular.
- Creación y eliminación de categorías y productos.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19 + TypeScript
- **Bundler:** Vite 6
- **Estilos:** Tailwind CSS v4 (Paleta rústica: `#8B4513`, `#4F7942`, `#A52A2A`, `#FDFBF7`)
- **Iconos:** Lucide React
- **QR Fiscal:** `qrcode.react` (Normativa ARCA RG 4291)
- **Despliegue:** Optimizado para Vercel (`vercel.json`) y Google Cloud / Hosting

---

## 📂 Estructura del Código

```
├── src/
│   ├── main.tsx                # Bootstrap de React
│   ├── App.tsx                 # Control de navegación móvil, sesión, caja y catálogo
│   ├── types.ts                # Modelos (Product, Sale, FiscalData, ShiftState, AuthUser)
│   ├── data.ts                 # Catálogo inicial de carnes
│   ├── index.css               # Estilos Tailwind CSS
│   ├── services/
│   │   └── arcaService.ts      # Facturación ARCA, CAE, QR oficial y WhatsApp
│   └── components/
│       ├── LoginScreen.tsx     # Pantalla de Login táctil con PIN
│       ├── ProductGrid.tsx     # Buscador y grilla móvil de productos
│       ├── KeypadModal.tsx     # Teclado táctil para ingreso de kilos/unidades
│       ├── Cart.tsx            # Carrito móvil con switch de Factura ARCA y métodos de pago
│       ├── InvoiceModal.tsx    # Modal de Comprobante Fiscal ARCA con QR y WhatsApp
│       └── FooterModals.tsx    # Vistas de Caja/Arqueo (F4) y Catálogo/Precios (F2)
```

---

## 🚢 Despliegue en Vercel o Hosting Web

1. Conectar el repositorio de GitHub en [Vercel](https://vercel.com) o su proveedor de hosting.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
