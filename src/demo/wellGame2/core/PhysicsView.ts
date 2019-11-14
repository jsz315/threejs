import * as THREE from "three";
import * as CANNON from 'cannon';

export default class PhysicsView{

    mesh:THREE.Object3D;
    body:any;
    world:any;
    type:string;

    constructor(mesh:THREE.Mesh, type:string, world:any, isStatic?:boolean, scene?:THREE.Object3D){
        this.mesh = mesh;
        this.world = world;
        this.type = type;
        let box = new THREE.Box3().setFromObject(mesh);
        let size = box.getSize(new THREE.Vector3());

        let shape;
        if(type == "box"){
            shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
        }
        else if(type == "sphere"){
            shape = new CANNON.Sphere(size.x / 2);
        }
        else if(type == "cylinder"){
            this.mesh = new THREE.Object3D();
            this.mesh.position.copy(mesh.position);
            this.mesh.quaternion.copy( mesh.quaternion );

            this.mesh.add(mesh);
            scene.add(this.mesh);
            mesh.position.set(0, 0, 0);
            mesh.rotation.set(Math.PI / 2, 0, 0);
            mesh.scale.set(1, 1, 1);

            shape = new CANNON.Cylinder(size.x / 2, size.x / 2, size.y, 8);
        }
        
        this.body = new CANNON.Body({ 
            mass: isStatic ? 0 : 10 * size.x * size.y * size.z, 
            material: new CANNON.Material({ friction: 0.3, restitution: 0.7}) ,
            position: new CANNON.Vec3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z),
            shape: shape
        });

        this.world.add(this.body);
    }

    getMeshFromShape(body:any, mat:any){
        let shape:any = body.shape[0];
        var geo = new THREE.Geometry();

        // Add vertices
        for (var i = 0; i < shape.vertices.length; i++) {
            var v = shape.vertices[i];
            geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
        }

        for(var i=0; i < shape.faces.length; i++){
            var face = shape.faces[i];

            // add triangles
            var a = face[0];
            for (var j = 1; j < face.length - 1; j++) {
                var b = face[j];
                var c = face[j + 1];
                geo.faces.push(new THREE.Face3(a, b, c));
            }
        }
        geo.computeBoundingSphere();
        geo.computeFaceNormals();
        return new THREE.Mesh( geo, mat );
    }

    updateBodyTrs(){
        // this.body.position = this.mesh.position.clone();
        let a2r = 1;
        if(this.mesh.rotation.x != 0){
            this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), this.mesh.rotation.x * a2r);
        }
        else if(this.mesh.rotation.y != 0){
            this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), this.mesh.rotation.y * a2r);
        }
        else if(this.mesh.rotation.z != 0){
            this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), this.mesh.rotation.z * a2r);
        }
    }

    update(){
        this.mesh.position.copy( this.body.position );
        // if(this.type == "cylinder"){
        //     this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), this.mesh.rotation.z * Math.PI / 2);
        // }
        this.mesh.quaternion.copy( this.body.quaternion );
        if(this.type == "cylinder"){
            // this.mesh.setRotationFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI * 30);
        }
        this.destory();
    }

    destory(){
        if(this.mesh.position.y < -100){
            let x = (0.5 - Math.random()) * 80;
            let y = 700;
            let z = (0.5 - Math.random()) * 80;
            this.body.position = new CANNON.Vec3(x, y, z);
        }
    }
}