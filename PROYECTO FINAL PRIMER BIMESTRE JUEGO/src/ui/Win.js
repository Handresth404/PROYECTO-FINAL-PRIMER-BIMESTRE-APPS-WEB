import Phaser from 'phaser';

class Win extends Phaser.Scene {
    constructor() {
        super({ key: 'Win' });
    }

    // Recibimos la puntuación final desde Game.js
    init(data) {
        this.finalScore = data.finalScore || 0;
    }

    create() {
        // Fondo base oscuro dramático
        this.cameras.main.setBackgroundColor('#000000');

        // --- LA IMAGEN ARTÍSTICA ---
        // Colocamos tu imagen en el centro. Ajusta el scale si no es 800x600
        const bgImage = this.add.image(400, 300, 'victoria_image').setOrigin(0.5);
        bgImage.setScale(1); // Ajusta esto según el tamaño de tu imagen
        bgImage.setAlpha(0.7); // Un poco transparente para leer los textos

        // --- TEXTOS ---
        const textStyle = { 
            fontFamily: 'Arial, sans-serif', 
            fill: '#ffffff',
            align: 'center'
        };

        // Título principal
        this.add.text(400, 80, '¡SOBREVIVISTE!', {
            ...textStyle,
            fontSize: '64px',
            fill: '#00ff00', // Verde brillante
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 150, 'La noche ha terminado...', {
            ...textStyle,
            fontSize: '24px',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Puntuación Final
        this.add.text(400, 220, `Puntuación Total: ${this.finalScore}`, {
            ...textStyle,
            fontSize: '32px'
        }).setOrigin(0.5);

        // --- BOTÓN VOLVER AL MENÚ ---
        const menuButton = this.add.text(400, 520, '◄ VOLVER AL MENÚ ►', {
            ...textStyle,
            fontSize: '28px',
            fill: '#ffff00', // Amarillo
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Eventos de clic
        menuButton.on('pointerdown', () => {
            this.scene.stop('Win');
            this.scene.start('Menu'); // Volvemos al inicio del todo
        });

        // Efecto hover
        menuButton.on('pointerover', () => menuButton.setStyle({ fill: '#ffffff' }));
        menuButton.on('pointerout', () => menuButton.setStyle({ fill: '#ffff00' }));
    }
}

export default Win;