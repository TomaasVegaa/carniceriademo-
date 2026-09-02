# 🥩 Sistema de Punto de Venta (POS) para Carnicería

Sistema moderno, táctil y de alta velocidad diseñado específicamente para carnicerías y comercios de barrio. Desarrollado con **React, Vite, TypeScript y Tailwind CSS**.

---

## 📌 Resumen del Proyecto

Este proyecto es una **Terminal de Venta (POS)** optimizada para pantallas táctiles y teclado físico, con una interfaz rústica y cálida de alto contraste diseñada para la dinámica rápida del despacho de mostrador.

---

## 🚀 Funcionalidades Implementadas

### 1. 🛒 Terminal de Venta Táctil
- **Grilla de Productos por Categorías:** Navegación por pestañas (Vacuna, Cerdo, Pollo, Elaborados, Achuras, etc.) con botones táctiles grandes y precios visibles.
- **Teclado Numérico Táctil (Modal):** Ingreso rápido de peso en kilogramos (`kg`) con decimales o unidades (`un`) para productos por pieza.
- **Carrito de Compras en Tiempo Real:** 
  - Cálculo automático de subtotales y total general en moneda local (`$ / ARS`).
  - Eliminación individual de productos y botón de vaciar carrito.
  - Selección de **Método de Pago** (Efectivo, Tarjeta, Transferencia).
  - Opción de **Factura Consumidor Final**.
  - Bloqueo de seguridad: El botón "COBRAR" se deshabilita si la caja está cerrada (`CAJA CERRADA`).

### 2. 🏪 Control de Caja y Turnos (F4)
- **Apertura de Caja:** Selección de turno (**Mañana** / **Tarde**) con ingreso de **Fondo Inicial de Caja**.
- **Arqueo y Desglose en Vivo:**
  - Total de dinero físico en caja (Fondo inicial + Total en Efectivo).
  - Total recaudado por Tarjeta.
  - Total recaudado por Transferencia.
- **Historial de Ventas del Turno:** Tabla detallada con hora exacta, detalle de productos/pesos, método de pago y monto cobrado.
- **Cierre de Turno:** Confirmación visual integrada directamente en la interfaz.

### 3. 🏷️ Gestión de Catálogo y Precios CRUD (F2)
- Creación y eliminación de categorías en vivo.
- Alta, edición de precios/nombres/unidades y baja de productos.
- Los cambios se reflejan inmediatamente en la grilla de ventas.

### 4. ⚡ Atajos de Teclado y Ayuda (Footer)
- `F1`: Ayuda y guía rápida de teclas de acceso rápido.
- `F2`: Panel de Precios y Catálogo.
- `F3`: Balanza y guía de conectividad.
- `F4`: Panel de Caja y Registro de Ventas.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19 + TypeScript
- **Bundler:** Vite 6
- **Estilos:** Tailwind CSS v4 (Paleta: tonos cálidos y naturales `#8B4513`, `#4F7942`, `#A52A2A`, `#FDFBF7`)
- **Iconos:** Lucide React
- **Animaciones:** Motion (`motion/react`)
- **Despliegue:** Optimizado para Vercel (`vercel.json` configurado para SPA) y GitHub

---

## 📂 Estructura del Código

```
├── index.html                  # Entry point HTML
├── metadata.json               # Configuración del proyecto
├── vercel.json                 # Configuración de despliegue SPA en Vercel
├── package.json                # Dependencias y scripts
├── src/
│   ├── main.tsx                # Bootstrap de React
│   ├── App.tsx                 # Estado global (caja, carrito, ventas, catálogo)
│   ├── types.ts                # Modelos TypeScript (Product, CartItem, Sale, ShiftState)
│   ├── data.ts                 # Catálogo inicial de productos y categorías
│   ├── index.css               # Estilos globales Tailwind
│   └── components/
│       ├── Cart.tsx            # Panel lateral derecho (carrito, cobro, métodos de pago)
│       ├── ProductGrid.tsx     # Grilla de categorías y productos
│       ├── KeypadModal.tsx     # Modal de teclado numérico táctil para kg/unidades
│       └── FooterModals.tsx    # Modales de F1 (Ayuda), F2 (Precios CRUD), F3 (Balanza), F4 (Caja)
```

---

## 🔮 Roadmap / Próximas Fases para Continuar

Para continuar el desarrollo con **Google Antigravity** o nuevos desarrolladores, las siguientes etapas recomendadas son:

1. **☁️ Persistencia en la Nube (Base de Datos):**
   - Integrar Firebase Firestore o PostgreSQL / Supabase para sincronización multi-caja y persistencia de ventas y precios.
2. **📒 Cuentas Corrientes ("Fiado"):**
   - Módulo de clientes frecuentes, asignación de ventas a cuenta corriente y registro de pagos parciales/totales.
3. **⚡ Venta Libre / Monto Rápido:**
   - Botón directo para ingresar importes arbitrarios (ej. leña, carbón, combos) sin requerir producto en catálogo.
4. **🥩 Control de Stock y Desposte de Media Res:**
   - Registro de ingreso de media res por kilo y cálculo de mermas y rendimientos de cortes.
5. **👥 Roles y Permisos de Usuario:**
   - Perfil Cajero (solo cobro) vs. Perfil Administrador/Dueño (modificación de precios y cierres).
6. **🖨️ Hardware & Periféricos:**
   - Conexión con Balanzas (Web Serial API para protocolos Systel/Kretz).
   - Impresión de tickets en comandera térmica (58mm/80mm ESC/POS).
   - Soporte para lector de código de barras USB/Bluetooth.

---

## 🚢 Despliegue en Vercel desde GitHub

1. Conectar el repositorio de GitHub en [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. El archivo `vercel.json` incluido en el proyecto garantiza que todas las rutas se resuelvan correctamente.
