import './index.less'
import {httpGet, httpPost} from './common/request'
import Game from'./ts/Game'
import File from './ts/File'

let game = new Game();
game.setup();

let file = new File();

$("#toggle-sidebar").click(function(){
    $(".page-wrapper").toggleClass("open");	 
});

$("#btn").click(function(){
    game.saveObject();
})

$("#load").click(function(){
    game.loadObject();
})

$("#write").click(function(){
    file.write("您的昵称是 jsz315");
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

$("#rotation").change(function(){
    console.log(this.value);
    game.changeRotation(this.value);
})

window.addEventListener("change_color", function(e){
    game.changeColor(e.detail);
})