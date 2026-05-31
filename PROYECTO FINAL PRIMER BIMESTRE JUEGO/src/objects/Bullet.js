import Phaser from 'phaser';

class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
    }

    fire(x, y, targetX, targetY) {
        this.body.enable = true;
        this.body.reset(x, y); // Aparece donde está el jugador
        this.setActive(true);
        this.setVisible(true);

        // Calculamos el ángulo hacia donde hiciste clic
        const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);
        this.setRotation(angle);

        // Le damos velocidad en esa dirección
        const speed = 400;
        this.scene.physics.velocityFromRotation(angle, speed, this.body.velocity);
    }

    // preUpdate se ejecuta en cada frame automáticamente
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Si la bala sale de los límites de la pantalla (800x600), la desactivamos para reciclarla
        if (this.y <= 0 || this.y >= 600 || this.x <= 0 || this.x >= 800) {
            this.disableBody(true, true);
        }
    }
}

export default Bullet;