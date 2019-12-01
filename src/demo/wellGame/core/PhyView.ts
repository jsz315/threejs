import * as THREE from "three";

export default class PhyView{

    mesh: THREE.Mesh;
    body: any;
    param: any;
    world: any;

    constructor(type:string, size:THREE.Vector3, move:boolean, world:any){
        this.world = world;
        this.param = {
            type: type,
            pos: [0, 0, 0], // start position in degree
            rot: [0, 0, 0], // start rotation in degree
            move: move, // dynamic or statique
            density: 1,
            friction: 0.8,
            restitution: 0.1
        }

        // phy.w[i] = world.add({type:'cylinder', size:[radius*0.5,30], pos:[x,100,z], rot:[0,0,90], move:true, config:[10,10,0.0], name:'w'+i+'_'+id});
        let mat:THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial();
        mat.map = new THREE.TextureLoader().load("/asset/img/m1.jpg");
        mat.emissive = new THREE.Color(0, 0, 0);

        if(type == "box"){
            this.mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), mat);
            this.param.size = [size.x, size.y, size.z];
        }
        else if(type == "sphere"){
            this.mesh = new THREE.Mesh(new THREE.SphereGeometry(size.x, 16, 16), mat);
            this.param.size = [size.x];
        }
        else if(type == "cylinder"){
            this.mesh = new THREE.Mesh(new THREE.CylinderGeometry(size.x / 2, size.x / 2, size.y), mat);
            this.param.size = [size.x, size.y, size.x];
        }
        
        console.log(this.mesh);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    setPosition(x:number, y:number, z:number){
        // this.body.resetPosition(x, y, z);
        this.param.pos = [x, y, z];
        // this.update();
    }

    setRotation(x:number, y:number, z:number){
        this.param.rot = [x, y, z];
        // this.body.resetRotation(x, y, z);
        // this.update();
    }

    setup(){
        this.body = this.world.add(this.param);
        this.update();
    }

    update(){
        this.mesh.position.copy( this.body.getPosition() );
        this.mesh.quaternion.copy( this.body.getQuaternion() );
        this.destory();
    }

    destory(){
        if(this.mesh.position.y < -30){
            let x = (0.5 - Math.random()) * 80;
            let y = Math.random() * 900;
            let z = (0.5 - Math.random()) * 80;
            this.body.resetPosition(x, y, z);
        }
    }
}