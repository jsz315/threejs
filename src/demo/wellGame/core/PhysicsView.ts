import * as THREE from "three";
export default class PhysicsView{

    mesh:THREE.Mesh;
    body:any;
    world:any;
    TORAN: number = 180 / Math.PI;

    constructor(mesh:THREE.Mesh, move:boolean, world:any){

        this.mesh = mesh;
        this.world = world;
        let type:any = mesh.geometry.type;
        let parameters = (<any>mesh.geometry).parameters;

        let param:any = {
            pos: [mesh.position.x, mesh.position.y, mesh.position.z], // start position in degree
            rot: [mesh.rotation.x * this.TORAN, mesh.rotation.y * this.TORAN, mesh.rotation.z * this.TORAN], // start rotation in degree
            move: move, // dynamic or statique
            density: 1,
            friction: 0.4,
            restitution: 0.1,
            belongsTo: 1, // The bits of the collision groups to which the shape belongs.
            collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
        }

        if(type == "CylinderGeometry"){
            param.type = "cylinder";
            param.size = [parameters.radiusTop, parameters.height];
        }
        else if(type == "BoxGeometry"){
            param.type = "box";
            param.size = [parameters.width, parameters.height, parameters.depth];
        }
        else if(type == "SphereGeometry"){
            param.type = "sphere";
            param.size = [parameters.radius];
        }

        this.body = world.add(param);
    }

    update(){
        this.mesh.position.copy( this.body.getPosition() );
        this.mesh.quaternion.copy( this.body.getQuaternion() );
        this.destory();
    }

    destory(){
        if(this.mesh.position.y < -30){
            let x = (0.5 - Math.random()) * 40;
            let y = 40;
            let z = (0.5 - Math.random()) * 40;
            this.body.resetPosition(x, y, z);
        }
    }
}