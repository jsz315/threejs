import * as THREE from "three";
export default class PhysicsView{

    mesh:THREE.Mesh;
    body:any;
    world:any;

    constructor(mesh:THREE.Mesh, type:string, world:any){
        this.mesh = mesh;
        this.world = world;
        let box = new THREE.Box3().setFromObject(mesh);
        let size = box.getSize(new THREE.Vector3());
        let scale = type == "box" ? 1 : 2;

        this.body = world.add({ 
            type: type, // type of shape : sphere, box, cylinder 
            size: [size.x / scale, size.y / scale, size.z / scale], // size of shape
            pos: [mesh.position.x, mesh.position.y, mesh.position.z], // start position in degree
            rot: [0, 0, 0], // start rotation in degree
            move: true, // dynamic or statique
            density: 1,
            friction: 0.8,
            restitution: 0.1,
            belongsTo: 1, // The bits of the collision groups to which the shape belongs.
            collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
        });
    }

    update(){
        this.mesh.position.copy( this.body.getPosition() );
        this.mesh.quaternion.copy( this.body.getQuaternion() );
        this.destory();
    }

    destory(){
        if(this.mesh.position.y < -30){
            let x = (0.5 - Math.random()) * 40;
            let y = 700;
            let z = (0.5 - Math.random()) * 40;
            this.body.resetPosition(x, y, z);
        }
    }
}