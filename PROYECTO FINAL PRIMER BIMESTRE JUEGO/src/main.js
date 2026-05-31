import Phaser from 'phaser';
import Boot from './scenes/Boot';
import Game from './scenes/Game';
import UIScene from './scenes/UIScene';
import GameOver from './scenes/GameOver';
import Menu from './scenes/Menu';
import Win from './scenes/Win';
import Pause from './scenes/Pause';

const config = {
    type: Phaser.AUTO,
    // Movemos el width y height dentro de la configuración de escala
    scale: {
        mode: Phaser.Scale.FIT, // Ajusta el tamaño sin deformar
        autoCenter: Phaser.Scale.CENTER_BOTH, // Lo centra vertical y horizontalmente
        width: 800, // Tamaño base lógico
        height: 600
    },
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, 
            debug: false // Recuerda poner esto en false cuando entregues el proyecto
        }
    },
    scene: [Boot, Menu, Game, UIScene, GameOver, Win, Pause]
};

const game = new Phaser.Game(config);