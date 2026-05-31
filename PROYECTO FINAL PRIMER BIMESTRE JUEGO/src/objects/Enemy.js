import Phaser from 'phaser';

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, targetPlayer) {
        super(scene, x, y, 'zombie');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.target = targetPlayer;
        this.speed = 50; 
        this.isDead = false; // Control de estado para saber si el zombi murió

        this.isDead = false;
        this.isAttacking = false; // Nueva variable de estado
        this.lastDirection = 'down'; // Para recordar la dirección

        this.body.setSize(40, 80); 
        this.body.setOffset(44, 40);

        this.createAnimations(scene);
        this.play('zombie_walk_down', true); // Animación inicial
    }

    createAnimations(scene) {
        const animConfig = [
            { dir: 'left', row: 0 },
            { dir: 'up_left', row: 1 },
            { dir: 'up', row: 2 },
            { dir: 'up_right', row: 3 },
            { dir: 'right', row: 4 },
            { dir: 'down_right', row: 5 },
            { dir: 'down', row: 6 },
            { dir: 'down_left', row: 7 }
        ];

        const walkCols = { start: 4, end: 11 }; // Tu ajuste
        const attackCols = { start: 12, end: 22 }; // Columnas de ataque que me indicaste
        const critDeathCols = { start: 28, end: 35 };

        animConfig.forEach(config => {
            const startFrame = config.row * 36;

            // Animación de Caminar
            if (!scene.anims.exists(`zombie_walk_${config.dir}`)) {
                scene.anims.create({
                    key: `zombie_walk_${config.dir}`,
                    frames: scene.anims.generateFrameNumbers('zombie', { 
                        start: startFrame + walkCols.start, 
                        end: startFrame + walkCols.end 
                    }),
                    frameRate: 6,
                    repeat: -1
                });
            }

            // Animación de Ataque
            if (!scene.anims.exists(`zombie_attack_${config.dir}`)) {
                scene.anims.create({
                    key: `zombie_attack_${config.dir}`,
                    frames: scene.anims.generateFrameNumbers('zombie', { 
                        start: startFrame + attackCols.start, 
                        end: startFrame + attackCols.end 
                    }),
                    frameRate: 10, // Un poco más rápido para el ataque
                    repeat: 0 // No queremos que se quede atacando eternamente si te alejas
                });
            }

            // Animación de Muerte Crítica
            if (!scene.anims.exists(`zombie_crit_death_${config.dir}`)) {
                scene.anims.create({
                    key: `zombie_crit_death_${config.dir}`,
                    frames: scene.anims.generateFrameNumbers('zombie', { 
                        start: startFrame + critDeathCols.start, 
                        end: startFrame + critDeathCols.end 
                    }),
                    frameRate: 8,
                    repeat: 0
                });
            }
        });
    }

    update() {
        // Si está muerto O está atacando, no calculamos movimiento
        if (this.isDead || this.isAttacking || !this.target) return; 

        this.scene.physics.moveToObject(this, this.target, this.speed);
        this.updateAnimationDirection();
    }

    updateAnimationDirection() {
        // Obtenemos la velocidad actual (hacia dónde se mueve)
        const vx = this.body.velocity.x;
        const vy = this.body.velocity.y;
        
        let direction = '';

        // Determinamos la dirección basada en la velocidad (8 direcciones)
        if (vx < -10 && vy < -10) direction = 'up_left';
        else if (vx > 10 && vy < -10) direction = 'up_right';
        else if (vx < -10 && vy > 10) direction = 'down_left';
        else if (vx > 10 && vy > 10) direction = 'down_right';
        else if (vx < -10) direction = 'left';
        else if (vx > 10) direction = 'right';
        else if (vy < -10) direction = 'up';
        else if (vy > 10) direction = 'down';

        // Si determinamos una dirección válida, reproducimos la animación correspondiente
        if (direction !== '') {
            this.play(`zombie_walk_${direction}`, true);
            // Guardamos la última dirección en la que miró para usarla si muere
            this.lastDirection = direction; 
        }
    }

    triggerCritDeath() {
        if (this.isDead) return;

        this.isDead = true;
        this.setVelocity(0, 0); // Detenemos su movimiento
        this.body.enable = false; // Desactivamos colisiones

        // Reproducimos la muerte crítica en la dirección en la que estaba mirando
        const dir = this.lastDirection || 'down'; 
        this.play(`zombie_crit_death_${dir}`);

        // Opcional: Hacer que desaparezca después de un tiempo
        this.scene.time.delayedCall(3000, () => {
            this.destroy(); 
        });
    }

getFaceDirection() {
        if (!this.target) return this.lastDirection;

        // Calculamos el ángulo en radianes entre el zombi y el jugador
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        
        // Convertimos a grados para que sea más fácil calcular los 8 cortes
        const deg = Phaser.Math.RadToDeg(angle);

        if (deg >= -22.5 && deg < 22.5) return 'right';
        if (deg >= 22.5 && deg < 67.5) return 'down_right';
        if (deg >= 67.5 && deg < 112.5) return 'down';
        if (deg >= 112.5 && deg < 157.5) return 'down_left';
        if (deg >= 157.5 || deg < -157.5) return 'left';
        if (deg >= -157.5 && deg < -112.5) return 'up_left';
        if (deg >= -112.5 && deg < -67.5) return 'up';
        if (deg >= -67.5 && deg < -22.5) return 'up_right';

        return 'down'; // fallback por seguridad
    }


    attack() {
        if (this.isDead || this.isAttacking) return;

        this.isAttacking = true;
        this.setVelocity(0, 0); 

        // ¡Aquí está la magia! Calculamos la dirección hacia el jugador en este instante
        const dir = this.getFaceDirection();
        this.lastDirection = dir; // Actualizamos la memoria del zombi

        // Reproducimos la animación en la dirección correcta
        this.play(`zombie_attack_${dir}`);

        this.once('animationcomplete', (anim) => {
            if (anim.key === `zombie_attack_${dir}`) {
                this.isAttacking = false;
            }
        });
    }
}

export default Enemy;