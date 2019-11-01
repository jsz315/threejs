import * as BABYLON from 'babylonjs'

export default class Fire{
    
    light:BABYLON.DirectionalLight;
    num:number = 0;
    speed:number = 0.02;

    constructor(scene:BABYLON.Scene){
        // this.light = new BABYLON.PointLight("light", BABYLON.Vector3.Zero(), scene);
        // this.light = new BABYLON.SpotLight("light", new BABYLON.Vector3(0, 10, 0), new BABYLON.Vector3(0, 0, 0), 120, 2, scene);
        this.light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, 0, 0), scene);
        
        this.light.position.set(2, 9, 0);
        this.light.setDirectionToTarget(BABYLON.Vector3.Zero());
        this.light.shadowEnabled = true;
        // this.light.shadowMaxZ = 100;
    }

    update(){
        // this.num += this.speed;
        // let n = Math.sin(this.num);
        // if(n < 0){
        //     this.speed = 0.04;
        // }
        // else{
        //     this.speed = 0.02;
        // }
        // this.light.intensity = n;
    }
}