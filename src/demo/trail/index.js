import './index.less'
import App from'./App'
import Stats from 'three/examples/jsm/libs/stats.module';

let app = new App();
app.setup();

initStats();

function initStats(){
    var stats = new Stats();
    stats.setMode(0); 
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
    
    app.setStats(stats);
}

$(".btn").click(()=>{
    app.toggle();
})