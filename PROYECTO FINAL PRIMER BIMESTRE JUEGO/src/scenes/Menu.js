import Phaser from 'phaser';

class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    create() {
        const bg = this.add.image(0, 0, 'menu_bg').setOrigin(0, 0);
        bg.setDisplaySize(800, 600);


        // --- REPRODUCIR MÚSICA ---
        // Añadimos la música y la guardamos en una variable de la escena (this.bgMusic)
        this.bgMusic = this.sound.add('menu_music', { 
            volume: 0.5,  // Volumen al 50% para que no aturda
            loop: true    // Que se repita infinitamente
        });
        
        this.bgMusic.play();

        // Fondo oscuro para mantener la temática de terror/supervivencia
        this.cameras.main.setBackgroundColor('#111111');

        // Título del juego
        this.add.text(400, 150, 'SURVIVORS', {
            fontSize: '64px',
            fill: '#ff0000', // Título en rojo sangre
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 220, 'La Noche de los Zombis', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Instrucciones de controles (Requisito 4.9: Controles documentados)
        const instrucciones = 
            "CONTROLES:\n" +
            "Flechas Direccionales: Moverse\n" +
            "Clic Derecho: Curarse\n" +
            "Clic Izquierdo: Disparar hacia el puntero";
            
        this.add.text(400, 350, instrucciones, {
            fontSize: '18px',
            fill: '#aaaaaa',
            fontFamily: 'Arial, sans-serif',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        // Botón para Iniciar
        const startButton = this.add.text(400, 480, '► INICIAR PARTIDA ◄', {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Efectos del botón al pasar el ratón
        startButton.on('pointerover', () => startButton.setStyle({ fill: '#ffffff' }));
        startButton.on('pointerout', () => startButton.setStyle({ fill: '#00ff00' }));

        // Evento al hacer clic: Pasamos a la escena del juego
        startButton.on('pointerdown', () => {
            this.bgMusic.stop();
            this.scene.start('Game');
        });

        // Opcional: Empezar también si se presiona la barra espaciadora
        this.input.keyboard.once('keydown-SPACE', () => {
            this.bgMusic.stop();
            this.scene.start('Game');
        });
        

    }
}

export default Menu;