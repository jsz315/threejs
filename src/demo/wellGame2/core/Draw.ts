import * as THREE from 'three';

export default class Draw extends THREE.Object3D{

    constructor(){
        super();
        this.init();
    }

    init(){
        var geometry = new THREE.Geometry();
        
        geometry.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 10, 0),
            new THREE.Vector3(20, 10, 0),
            new THREE.Vector3(30, 0, 0)
        )
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(0, 2, 3));

        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();

        let mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());

        this.add(mesh);
    }

}