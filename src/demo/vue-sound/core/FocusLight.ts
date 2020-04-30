import * as THREE from 'three';
import Tooler from './Tooler';
import { FreeCamera } from './FreeCamera';
import { Scene } from 'three';

export default class FocusLight extends THREE.DirectionalLight{
    lightFar:number = 100;
    aim:THREE.Object3D = new THREE.Object3D();

    constructor(parent:THREE.Object3D, color?: THREE.Color | string | number, intensity?: number){
        super(color, intensity);
        // this.castShadow = true;
        // this.position.set(0, 1, 60);
        parent.add(this.aim);

        // this.castShadow = true;
        // this.shadow.camera.top = 10;
        // this.shadow.camera.bottom = -10;
        // this.shadow.camera.left = -10;
        // this.shadow.camera.right = 10;
        // this.castShadow = true;
    }

    update(camera: FreeCamera){
        this.position.copy(camera.position.clone());
        this.aim.position.copy(camera.orbit.target.clone());
        this.target = this.aim;
    }

    changeFar(camera: FreeCamera, n:number):void{
        // var pot:THREE.Vector3 = camera.position.clone().normalize();
        // var x:number = pot.x * n * 120000;
        // var y:number = pot.y * n * 120000;
        // var z:number = pot.z * n * 120000;
        // this.position.set(x, y, z);
        // this.lookAt(camera.orbit.target.clone());
        this.lightFar = 100 * n;
        // this.distance = this.lightFar;
        console.log("lightFar = " + this.lightFar);

        console.log(camera.orbit.target);
        console.log(camera.position);
        console.log("distance: " + camera.position.distanceTo(camera.orbit.target));
    }
}