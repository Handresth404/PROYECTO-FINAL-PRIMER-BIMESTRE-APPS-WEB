import Phaser from 'phaser';

class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        this.scene.stop('UIScene');

        const storedHighScore = Number(localStorage.getItem('survivors_high_score') || '0');
        this.highScore = Math.max(storedHighScore, this.finalScore);
        localStorage.setItem('survivors_high_score', String(this.highScore));

        const { width, height } = this.scale;

        this.add.image(width / 2, height / 2, 'gameover_image')
            .setOrigin(0.5)
            .setDisplaySize(width, height);

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45);

        this.add.text(width / 2, 80, 'GAME OVER', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '56px',
            fontStyle: 'bold',
            color: '#ff3b30',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(width / 2, 150, 'Te devoraron...', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(width / 2, 235, `Puntaje: ${this.finalScore}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(width / 2, 280, `High score: ${this.highScore}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            color: '#ffd54a',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        const retryButton = this.add.rectangle(width / 2, 380, 220, 60, 0x2ecc71, 0.95)
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true });

        this.add.text(width / 2, 380, 'Reintentar', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '26px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        retryButton.on('pointerover', () => {
            retryButton.setFillStyle(0x36d97a, 1);
        });

        retryButton.on('pointerout', () => {
            retryButton.setFillStyle(0x2ecc71, 0.95);
        });

        retryButton.on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start('Game');
            this.scene.launch('UIScene');
        });

        // --- BOTÓN: SALIR AL MENÚ ---
        const exitButton = this.add.rectangle(width / 2, 460, 260, 60, 0xe74c3c, 0.95)
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true });

        this.add.text(width / 2, 460, 'SALIR AL MENÚ', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '26px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        exitButton.on('pointerover', () => exitButton.setFillStyle(0xff5b4a, 1));
        exitButton.on('pointerout', () => exitButton.setFillStyle(0xe74c3c, 0.95));

        exitButton.on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.stop('Game');
            this.scene.stop('UIScene');
            this.scene.start('Menu');
        });
    }
}

export default GameOver;