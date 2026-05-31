import Phaser from 'phaser';

class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        //  Loader de assets: Cargamos el spritesheet del jugador.
        // Reemplaza frameWidth y frameHeight con las medidas reales de un solo cuadro.
        this.load.spritesheet('player', '/assets/player_spritesheet.png', {
            frameWidth: 64, // Reemplaza esto
            frameHeight: 64 // Reemplaza esto
        });

        this.load.spritesheet('zombie', '/assets/zombie_0.png', {frameWidth: 128,frameHeight: 128});
        this.load.image('gameover_image', '/assets/gameover_image.png');
        this.load.image('background', '/assets/escenario.png');
        this.load.image('escenario2', '/assets/escenario2.png');
        this.load.image('escenario3', '/assets/escenario3.png');
        this.load.image('escenario4', '/assets/escenario4.png');
        this.load.spritesheet('heal_effect', '/assets/heal.png', {frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('minotaur', '/assets/minotaur_alpha.png', {
            frameWidth: 128, // Reemplaza por la medida real
            frameHeight: 128 // Reemplaza por la medida real
        });
        this.load.audio('menu_music', '/assets/musicaMenu.mp3');
        this.load.audio('game_music', '/assets/musicaJuego.mp3');
        this.load.audio('fire_sound', '/assets/fire.mp3');
        this.load.audio('death_sound', '/assets/muerte.mp3');
        this.load.audio('boss_death_sound', '/assets/muerteBoss.mp3');
        this.load.image("victoria_image", "/assets/victoria.png");
        this.load.image("menu_bg", "/assets/pantallaInicial.png");
    }

    create() {
        // Dibujamos un pequeño círculo amarillo brillante para usar como bala
        const graphics = this.make.graphics();
        graphics.fillStyle(0xffff00); // Color amarillo
        graphics.fillCircle(4, 4, 4); // Radio de 4 píxeles
        graphics.generateTexture('bullet', 8, 8); // Guardamos la textura con la clave 'bullet'
        graphics.destroy(); // Limpiamos el gráfico temporal de la memoria

        // Una vez cargado todo, iniciamos el juego
        this.scene.start('Menu');
    }
}

export default Boot;