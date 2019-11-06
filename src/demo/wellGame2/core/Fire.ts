import * as THREE from "three";
export default class Fire{
    
    light:THREE.DirectionalLight;
    num:number = 0;
    speed:number = 0.01;

    constructor(){
        var light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( 4, 20, -4 );
        light.castShadow = true;
        var d = 40;
        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;

        light.shadow.camera.near = 2;
        light.shadow.camera.far = 50;

        light.shadow.mapSize.x = 1024;
        light.shadow.mapSize.y = 1024;
        this.light = light;
    }

    update(){
        // this.num += this.speed;
        // let n = Math.abs(Math.sin(this.num));
        // if(n < 0.2){
        //     this.speed = 0.001;
        // }
        // else{
        //     this.speed = 0.01;
        // }
        // this.light.intensity = n;
    }
}