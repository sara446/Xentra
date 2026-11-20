# Xentra – Inventory Pro

Aplicación móvil para el control de inventario de pequeñas y medianas empresas: registro de productos, entradas y salidas, alertas de stock bajo y gestión de usuarios.

**Versión final.** Un solo proyecto con arquitectura **Modelo – Vista – Controlador (MVC)**:

- **App móvil:** React Native con Expo.
- **Backend:** Kotlin con Ktor, en este mismo proyecto.
- **Base de datos:** Firebase Realtime Database, y Firebase Authentication para el inicio de sesión.

```
 App React Native (Vista)
   │ login                       │ petición + token
   ▼                             ▼
 Firebase Authentication      Backend Ktor (:8080)
                                view → controller → model
                                                     │ Admin SDK
                                                     ▼
                                        Firebase Realtime Database
```

## Arquitectura MVC

| Capa | App (JavaScript) | Backend (Kotlin) |
|---|---|---|
| **Modelo**: estructura de los datos | `src/models/` (Product, Movement, User) | `src/main/kotlin/com/xentra/model/`: datos y lectura/escritura en Firebase |
| **Vista**: lo que ve el usuario | `src/screens/` y `src/components/` | `src/main/kotlin/com/xentra/view/`: endpoints que responden JSON a la app |
| **Controlador**: reglas y validaciones | `src/controllers/`: llama al backend | `src/main/kotlin/com/xentra/controller/`: valida y aplica las reglas del negocio |

Cada módulo tiene su pieza en las tres capas. Por ejemplo, los **Productos**:

```
InventoryScreen.js → ProductController.js → GET /api/products → ProductView.kt → ProductController.kt → ProductModel (Product.kt) → Firebase
```

## Tecnologías

| Herramienta | Versión | Uso |
|---|---|---|
| React Native / Expo SDK | 0.86 / 57 | App móvil |
| React Navigation | 7 | Navegación (Stack + Bottom Tabs) |
| Firebase JS SDK | 13 | Inicio de sesión desde la app |
| Kotlin | 2.1.21 | Lenguaje del backend |
| Ktor (Netty) | 3.1.3 | Servidor REST |
| Firebase Admin SDK | 9.4.3 | Acceso del backend a Firebase |
| Gradle (wrapper incluido) | 8.14.3 | Compilación del backend |

## Requisitos

- **Node.js 20 o superior** y npm 10 o superior
- **JDK 17 o superior** (`java -version`). Si usas IntelliJ IDEA, puede descargarlo por ti.
- **Expo Go para SDK 57** en el celular, o un emulador de Android
- El celular y el computador conectados a la **misma Wi-Fi**

## Configuración (solo la primera vez)

### 1. Clave del backend (Firebase Admin)
1. Firebase Console → ⚙️ Configuración del proyecto → **Cuentas de servicio** → **Generar nueva clave privada**.
2. Cambia el nombre del archivo a **`serviceAccountKey.json`** y ponlo en la raíz del proyecto, junto a `package.json`.

> Esta clave da acceso total a Firebase. Ya está en `.gitignore`: **nunca la subas a GitHub**.

### 2. Instalar dependencias de la app
```bash
npm install
npx expo install --fix
copy .env.example .env      # Mac/Linux: cp .env.example .env
```

### 3. Archivo `.env`
| Variable | Descripción |
|---|---|
| `EXPO_PUBLIC_API_URL` | URL del backend terminada en `/api`, con **la IP del PC** (el backend la muestra al arrancar). Ej: `http://192.168.1.15:8080/api`. En el emulador de Android: `http://10.0.2.2:8080/api` |
| `EXPO_PUBLIC_FIREBASE_*` | Configuración web de Firebase (Consola → Configuración del proyecto → Tus apps) |

### 4. Reglas de la base de datos
Todo pasa por el backend, así que la base debe quedar cerrada para el público.
Firebase Console → Realtime Database → **Reglas** → pega el contenido de `database.rules.json` → **Publicar**.

## Ejecución

Abre **dos terminales** en la carpeta del proyecto:

| Terminal | Comando | Qué hace |
|---|---|---|
| 1 – Backend | `npm run backend` (Mac/Linux: `npm run backend:mac`) | Inicia el servidor Ktor en el puerto 8080 |
| 2 – App | `npm start` | Inicia Expo y muestra el código QR |

La primera vez que corre, el backend descarga Gradle y sus librerías, y tarda unos minutos. Cuando está listo muestra:
```
Firebase conectado: https://xentra-5811a-default-rtdb.firebaseio.com
Xentra API escuchando en el puerto 8080
  → En el .env: EXPO_PUBLIC_API_URL=http://192.168.1.15:8080/api
```
Para comprobarlo, abre http://localhost:8080/health en el navegador.

