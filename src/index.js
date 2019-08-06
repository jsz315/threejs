import './index.less'
import {httpGet, httpPost} from './common/request'
import Game from'./ts/Game'

// httpPost('/api/info').then(res=>{
//     console.log(res);
// })

// document.querySelector(".dpr").innerHTML = "devicePixelRatio: " + window.devicePixelRatio;

let game = new Game();
game.setup();

// function Anima(){
//     this.run = function(){
//         console.log("anima run");
//     }
// }
// Anima.prototype.say = function(){
//     console.log("anima say");
// }

// Anima.prototype.leg = 4;

// Anima.prototype = {
//     eye: 2
// }
// var a = new Anima();
// console.log(a.leg);
// Anima.prototype.leg = 8;