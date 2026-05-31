import Phaser from 'phaser';

class Pause extends Phaser.Scene {
    constructor() {
        super({ key: 'Pause' });
    }

    create() {
        // --- FONDO SEMITRANSPARENTE ---
        // Dibujamos un rectángulo negro que cubre toda la pantalla (800x600) con 70% de opacidad (0.7)
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        const textStyle = { 
            fontFamily: 'Arial, sans-serif', 
            fill: '#ffffff',
            align: 'center'
        };

        // --- TÍTULO ---
        this.add.text(400, 200, 'JUEGO EN PAUSA', { 
            ...textStyle, 
            fontSize: '48px', 
            fontStyle: 'bold' 
        }).setOrigin(0.5);

        // --- BOTÓN REANUDAR ---
        const resumeBtn = this.add.text(400, 320, '► REANUDAR', { 
            ...textStyle, 
            fontSize: '32px', 
            fill: '#00ff00' 
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        resumeBtn.on('pointerover', () => resumeBtn.setStyle({ fill: '#ffffff' }));
        resumeBtn.on('pointerout', () => resumeBtn.setStyle({ fill: '#00ff00' }));

        resumeBtn.on('pointerdown', () => this.resumeGame());

        // --- BOTÓN SALIR AL MENÚ ---
        const exitBtn = this.add.text(400, 400, '◄ SALIR AL MENÚ', { 
            ...textStyle, 
            fontSize: '32px', 
            fill: '#ff0000' 
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        exitBtn.on('pointerover', () => exitBtn.setStyle({ fill: '#ffffff' }));
        exitBtn.on('pointerout', () => exitBtn.setStyle({ fill: '#ff0000' }));

        exitBtn.on('pointerdown', () => {
            // Detenemos toda la música globalmente
            this.sound.stopAll(); 
            // Apagamos las escenas de juego
            this.scene.stop('Game');
            this.scene.stop('UIScene');
            // Cerramos la pausa y vamos al menú principal
            this.scene.stop();
            this.scene.start('Menu');
        });

        // --- TECLA ESC PARA REANUDAR ---
        this.input.keyboard.on('keydown-ESC', () => this.resumeGame());
    }

    resumeGame() {
        // Recuperamos la escena del juego para reanudar su música
        const gameScene = this.scene.get('Game');
        if (gameScene.bgMusic) {
            gameScene.bgMusic.resume();
        }

        // Limpiamos la bandera de pausa si existe
        if (gameScene) {
            gameScene._paused = false;
        }

        this.scene.stop(); // Cerramos la escena de pausa
        this.scene.resume('Game'); // Descongelamos el juego
        this.scene.resume('UIScene'); // Descongelamos la UI
    }
}

export default Pause;