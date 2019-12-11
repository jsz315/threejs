import * as THREE from 'three';
import Tooler from './Tooler';

export default class FocusLight extends THREE.DirectionalLight{
    far:number = 100;
    helper:THREE.SpotLightHelper;

    constructor(color?: THREE.Color | string | number, intensity?: number){
        super(color, intensity);
        this.castShadow = true;
        this.position.set(10, 30, 8);
        // this.helper = new THREE.SpotLightHelper(this);

        this.shadow.camera.near = 0; //产生阴影的最近距离
        this.shadow.camera.far = 200; //产生阴影的最远距离
        this.shadow.camera.left = -200; //产生阴影距离位置的最左边位置
        this.shadow.camera.right = 200; //最右边
        this.shadow.camera.top = 200; //最上边
        this.shadow.camera.bottom = -200; //最下面
    }

    update(camera: THREE.Camera){
        // this.rotation.copy(camera.rotation);
        // this.position.copy(camera.position);

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