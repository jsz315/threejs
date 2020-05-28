import * as THREE from 'three';
import Tooler from './Tooler';

export default class FocusLight extends THREE.DirectionalLight{
    far:number = 100;
    constructor(color?: THREE.Color | string | number, intensity?: number){
        super(color, intensity);
        // this.castShadow = true;
        // this.position.set(0, 1, 60);
        console.log("SpotLight");
        console.log(this);

        // this.castShadow = true;
        // this.shadow.camera.top = 10;
        // this.shadow.camera.bottom = -10;
        // this.shadow.camera.left = -10;
        // this.shadow.camera.right = 10;
        // this.castShadow = true;
    }

    update(camera: THREE.Camera){
        this.position.copy(camera.position);
        this.rotation.copy(camera.rotation);
        this.position.copy(Tooler.farAway(this.position, this.far));
    }
}