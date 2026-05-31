import Phaser from 'phaser';

class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, targetPlayer) {
        super(scene, x, y, 'minotaur');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.target = targetPlayer;
        this.speed = 70; // Un poco más rápido que un zombi normal
        this.health = 50; // ¡Necesitará 5 balas (de 10 daño c/u) para morir!
        this.isDead = false;
        this.isAttacking = false;
        this.lastDirection = 'down';

        // Ajusta la caja de colisión si el minotauro es muy grande
        this.body.setSize(60, 100); 
        this.body.setOffset(34, 28);

        if (!scene.textures.exists('minotaur')) {
            this.setFrame(0);
            return;
        }

        this.createAnimations(scene);

        if (scene.anims.exists('boss_chase_down')) {
            this.play('boss_chase_down', true);
        } else {
            this.setFrame(0);
        }
    }

    createAnimations(scene) {
        if (!scene.textures.exists('minotaur')) {
            return;
        }

        const animConfig = [
            { dir: 'left', row: 0 }, { dir: 'up_left', row: 1 }, { dir: 'up', row: 2 },
            { dir: 'up_right', row: 3 }, { dir: 'right', row: 4 }, { dir: 'down_right', row: 5 },
            { dir: 'down', row: 6 }, { dir: 'down_left', row: 7 }
        ];

        // Columnas indicadas por ti, convertidas a índices base 0
        const chaseCols = { start: 4, end: 11 };
        const attackCols = { start: 12, end: 17 };
        const deathCols = { start: 18, end: 23 };
        const framesPerRow = 24;

        animConfig.forEach(config => {
            const startFrame = config.row * framesPerRow;

            if (!scene.anims.exists(`boss_chase_${config.dir}`)) {
                scene.anims.create({
                    key: `boss_chase_${config.dir}`,
                    frames: scene.anims.generateFrameNumbers('minotaur', {
                        start: startFrame + chaseCols.start,
                        end: startFrame + chaseCols.end
                    }),
                    frameRate: 8,
                    repeat: -1
                });
            }

            if (!scene.anims.exists(`boss_attack_${config.dir}`)) {
                scene.anims.create({
                    key: `boss_attack_${config.dir}`,
                    frames: scene.anims.generateFrameNumbers('minotaur', {
                        start: startFrame + attackCols.start,
                        end: startFrame + attackCols.end
                    }),
                    frameRate: 10,
                    repeat: 0
                });
            }

            if (!scene.anims.exists(`boss_death_${config.dir}`)) {
                scene.anims.create({
                    key: `boss_death_${config.dir}`,
                    frames: scene.anims.generateFrameNumbers('minotaur', {
                        start: startFrame + deathCols.start,
                        end: startFrame + deathCols.end
                    }),
                    frameRate: 6,
                    repeat: 0
                });
            }
        });
    }

    update() {
        if (this.isDead || this.isAttacking || !this.target) return;

        this.scene.physics.moveToObject(this, this.target, this.speed);
        
        const dir = this.getFaceDirection();
        this.lastDirection = dir;

        if (this.scene.anims.exists(`boss_chase_${dir}`)) {
            this.play(`boss_chase_${dir}`, true);
        }
    }

    getFaceDirection() {
        if (!this.target) return this.lastDirection;
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        const deg = Phaser.Math.RadToDeg(angle);

        if (deg >= -22.5 && deg < 22.5) return 'right';
        if (deg >= 22.5 && deg < 67.5) return 'down_right';
        if (deg >= 67.5 && deg < 112.5) return 'down';
        if (deg >= 112.5 && deg < 157.5) return 'down_left';
        if (deg >= 157.5 || deg < -157.5) return 'left';
        if (deg >= -157.5 && deg < -112.5) return 'up_left';
        if (deg >= -112.5 && deg < -67.5) return 'up';
        if (deg >= -67.5 && deg < -22.5) return 'up_right';
        return 'down';
    }

    attack() {
        if (this.isDead || this.isAttacking) return;
        this.isAttacking = true;
        this.setVelocity(0, 0); 
        const dir = this.getFaceDirection();
        if (!this.scene.anims.exists(`boss_attack_${dir}`)) {
            this.isAttacking = false;
            return;
        }

        this.play(`boss_attack_${dir}`);

        this.once('animationcomplete', (anim) => {
            if (anim.key === `boss_attack_${dir}`) {
                this.isAttacking = false;
            }
        });
    }

    takeDamage(amount) {
        if (this.isDead) return;
        this.health -= amount;

        // Efecto visual al recibir daño
        this.setTint(0xff0000);
        this.scene.time.delayedCall(150, () => this.clearTint());

        if (this.health <= 0) {
            this.isDead = true;
            this.setVelocity(0, 0);
            this.body.enable = false;

            if (this.scene.anims.exists(`boss_death_${this.lastDirection}`)) {
                this.play(`boss_death_${this.lastDirection}`);
            }
            
            this.scene.time.delayedCall(3000, () => this.destroy());
        }
    }
}

export default Boss;