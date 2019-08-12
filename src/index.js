import './index.less'
import {httpGet, httpPost} from './common/request'
import Game from'./ts/Game'

let game = new Game();
game.setup();


$("#toggle-sidebar").click(function(){
    $(".page-wrapper").toggleClass("open");	 
});

$("#btn").click(function(){
    game.saveObject();
})

document.querySelector("#Background").addEventListener("change", onChangeColor);
document.querySelector("#AmbientLight").addEventListener("change", onChangeColor);
document.querySelector("#DirectionalLight").addEventListener("change", onChangeColor);

function onChangeColor(e){
    window.dispatchEvent(new CustomEvent("change_color", {
        detail: {
            name: e.target.getAttribute("id"),
            data: e.target.value
        }
    }))
}

window.addEventListener("change_color", function(e){
    game.changeColor(e.detail);
})