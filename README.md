# Xentra – Inventory Pro (Frontend React Native)

Aplicación móvil para el control de inventario de pequeñas y medianas empresas: registro de productos, entradas y salidas, alertas de stock bajo y gestión de usuarios.

Esta es la **segunda entrega**: frontend en React Native con Expo, navegación funcional y datos simulados (el backend en Ktor se integra en la siguiente etapa).

## Tecnologías

| Herramienta | Versión | Uso |
|---|---|---|
| React Native | 0.86 | Framework de la app móvil |
| Expo SDK | 57 | Entorno de desarrollo y ejecución |
| React | 19.2 | Librería de interfaz |
| React Navigation | 7 | Navegación (Stack + Bottom Tabs) |
| @expo/vector-icons | 15 | Íconos (Ionicons) |
| expo-image-picker | 57 | Selección de imágenes de producto |

## Requisitos previos

- **Node.js 20 LTS o superior** (`node -v`)
- **npm 10+** (viene con Node)
- Una de estas opciones para ejecutar la app:
  - **Celular** con la app **Expo Go para SDK 57** (Android o iOS), en la misma red Wi-Fi que el computador, o
  - **Emulador Android** (Android Studio → Device Manager), o
  - **Navegador web** (solo para pruebas rápidas)

## Instalación

```bash
# 1. Descomprimir el ZIP (o clonar el repositorio) y entrar a la carpeta
cd xentra

# 2. Instalar dependencias
npm install

# 3. Alinear las versiones con el SDK de Expo
npx expo install --fix

# 4. Crear el archivo de entorno (si no existe)
cp .env.example .env        # En Windows: copy .env.example .env
```

## Ejecución

| Comando | Qué hace |
|---|---|
| `npm start` | Inicia Expo y muestra un código QR |
| `npm run android` | Abre la app en el emulador Android (debe estar encendido) |
| `npm run ios` | Abre la app en el simulador de iOS (solo macOS) |
| `npm run web` | Abre la app en el navegador (http://localhost:8081) |

**En el celular:** ejecuta `npm start`, abre Expo Go y escanea el QR (en iPhone, con la cámara).
**En el emulador:** abre el emulador desde Android Studio, ejecuta `npm start` y presiona `a`.

Si cambias el `.env` o algo se ve raro, reinicia limpiando la caché: `npx expo start -c`.

## Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador de Inventario | `soporte@xentra.com` | `123456` |
| Empleado | `a.gomez@xentra.com` | `123456` |

En el login también está el botón **"Usar cuenta de prueba"**, que llena los datos automáticamente.

## Estructura del proyecto

```
xentra/
├── App.js                  # Componente raíz: SafeArea + Modal global + Navegación
├── index.js                # Punto de entrada (registerRootComponent)
├── app.json                # Configuración de Expo (nombre, ícono, permisos)
├── package.json            # Dependencias y scripts
├── .env / .env.example     # Variables de entorno
└── src/
    ├── assets/images/      # Logo e ícono de la app
    ├── config/env.js       # Lectura de variables de entorno
    ├── navigation/         # Navegación (Stack raíz + Tabs + Stacks por pestaña)
    ├── screens/            # Pantallas agrupadas por módulo
    │   ├── auth/           #   Splash, Login, Registro, Recuperar contraseña
    │   ├── home/           #   Dashboard
    │   ├── inventory/      #   Inventario, Detalle, Agregar, Editar producto
    │   ├── movements/      #   Historial y Registro de movimientos
    │   ├── alerts/         #   Alertas de stock bajo
    │   ├── users/          #   Gestión de usuarios
    │   └── profile/        #   Perfil y cierre de sesión
    ├── components/         # Componentes reutilizables (Button, Input, Select, Badge, AppModal…)
    ├── controllers/        # Lógica de negocio por módulo
    ├── models/             # Estructura de datos (Product, Movement, User)
    ├── services/api.js     # Cliente HTTP para el futuro backend en Ktor
    ├── data/mockDb.js      # Datos simulados
    ├── theme/              # Colores, tipografía, espaciados
    └── utils/              # Formato de fechas y validaciones de formularios
```

## Variables de entorno (.env)

| Variable | Descripción |
|---|---|
| `EXPO_PUBLIC_APP_NAME` | Nombre de la app |
| `EXPO_PUBLIC_API_URL` | URL base del backend (se usará con Ktor) |
| `EXPO_PUBLIC_USE_MOCK` | `true` usa datos locales simulados; `false` llama a la API |

## Notas

- Los datos son **simulados y viven en memoria**: al recargar la app vuelven a su estado inicial.
- Las imágenes de ejemplo se cargan de internet; si no hay conexión se muestra un ícono de caja.
- Al crear o editar un producto se puede elegir una foto de la galería.

## Solución de problemas

| Problema | Solución |
|---|---|
| Expo Go dice que el proyecto es incompatible | El proyecto usa SDK 57: verifica que Expo Go sea para SDK 57 y ejecuta `npx expo install --fix` |
| El celular no encuentra el servidor | Usa la misma Wi-Fi o ejecuta `npx expo start --tunnel` |
| `npm run android` no encuentra el dispositivo | Abre primero el emulador en Android Studio |
| Pantalla en blanco o errores raros | `npx expo start -c` para limpiar caché |
