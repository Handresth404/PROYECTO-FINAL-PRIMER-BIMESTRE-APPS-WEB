# Survivors — Guía de ejecución, controles, estructura y créditos

## 1. Descripción
Survivors es un juego de supervivencia creado con Phaser y ejecutado mediante Vite. El jugador controla a un personaje que debe sobrevivir al ataque de enemigos, disparar, curarse y avanzar hasta el jefe final.

## 2. Requisitos
- Node.js 16 o superior.
- npm instalado.
- Navegador moderno (Chrome, Edge, Firefox, Brave, etc.).

## 3. Instalación y ejecución
1. Abre una terminal en la carpeta raíz del proyecto.
2. Instala dependencias (solo la primera vez):

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

4. Abre el navegador en la dirección que indique Vite, por ejemplo:

```text
http://localhost:5173
```

> Si el servidor no abre automáticamente, copia la URL que aparece en la terminal.

## 4. Scripts disponibles
- `npm run dev` — Ejecuta el juego en modo desarrollo.
- `npm run build` — Genera la versión optimizada para producción.
- `npm run preview` — Sirve localmente la versión generada por `build`.

## 5. Controles del juego
- Movimiento: Flechas del teclado (`↑`, `↓`, `←`, `→`).
- Alternativa de movimiento: teclas `W`, `A`, `S`, `D`.
- Disparar: clic izquierdo del ratón.
- Curarse: clic derecho del ratón.
- Pausar: tecla `Esc`.

> El menú contextual del navegador está deshabilitado para permitir el uso del clic derecho dentro del juego.

## 6. Cómo jugar
- Usa las teclas de movimiento para desplazarte por la pantalla.
- Apunta con el cursor y haz clic izquierdo para disparar a los enemigos.
- Usa clic derecho para curar al jugador cuando tenga daño.
- Presiona `Esc` para pausar la partida en cualquier momento.
- Sobrevive el mayor tiempo posible y alcanza la puntuación para activar el jefe.

## 7. Estructura del proyecto

- `index.html`
  - Página principal que carga el juego.

- `package.json`
  - Configuración del proyecto y scripts de npm.

- `src/main.js`
  - Configuración principal de Phaser y las escenas del juego.

- `src/scenes/`
  - `Boot.js` — Inicializa recursos y transiciones.
  - `Menu.js` — Menú principal del juego.
  - `Game.js` — Lógica principal de juego, disparos, enemigos, jefe y eventos.
  - `UIScene.js` — Interfaz de usuario, puntaje y salud.
  - `Pause.js` — Pantalla de pausa.
  - `Win.js` — Pantalla de victoria.
  - `GameOver.js` — Pantalla de fin de juego.

- `src/objects/`
  - `Player.js` — Lógica del jugador, movimiento, vida y curación.
  - `Enemy.js` — Comportamiento de los enemigos.
  - `Bullet.js` — Comportamiento de las balas.
  - `Boss.js` — Lógica del jefe final.

- `public/assets/`
  - Recursos de imágenes, sprites y audio usados por el juego.

## 8. Dependencias principales
- `phaser` — motor de juego en JavaScript.
- `vite` — servidor de desarrollo y bundler rápido.

## 9. Créditos
- Autores: Ayala Andres, Pacheco Pablo, Saeteros Jhonn.
- Motor de juego: Phaser — https://phaser.io
- Herramienta de bundling: Vite — https://vitejs.dev

## 10. Licencia
No se incluye una licencia específica en este repositorio. Si deseas compartir o distribuir el juego, añade un archivo `LICENSE` con la licencia que prefieras.

## 11. Notas adicionales
- Si al cambiar recursos en `public/assets/` el juego no se actualiza, reinicia el servidor de Vite.
- Para problemas de compatibilidad, verifica que `type: "module"` esté configurado en `package.json`.
- Esta guía cubre la ejecución, los controles, la estructura del proyecto y los créditos.