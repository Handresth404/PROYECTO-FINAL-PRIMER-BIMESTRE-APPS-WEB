import Phaser from 'phaser';

class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // Textos del HUD
        this.healthText = this.add.text(20, 20, 'Salud: 100', { 
            fontSize: '24px', 
            fill: '#ff0000',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        });

        this.highScore = Number(localStorage.getItem('survivors_high_score') || '0');
        this.highScoreText = this.add.text(20, 50, `High score: ${this.highScore}`, { 
            fontSize: '24px', 
            fill: '#ffd54a',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        });

        // Inicializamos el puntaje
        this.score = 0;
        this.scoreText = this.add.text(20, 80, 'Puntos: 0', { 
            fontSize: '24px', 
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif'
        });

        // Obtenemos la escena principal (Game) para escuchar sus eventos
        const gameScene = this.scene.get('Game');

        // Escuchamos el evento 'updateHealth' que crearemos en breve
        gameScene.events.on('updateHealth', (currentHealth) => {
            this.healthText.setText(`Salud: ${currentHealth}`);
        });

        // Escucha para sumar puntos (opcional desde otra escena)
        this.events.on('addScore', (points) => {
            this.addScore(points);
        });

        // 1. Creamos nuestra propia variable local para llevar el control absoluto
        let isMuted = this.sound.mute;
        const initialIcon = isMuted ? '🔇' : '🔊';
        
        // Creamos el botón
        this.muteButton = this.add.text(750, 30, initialIcon, { 
            fontSize: '32px' 
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });


        // --- TEXTO DEL RELOJ EN REVERSA ---
        this.timeText = this.add.text(400, 30, 'Resiste: 5:00', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 2. Lógica al hacer clic
        this.muteButton.on('pointerdown', () => {
            // Invertimos nuestra variable primero (si era false, pasa a true)
            isMuted = !isMuted; 
            
            // Le inyectamos este valor exacto a Phaser para que obedezca
            this.sound.mute = isMuted;
            
            // Actualizamos el icono basándonos en NUESTRA variable, no en la de Phaser
            if (isMuted) {
                this.muteButton.setText('🔇');
                this.muteButton.setAlpha(0.5);
            } else {
                this.muteButton.setText('🔊');
                this.muteButton.setAlpha(1);
            }
        });
        
    }

    addScore(points) {
        this.score += points;
        this.scoreText.setText(`Puntos: ${this.score}`);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('survivors_high_score', String(this.highScore));
            this.highScoreText.setText(`High score: ${this.highScore}`);
        }
    }
}

export default UIScene;