**Desde IntelliJ IDEA:** abre la carpeta del proyecto, ve a `src/main/kotlin/com/xentra/Application.kt` y pulsa ▶ junto a `fun main()`.

## Primer uso

1. En la app toca **Continuar → Regístrate**. **El primer usuario registrado queda como Administrador de Inventario**; los siguientes quedan como Empleado.
2. El administrador puede crear usuarios con cualquier rol y activarlos o desactivarlos desde **Perfil → Gestión de usuarios**. Un usuario desactivado no puede iniciar sesión.
3. Si la base está vacía, el backend carga 4 productos de ejemplo. Para evitarlo, usa la variable `SEED_DEMO_DATA=false`.

## Estructura del proyecto

```
xentra/
├── App.js, index.js, app.json      # App: raíz, entrada y configuración de Expo
├── package.json, metro.config.js   # App: dependencias, scripts y empaquetador
├── build.gradle.kts, gradlew       # Backend: compilación con Gradle
├── database.rules.json             # Reglas de Realtime Database
├── serviceAccountKey.json          # Clave del backend (la agregas tú, no se sube)
├── .env / .env.example             # Variables de la app
└── src/
    ├── models/          ┐
    ├── screens/         │  APP (React Native)
    ├── components/      │  Modelo, Vista (pantallas y componentes) y Controlador
    ├── controllers/     │
    ├── services/        │  api.js (cliente del backend), authService.js (sesión)
    ├── context/         │  Usuario logueado y su rol
    ├── config/          │  env.js, firebase.js
    ├── navigation/      │
    ├── theme/, utils/,  │
    ├── assets/          ┘
    └── main/kotlin/com/xentra/      BACKEND (Kotlin + Ktor)
        ├── Application.kt           # Punto de entrada
        ├── model/                   # MODELO: Product, Movement, User + Firebase
        ├── controller/              # CONTROLADOR: Product, Movement, User, Auth, Dashboard, Alert
        ├── view/                    # VISTA: endpoints JSON (ProductView, UserView...)
        └── config/                  # Firebase, JSON, CORS, manejo de errores
```

## Endpoints del backend

Todas las rutas `/api/*`, salvo el registro, requieren el encabezado `Authorization: Bearer <token de Firebase>`. La app lo envía automáticamente. Los errores responden con `{ "message": "...", "field": "..." }`.

| Método | Ruta | Quién | Descripción |
|---|---|---|---|
| GET | `/health` | Público | Estado del servidor |
| POST | `/api/auth/register` | Público | Registro `{ name, email, password }` |
| GET | `/api/me` | Usuario | Perfil del usuario logueado |
| GET / POST | `/api/products` | Usuario | Listar / crear productos |
| GET / PUT / DELETE | `/api/products/{id}` | Usuario | Detalle / editar / eliminar |
| GET / POST | `/api/movements` | Usuario | Historial / registrar entrada o salida (actualiza el stock) |
| GET | `/api/alerts` | Usuario | Productos con stock bajo |
| GET | `/api/dashboard` | Usuario | Totales del panel |
| GET / POST | `/api/users` | Admin | Listar / crear usuarios |
| PUT | `/api/users/{id}/toggle` | Admin | Activar / desactivar |

## Variables del backend (opcionales)

| Variable | Por defecto | Descripción |
|---|---|---|
| `PORT` | `8080` | Puerto del servidor |
| `FIREBASE_CREDENTIALS` | `serviceAccountKey.json` | Ruta a la clave de Firebase |
| `FIREBASE_DATABASE_URL` | `https://xentra-5811a-default-rtdb.firebaseio.com` | URL de Realtime Database |
| `SEED_DEMO_DATA` | `true` | Carga productos de ejemplo si la base está vacía |

## Solución de problemas

| Problema | Solución |
|---|---|
| `No se encontró la clave de Firebase` | Falta `serviceAccountKey.json` en la raíz del proyecto |
| Error de versión de Java | Instala JDK 17 o superior |
| "No se pudo conectar con el servidor" | El backend está apagado, o `EXPO_PUBLIC_API_URL` tiene `localhost` o una IP equivocada. Corrige la IP y reinicia con `npx expo start -c` |
| Funciona en el PC pero no en el celular | Usa la misma Wi-Fi y permite Java en el Firewall de Windows (redes privadas) |
| "Tu sesión expiró" | Cierra sesión y vuelve a entrar |
| Expo Go dice que el proyecto es incompatible | Verifica que Expo Go sea para SDK 57 y ejecuta `npx expo install --fix` |
| El celular no encuentra Expo | Ejecuta `npx expo start --tunnel` |
| Pantalla en blanco o errores raros | Limpia la caché con `npx expo start -c` |
