import Phaser from 'phaser';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy'; // Importamos el enemigo
import Bullet from '../objects/Bullet';
import Boss from '../objects/Boss';

class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload() {
        if (!this.textures.exists('minotaur')) {
            this.load.spritesheet('minotaur', '/assets/minotaur_alpha.png', {
                frameWidth: 128,
                frameHeight: 128
            });
        }
    }

    create() {
        // --- VARIABLES DE DIFICULTAD ---
        this.survivalTime = 300; // Segundos que lleva vivo
        this.spawnDelay = 2000; // Inicia en 2 segundos por zombi
        this.zombieSpeed = 40;  // Velocidad base de los zombis
        this.zombieHealth = 10; // Salud base



        this.bgMusic = this.sound.add('game_music', { 
            volume: 0.4,  // Un volumen un poco más bajo para escuchar los efectos después
            loop: true    // Que se repita infinitamente mientras juegas
        });
        this.bgMusic.play();


        const bg = this.add.image(400, 300, 'background');
        bg.setDisplaySize(800, 600); // Esto estira/encoge la imagen para que encaje perfecto

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cursors = this.input.keyboard.createCursorKeys();

        // Evitar que el menú contextual del navegador aparezca al clic derecho
        this.input.mouse.disableContextMenu();

        // Configuramos una tecla y un flag robusto para pausar (en caso de que el listener no capture)
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this._paused = false;

        // Listener original (mantener por compatibilidad)
        this.input.keyboard.on('keydown-ESC', () => {
            if (this._paused) return;
            this._paused = true;
            if (this.bgMusic) this.bgMusic.pause();
            this.scene.pause('Game');
            this.scene.pause('UIScene');
            this.scene.launch('Pause');
        });
        
        // 2. Crear al jugador de vuelta en el centro de la pantalla (400x300)
        this.player = new Player(this, 400, 300);
        this.nextBossScore = 100;

        // --- SISTEMA DE OLEADAS ---
        // 1. Creamos un grupo para almacenar a todos los zombis
        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true // Esto también hace que ya no necesites el forEach en el update
        });

        // 2. Temporizador: Llama a la función 'spawnZombie' cada 2 segundos (2000 ms)
        this.time.addEvent({
            delay: 2000, 
            callback: this.spawnZombie,
            callbackScope: this,
            loop: true
        });

        // --- DISPAROS ---
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 30, // Aumentamos la cantidad de balas por si hay muchos zombis
            runChildUpdate: true
        });

        this.input.on('pointerdown', (pointer) => {
            // Clic derecho = curar. Compatibilidad: pointer.rightButtonDown() o pointer.button === 2
            const isRight = (pointer.rightButtonDown && pointer.rightButtonDown()) || pointer.button === 2;
            if (isRight) {
                this.player.useHeal();
                return;
            }

            // Clic izquierdo = disparar (pointer.leftButtonDown() o pointer.button === 0)
            const isLeft = (pointer.leftButtonDown && pointer.leftButtonDown()) || pointer.button === 0;
            if (isLeft) {
                const bullet = this.bullets.get();
                if (bullet) {
                    bullet.fire(this.player.x, this.player.y, pointer.x, pointer.y);
                    this.fireSound.play();
                }
            }
        });

        this.fireSound = this.sound.add('fire_sound', { 
            volume: 0.3 // Volumen al 30% (ajústalo si suena muy fuerte o muy bajo)
        });

        // muerte
        this.deathSound = this.sound.add('death_sound', {
            volume: 0.4 // Volumen al 50% para que se escuche claramente
        });

        // --- NUEVO: REGISTRAR AUDIO DEL JEFE ---
        this.bossDeathSound = this.sound.add('boss_death_sound', { 
            volume: 0.6 // Puedes ponerle un poco más de volumen para que suene épico
        });

        // --- NUEVAS COLISIONES ---
        // Ahora verificamos las colisiones contra el GRUPO de enemigos (this.enemies)
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerZombieCollision, null, this);
        this.physics.add.overlap(this.bullets, this.enemies, this.handleBulletHit, null, this);

        this.cameras.main.setBackgroundColor('#333333');
        this.scene.launch('UIScene');
        
        this.time.addEvent({
            delay: 1000,
            callback: this.updateSurvivalTime,
            callbackScope: this,
            loop: true
        });

        this.startSpawnTimer();
    }

    update() {
        this.player.update(this.cursors);
    }

    spawnZombie() {
        const edge = Phaser.Math.Between(0, 3);
        let x, y;

        if (edge === 0) { x = Phaser.Math.Between(-50, 850); y = -50; } 
        else if (edge === 1) { x = 850; y = Phaser.Math.Between(-50, 650); } 
        else if (edge === 2) { x = Phaser.Math.Between(-50, 850); y = 650; } 
        else if (edge === 3) { x = -50; y = Phaser.Math.Between(-50, 650); }

        // Usamos get() pasando solo x e y
        const zombie = this.enemies.get(x, y);
        
        if (zombie) {
            zombie.target = this.player; 
            
            // --- ¡NUEVAS LÍNEAS DE RESETEO! ---
            zombie.isDead = false;
            zombie.isAttacking = false; // Evita que nazcan "trabados"
            zombie.body.enable = true;  // Reactivamos su física por si se desactivó al morir
            // ----------------------------------

            zombie.setActive(true);
            zombie.setVisible(true);
            zombie.body.reset(x, y); 
            zombie.play('zombie_walk_down', true); 

            // --- NUEVO: ASIGNAR VIDA DINÁMICA ---
            // Toma el valor que va subiendo con el reloj
            zombie.health = this.zombieHealth;
        }
    }

    handlePlayerZombieCollision(player, zombie) {
        // Si el zombi ya está muerto o ya está atacando, no hacemos nada
        if (zombie.isDead || zombie.isAttacking) return;

        // Iniciamos la animación de ataque del zombi
        zombie.attack();

        // Aplicamos daño AL INICIO del ataque (no esperar a que termine la animación)
        if (typeof player.takeDamage === 'function') {
            player.takeDamage(10);
        }
    }

    

