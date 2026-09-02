# Contexto y Directivas para el Agente (Google Antigravity)

Este archivo contiene el contexto del proyecto, directivas de diseño y especificaciones técnicas para continuar el desarrollo del **Sistema de Punto de Venta (POS) para Carnicería**.

---

## 🎯 Objetivo del Proyecto
Desarrollar un sistema POS especializado para carnicerías, fiambrerías y comercios de barrio.
Prioridades de diseño:
- **Táctil y de alta velocidad:** Botones de gran tamaño, sin distracciones, con flujo de pocos clics.
- **Teclas de función F1-F4:** Operación híbrida con teclado físico de caja registradora.
- **Estética "Natural / Rústica":** Tonos madera (#8B4513), verde (#4F7942), vino (#A52A2A) y fondo cálido (#FDFBF7 / #EFEBE9).

---

## 🏗️ Estado Actual del Código

1. **`src/types.ts`**:
   - `Product`: `{ id, name, price, category, unit: 'kg' | 'un' }`
   - `CartItem`: `{ product, quantity }`
   - `Category`: `string`
   - `Sale`: `{ id, items, total, paymentMethod, invoice, timestamp, shift }`
   - `ShiftState`: `{ isOpen, shift: 'Mañana' | 'Tarde' | null, initialBalance: number }`

2. **`src/App.tsx`**:
   - Administra el estado global de catálogo (`products`, `categories`), carrito (`cart`), caja (`shift`), ventas (`sales`) y modales (`activeModal`).
   - Bloquea el botón "COBRAR" si `shift.isOpen === false`.

3. **`src/components/ProductGrid.tsx`**:
   - Selector lateral de categorías y grilla responsiva de cortes de carne y productos.

4. **`src/components/KeypadModal.tsx`**:
   - Teclado numérico táctil para ingresar pesos o cantidades.

5. **`src/components/Cart.tsx`**:
   - Resumen del pedido en curso, métodos de pago (`Efectivo`, `Tarjeta`, `Transferencia`), casilla de factura consumidor final y acción de cobrar.

6. **`src/components/FooterModals.tsx`**:
   - `PricesModal` (F2): CRUD interactivo de categorías y productos (creación, edición de precio/nombre/unidad y borrado).
   - `CashRegisterModal` (F4): Apertura de turno con fondo inicial, cálculo de arqueo (efectivo, tarjeta, transferencia), historial de ventas con desglose y confirmación en pantalla para cierre de turno.
   - `HelpModal` (F1) y `ScaleModal` (F3).

7. **`vercel.json`**:
   - Configurado con `outputDirectory: "dist"` y reescritura SPA a `/index.html`.

---

## 📋 Tareas Pendientes Prioritarias (Roadmap)

Cuando el usuario pida avanzar, priorizar las siguientes funcionalidades:
1. **Persistencia Cloud:** Implementar base de datos en tiempo real (Firebase Firestore / Cloud SQL / Supabase) para que las ventas, productos y turnos persistan en la nube y sincronicen múltiples terminales.
2. **Cuentas Corrientes ("Fiado"):** Módulo de clientes de confianza, asignación de deuda al cobrar y registro de pagos a cuenta.
3. **Venta Rápida / Libre:** Botón de monto libre para productos no inventariados (leña, carbón, combos).
4. **Mermas y Desposte:** Cálculo de rendimiento por media res.
5. **Integración con Impresoras Térmicas y Balanzas:** Generación de tickets ESC/POS y lectura serial de peso.

---

## ⚙️ Reglas de Código
- Usar **TypeScript** con tipado estricto.
- Usar **Tailwind CSS** para todo el styling; mantener la paleta rústica consistente.
- Iconografía exclusivamente mediante **`lucide-react`**.
- No utilizar `window.alert` o `window.confirm`; usar estados y componentes interactivos integrados en la UI.
