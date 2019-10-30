import * as BABYLON from 'babylonjs'

export default class Fire{
    
    light:BABYLON.PointLight;
    num:number = 0;

    constructor(scene:BABYLON.Scene){
        this.light = new BABYLON.PointLight("light", BABYLON.Vector3.Zero(), scene);
    }

    update(){
        this.num += 0.03;
        let n = Math.sin(this.num);
        if(n > 0.5){
            n = 0.5;
        }
        this.light.intensity = n;
    }
}