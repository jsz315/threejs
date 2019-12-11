import * as THREE from 'three';
import Tooler from './Tooler';

export default class FocusLight extends THREE.SpotLight{
    far:number = 100;
    helper:THREE.SpotLightHelper;

    constructor(color?: THREE.Color | string | number, intensity?: number){
        super(color, intensity);
        // this.castShadow = true;
        // this.position.set(0, 1, 60);
        // this.helper = new THREE.SpotLightHelper(this);
        // this.power = 100;
        console.log("=====================", this);
    }

    update(camera: THREE.Camera){
        this.rotation.copy(camera.rotation);
        // this.position.copy(camera.position);
        this.position.set(camera.position.x * 100, camera.position.y * 100, camera.position.z * 100);

        /*
        let pot = camera.position.clone();
        // var pot = new THREE.Vector3(0, 0, 0);
        var mat1 = new THREE.Matrix4().makeTranslation(pot.x, pot.y, pot.z);
        var mat2 = new THREE.Matrix4().makeTranslation(0, 0, 40);
        // this.position.copy(p);
        this.applyMatrix(mat1.multiply(mat2));
        // this.position.copy(Tooler.farAway(this.position, this.far));
        */

        // this.helper.update();
    }
}