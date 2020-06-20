import * as THREE from 'three'
import Tooler from './Tooler';

export class Stage extends THREE.Object3D{

    frame:THREE.Mesh;
    door:THREE.Mesh;
    angle:number = 0;
    timer:number = 0;

    constructor(){
        super();
        this.init();
    }

    init(){
        this.frame = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 0.2), new THREE.MeshNormalMaterial());
        this.add(this.frame);

        this.door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.6, 0.5), new THREE.MeshNormalMaterial());
        this.add(this.door);

        this.play();
    }

    play(){
        // Tooler.rotateOnAxis(this.door, new THREE.Vector3(-0.9, 0, 0), new THREE.Vector3(0, 1, 0), 45);
    }

    update(){
        this.timer += 0.02;
        // this.angle = Math.sin(this.timer) * 90;
        this.angle = 1;
        // Tooler.rotateOnAxis(this.door, new THREE.Vector3(-0.9, 0, 0), new THREE.Vector3(0, 1, 0), this.angle);

        Tooler.rotateOnAxis(this.door, new THREE.Vector3(0, 1.8, 0), new THREE.Vector3(1, 0, 0), this.angle);
    }

}