handleBulletHit(bullet, zombie) { 
        bullet.disableBody(true, true);

        if (zombie.isDead) {
            return;
        }

        let pointsAwarded = 0;

        if (zombie instanceof Boss) {
            zombie.takeDamage(10);

            if (zombie.isDead) {
                pointsAwarded = 50;
                this.bossDeathSound.play(); 
            }
        } else {
            // --- NUEVO: SISTEMA DE VIDA PARA ZOMBIS NORMALES ---
            zombie.health -= 10; // La bala hace 10 de daño

            // Verificamos si la bala fue suficiente para matarlo
            if (zombie.health <= 0) {
                zombie.triggerCritDeath();
                pointsAwarded = 10;
                this.deathSound.play(); 

                this.time.delayedCall(3000, () => {
                    this.enemies.remove(zombie, true, true);
                });
            } else {
                // OPCIONAL Y RECOMENDADO: Feedback visual de que recibió daño pero no murió
                zombie.setTint(0xffaa00); // Se pinta de naranja/rojo un instante
                this.time.delayedCall(100, () => zombie.clearTint());
            }
        }

        if (pointsAwarded > 0) {
            this.addScore(pointsAwarded);
        }
    }

    addScore(points) {
        const uiScene = this.scene.get('UIScene');
        let currentScore = 0;

        if (uiScene && typeof uiScene.addScore === 'function') {
            uiScene.addScore(points);
            currentScore = uiScene.score || 0;
        } else if (uiScene && uiScene.scoreText) {
            uiScene.score = (uiScene.score || 0) + points;
            uiScene.scoreText.setText(`Puntos: ${uiScene.score}`);
            currentScore = uiScene.score;
        }

        while (currentScore >= this.nextBossScore) {
            const spawned = this.spawnBoss();

            if (!spawned) {
                break;
            }

            this.nextBossScore += 100;
        }

        return currentScore;
    }

    spawnBoss() {
        if (!this.textures.exists('minotaur')) {
            return false;
        }

        const boss = new Boss(this, 400, -100, this.player);
        this.enemies.add(boss);

        return true;
    }

    updateSurvivalTime() {
        this.survivalTime--; // Restamos un segundo

        // Actualizamos el reloj en la UI con el tiempo restante
        const uiScene = this.scene.get('UIScene');
        if (uiScene && uiScene.timeText) {
            const minutes = Math.floor(this.survivalTime / 60);
            const seconds = this.survivalTime % 60;
            uiScene.timeText.setText(`Resiste: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }

        // --- ESCALADO DE DIFICULTAD ---
        // Como empezamos en 300, cada vez que el tiempo sea divisible por 30, aumentamos la dificultad
        // Ejemplo: a los 270s (pasaron 30s), a los 240s (pasó 1 min), etc.
        if (this.survivalTime % 30 === 0 && this.survivalTime > 0) {
            this.increaseDifficulty();
        }

        // CONDICIÓN DE VICTORIA: ¡Si el reloj llega a 0, ganaste!
        if (this.survivalTime <= 0) {
            this.winGame(); // Lógica para cuando el jugador sobrevive
        }
    }

    // --- COMPLETAMOS EL MÉTODO DE VICTORIA ---
    winGame() {
        // 1. Detenemos la música del juego si está sonando
        if (this.bgMusic) {
            this.bgMusic.stop();
        }

        // 2. Opcional: Un sonido corto de victoria (si tuvieras)
        // this.sound.play('win_sfx');

        // 3. Detenemos la escena de interfaz
        this.scene.stop('UIScene');

        // 4. Saltamos a la pantalla de Victoria pasando el puntaje final
        this.scene.start('Win', { finalScore: this.score }); 
    }

    increaseDifficulty() {
        // Hacemos que aparezcan más rápido
        if (this.spawnDelay > 300) {
            this.spawnDelay -= 250; 
            if (this.spawnEvent) this.spawnEvent.remove();
            this.startSpawnTimer();
        }

        this.zombieSpeed += 5;

        // Subimos la vida de los zombis cada 60 segundos restantes (múltiplos de 60)
        if (this.survivalTime % 60 === 0) {
            this.zombieHealth += 10; 
        }

        // Si quedan menos de 3 minutos (180s) y es un minuto exacto, sale un jefe
        if (this.survivalTime <= 180 && this.survivalTime % 60 === 0) {
            const minotaur = new Boss(this, 400, -100, this.player); 
            this.enemies.add(minotaur);
        }

        // Debug logs removed for production
    }

    startSpawnTimer() {
        this.spawnEvent = this.time.addEvent({
            delay: this.spawnDelay, 
            callback: this.spawnZombie,
            callbackScope: this,
            loop: true
        });
    }

}

export default Game;