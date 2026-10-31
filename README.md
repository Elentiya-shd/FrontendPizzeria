# Clientes – Pizzería (Frontend)

Pantalla de clientes del sistema integrado de pizzería: menú, cuenta (registro e inicio de sesión), ticket de compra, confirmación de pedidos y rastreo por folio.

Es un sitio **estático** (HTML + CSS + JavaScript, sin build ni dependencias). No tiene servidor propio: lo sirve el backend Express (`pizzeria-backend`) y consume su API.

## Requisitos

- Node.js 18 o superior y MySQL 8 o superior
- Backend de la pizzería encendido en `http://localhost:3000`, con la base `pizzeria_db` creada

## Cómo abrirlo

1. Levanta el backend (`npm install` y `npm start` dentro de `pizzeria-backend`).
2. Abre en el navegador:

   **<http://localhost:3000/cliente/>**

> No abras `index.html` con doble clic ni con `file://`. El front usa rutas relativas (`/api/v1/...`) y una cookie de sesión, que solo funcionan cuando el backend lo sirve desde el mismo origen.

El backend sirve la carpeta `public/` de este módulo en la ruta `/cliente`. Si cambias de lugar la carpeta, ajusta `CLIENT_PUBLIC` en `server.js`.

## Qué puede hacer el cliente

- **Menú:** se carga desde la tabla `products` de MySQL; agregar y quitar productos del ticket.
- **Cuenta:** crear cuenta (nombre, correo, teléfono, contraseña de al menos 8 caracteres), iniciar y cerrar sesión. Al registrarse, la sesión inicia sola.
- **Mi ticket:** resumen y total, tipo de pedido (local, para llevar o domicilio), dirección si es a domicilio y método de pago. Para confirmar se requiere sesión iniciada.
- **Estado del pedido:** buscar por folio (ej. `PED-0001`); muestra barra de progreso y se actualiza solo mientras la vista está abierta. Solo se puede consultar con la cuenta que creó el pedido.

El total lo calcula el backend con los precios de MySQL; el que se ve en pantalla es informativo. No se procesan pagos reales.

## Endpoints que usa

| Método | Ruta                          | Acción                          |
| ------ | ----------------------------- | ------------------------------- |
| GET    | `/api/v1/products`            | Catálogo del menú               |
| POST   | `/api/v1/auth/register`       | Crear cuenta                    |
| POST   | `/api/v1/auth/login`          | Iniciar sesión                  |
| GET    | `/api/v1/auth/me`             | Recuperar la sesión activa      |
| POST   | `/api/v1/auth/logout`         | Cerrar sesión                   |
| POST   | `/api/v1/customer/orders`     | Confirmar pedido (requiere sesión) |
| GET    | `/api/v1/customer/orders/:id` | Rastrear pedido propio          |

La sesión viaja en una cookie HttpOnly (`credentials: 'same-origin'`).

## Estados que ve el cliente

| Tipo de pedido        | Recorrido                                              |
| --------------------- | ------------------------------------------------------ |
| Local / Para llevar   | REGISTRADO → EN_COCINA → LISTO → COMPLETADO            |
| A domicilio           | REGISTRADO → EN_COCINA → LISTO → EN_REPARTO → COMPLETADO |
| Cancelación           | REGISTRADO → CANCELADO (desde Recepción)               |

## Estructura

```
public/
├── index.html        # Vistas: menú, ticket, estado y diálogo de cuenta
├── css/cliente.css   # Estilos
└── js/cliente.js     # Lógica, llamadas a la API y rastreo
```

La fuente Poppins se carga desde Google Fonts, así que la tipografía requiere internet; sin conexión se usa una fuente del sistema.

## Problemas comunes

| Problema | Qué revisar |
| -------- | ----------- |
| La página no carga | Usa `http://localhost:3000/cliente/` y mantén `npm start` activo. |
| "No se pudo conectar con el servidor" | Backend apagado; prueba `http://localhost:3000/api/v1/health` (debe responder `{"ok":true,"database":"connected"}`). |
| El menú aparece vacío | Revisa en MySQL: `SELECT * FROM pizzeria_db.products;` y que estén disponibles. |
| El login rechaza el acceso | Correo y contraseña exactos, y que la cuenta se haya creado en esta misma base. |
| No se puede rastrear un folio | Inicia sesión con la cuenta que hizo el pedido. |

## Alcance

Configuración pensada para desarrollo y pruebas en una sola computadora.
