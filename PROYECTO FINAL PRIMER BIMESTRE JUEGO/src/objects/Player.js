import Phaser from 'phaser';

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        
        // --- NUEVAS VARIABLES DE SALUD ---
        this.health = 100;
        this.isInvulnerable = false; 

        this.createAnimations(scene);
    }

    createAnimations(scene) {
        // Animación: Caminar hacia abajo (Fila 1: frames 0 al 5)
        scene.anims.create({
            key: 'walk_down',
            frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1 // El -1 hace que la animación se repita en bucle infinito
        });

        // Animación: Caminar hacia arriba (Fila 2: frames 6 al 11)
        scene.anims.create({
            key: 'walk_up',
            frames: scene.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        // Animación: Caminar hacia la derecha (Fila 3: frames 12 al 17)
        scene.anims.create({
            key: 'walk_right',
            frames: scene.anims.generateFrameNumbers('player', { start: 12, end: 16 }),
            frameRate: 10,
            repeat: -1
        });

        // Animación: Caminar hacia la izquierda (Fila 4: frames 18 al 23)
        scene.anims.create({
            key: 'walk_left',
            frames: scene.anims.generateFrameNumbers('player', { start: 18, end: 22 }),
            frameRate: 10,
            repeat: -1
        });

        // Animación del efecto de curación (frames 0 al 5)
        if (!scene.anims.exists('heal_anim')) {
            scene.anims.create({
                key: 'heal_anim',
                frames: scene.anims.generateFrameNumbers('heal_effect', { start: 0, end: 5 }),
                frameRate: 12,
                repeat: 0 // Solo se reproduce una vez y se detiene
            });
        }
    }

    update(cursors) {
        //  Mecánica de Movimiento.
        const speed = 200;
        let isMoving = false;

        this.setVelocity(0); // Reiniciamos velocidad para evitar que siga de largo

        if (cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.play('walk_left', true); // Reemplaza con tu clave de animación real
            isMoving = true;
        } else if (cursors.right.isDown) {
            this.setVelocityX(speed);
            this.play('walk_right', true); // Reemplaza con tu clave de animación real
            isMoving = true;
        }

        if (cursors.up.isDown) {
            this.setVelocityY(-speed);
            // Si también se mueve en diagonal, podrías priorizar una animación aquí
            if (!cursors.left.isDown && !cursors.right.isDown) {
                this.play('walk_up', true); // Reemplaza con tu clave de animación real
                isMoving = true;
            }
        } else if (cursors.down.isDown) {
            this.setVelocityY(speed);
            if (!cursors.left.isDown && !cursors.right.isDown) {
                this.play('walk_down', true); // Reemplaza con tu clave de animación real
                isMoving = true;
            }
        }

        // Si no se está moviendo, detenemos la animación y mostramos el frame de 'idle'
        if (!isMoving) {
            this.stop();
        }
    }

    takeDamage(amount) {
        // Si ya está invulnerable o muerto, ignoramos el daño
        if (this.isInvulnerable || this.health <= 0) return;

        this.health -= amount;
        this.isInvulnerable = true;

        // Emitimos un evento a la escena para que el HUD se actualice
        this.scene.events.emit('updateHealth', this.health);

        // Efecto visual: Pintamos al jugador de rojo por medio segundo
        this.setTint(0xff0000);
        
        this.scene.time.delayedCall(500, () => {
            this.clearTint();
            this.isInvulnerable = false; // Vuelve a ser vulnerable
        });

        if (this.health <= 0) {
            const uiScene = this.scene.scene.get('UIScene');
            const finalScore = uiScene && typeof uiScene.score === 'number' ? uiScene.score : 0;

            this.scene.scene.start('GameOver', {
                score: finalScore
            }); 
        }
    }

    useHeal() {
        // Si está muerto o ya tiene la vida al máximo, no gastamos la curación
        if (this.health <= 0 || this.health >= 100) return;

        // Curamos 20 puntos de vida (puedes ajustar esto)
        this.health += 20;
        
        // Nos aseguramos de que no pase de 100
        if (this.health > 100) this.health = 100;

        // Actualizamos el HUD
        this.scene.events.emit('updateHealth', this.health);

        // --- EFECTO VISUAL ---
        // Creamos un sprite temporal encima del jugador
        const healSprite = this.scene.add.sprite(this.x, this.y, 'heal_effect');
        healSprite.play('heal_anim');

        // Hacemos que el efecto desaparezca cuando termine su animación
        healSprite.on('animationcomplete', () => {
            healSprite.destroy();
        });
    }
}

export default Player;