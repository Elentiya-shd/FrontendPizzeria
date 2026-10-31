[README.md](https://github.com/user-attachments/files/34209989/README.md)
# Cocina – Pizzería (Frontend)

Pantalla de cocina del sistema integrado de pizzería. Muestra los pedidos que llegan de Recepción y permite al cocinero tomarlos, meterlos al horno y marcarlos como listos.

Hecho con **React 18 + Vite 5**. No tiene base de datos propia: consume la API del backend Express (`pizzeria-backend`).

## Requisitos

- Node.js 18 o superior
- Backend de la pizzería encendido en `http://localhost:3000` (con MySQL y `pizzeria_db` creada)

## Instalación y uso

```bash
npm install
npm run dev
```

Vite mostrará la dirección local, normalmente <http://localhost:5173>. Mantén abierta la terminal del backend (`npm start` en `pizzeria-backend`).

| Comando           | Qué hace                                  |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Servidor de desarrollo (con `--host`)     |
| `npm run build`   | Genera la versión de producción en `dist/`|
| `npm run preview` | Sirve localmente el build                 |

## Conexión con el backend

Las peticiones usan rutas relativas (`/api/v1/...`) y el servidor de Vite las reenvía a `http://localhost:3000` (ver `vite.config.js`).

- **Backend en otra dirección:** cambia el `target` del proxy en `vite.config.js`, o define la variable `VITE_API_URL` (por ejemplo en un archivo `.env`: `VITE_API_URL=http://192.168.1.10:3000/api/v1`).
- **Sin backend:** la pantalla muestra "No se pudo conectar con el servidor".

### Endpoints que usa

| Método | Ruta                              | Acción                              |
| ------ | --------------------------------- | ----------------------------------- |
| GET    | `/api/v1/kitchen/orders`          | Lista los pedidos de cocina         |
| PATCH  | `/api/v1/kitchen/orders/:id/start`| Inicia la preparación (con tiempo estimado) |
| PATCH  | `/api/v1/kitchen/orders/:id/oven` | Mete el pedido al horno             |
| PATCH  | `/api/v1/kitchen/orders/:id/ready`| Marca el pedido como listo          |
| PATCH  | `/api/v1/kitchen/orders/:id/back` | Regresa el pedido al paso anterior  |

## Cómo funciona la pantalla

Cada pedido es una tarjeta que avanza por tres estados:

1. **Pedido sin tomar** (pendiente): llegó de Recepción.
2. **Preparación** (azul): el cocinero lo tomó y eligió el tiempo estimado (10, 15, 20, 25, 30, 40, 50 o 60 min).
3. **Cocinando** (rojo): el pedido está en el horno.

Al terminar, el pedido se marca como listo y pasa a Recepción para su entrega.

- **Deslizar la tarjeta hacia arriba** avanza al siguiente estado; **hacia abajo** regresa.
- La lista se actualiza sola cada **5 segundos**.

## Estructura

```
src/
├── App.jsx                 # Pantalla principal y actualización periódica
├── main.jsx
├── api/cocina.js           # Llamadas al backend y adaptador pedido BD → modelo de cocina
├── components/
│   ├── PedidoCard.jsx      # Tarjeta de pedido
│   ├── SelectorTiempo.jsx  # Selector de tiempo estimado
│   └── Toast.jsx           # Avisos
├── hooks/useSwipeVertical.js  # Gesto de deslizar arriba/abajo
├── constants/
│   ├── estados.js          # Estados y etiquetas
│   ├── tiempos.js          # Intervalo de actualización y opciones de minutos
│   └── imagenesPizza.js    # Imagen por tipo de pizza
├── assets/                 # Imágenes de pizzas
└── styles/index.css
```

## Problemas comunes

| Problema | Qué revisar |
| -------- | ----------- |
| "No se pudo conectar con el servidor" | Backend apagado o fuera del puerto 3000. Prueba <http://localhost:3000/api/v1/health>; debe responder `{"ok":true,"database":"connected"}`. |
| "El servidor no respondió JSON" | El proxy de Vite no apunta al backend; revisa `vite.config.js`. |
| No aparecen pedidos | Crea uno desde Clientes o Recepción; debe estar en estado `REGISTRADO`/`EN_COCINA`. |

## Alcance

Configuración pensada para desarrollo y pruebas en una sola computadora.
