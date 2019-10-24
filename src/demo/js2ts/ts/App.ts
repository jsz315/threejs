import Stats from 'three/examples/jsm/libs/stats.module';

export default class App{
    stats: any;
    constructor(){
        console.log(customName + " is " + customAge);
        eat("apple");
        $("p").html("jsz");
        this.stats = new Stats();
        this.stats.setMode(0); 
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = 'auto';
        this.stats.domElement.style.right = '0px';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);
        console.log(this.stats.REVISION);
        setInterval(() => {
            this.stats.update();
        }, 90)
    }
    
}