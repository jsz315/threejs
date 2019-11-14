import Stats from 'three/examples/jsm/libs/stats.module';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PhysicsView from './PhysicsView';
import Store from './Store';
import Fire from './Fire';
import ComputeGeometry from './ComputeGeometry';

// import * as Ammo from '../asset/lib/ammo'

export default class App{

    controls:OrbitControls;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    size:any;
    canvas: any;
    stats: any;
    clock: THREE.Clock;

    physicsWorld:any;
    world:any;
    updaters: Array<PhysicsView> = [];
    store:Store = new Store();
    fire:Fire;

    constructor(){

        this.world = new OIMO.World({ 
            timestep: 1 / 60, 
            iterations: 8, 
            broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
            worldscale: 1, // scale full world 
            random: true,  // randomize sample
            info: false,   // calculate statistic or not
            gravity: [0, -9.8, 0] 
        });

        this.initStats();
        this.initGraphics();
        this.initPhysics();
        this.createObjects();
        this.animate();
    }

    initStats(){
        this.stats = new Stats();
        this.stats.setMode(0); 
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);
        this.clock = new THREE.Clock();
    }

    initGraphics(){
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );

        this.scene = new THREE.Scene();
        this.camera.position.set(-25, 25, 78);
        this.camera.lookAt(new THREE.Vector3());
        console.log(this.camera);

        this.canvas = document.getElementById("canvas") as any;
        this.controls = new OrbitControls( this.camera, this.canvas );
        this.controls.target.y = 2;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor( 0x000000 );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;

        // var ambientLight = new THREE.AmbientLight( 0xffffff );
        // this.scene.add( ambientLight );

        this.fire = new Fire();
        this.scene.add( this.fire.light );
        // this.scene.add(new THREE.DirectionalLightHelper(light));
        window.addEventListener( 'resize', this.onResize, false );
    }

    onResize(e:Event):void{
        this.size = this.getStageSize(true);
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        this.camera.aspect = this.size.width / this.size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.size.width, this.size.height);
    }

    getStageSize(usePixel?:boolean):any{
        var size:any = {width: window.innerWidth};
        if(window.innerWidth > window.innerHeight){
            size.height = window.innerHeight;
        }
        else{
            size.height = window.innerWidth;
        }
        if(usePixel){
            size.width = size.width * window.devicePixelRatio;
            size.height = size.height * window.devicePixelRatio;
        }
        return size;
    }

    initPhysics(){
        this.addStaticBox([4, 40, 40], [-10, -4, 0], [0, 0, 0]);
        this.addStaticBox([4, 40, 40], [10, -4, 0], [0, 0, 0]);
        this.addStaticBox([80, 8, 80], [0, -2, 0], [30, 0, 0]);

        ComputeGeometry.checkThree(THREE);

        var box1 = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 20), new THREE.MeshStandardMaterial());
        var box2 = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), new THREE.MeshStandardMaterial());

        var res = ComputeGeometry.subtract(box1, box2);
        (res as THREE.Mesh).material = new THREE.MeshStandardMaterial({color: 0xff9900});
        res.position.y = 10;
        // var mesh = new THREE.Mesh(geo, new THREE.MeshNormalMaterial());
        this.scene.add(res);
    }

    addStaticBox(size:any, position:any, rotation:any) {
        this.world.add({size: size, pos: position, rot: rotation, move: false});

        var  ToRad = 0.0174532925199432957;
        let mat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial();
        mat.metalness = 0.1;
        mat.roughness = 0.72;
        mat.map = new THREE.TextureLoader().load("/asset/img/p6.jpg");
        var mesh = new THREE.Mesh( new THREE.BoxGeometry(), mat );
        mesh.scale.set( size[0], size[1], size[2] );
        mesh.position.set( position[0], position[1], position[2] );
        mesh.rotation.set( rotation[0] * ToRad, rotation[1] * ToRad, rotation[2] * ToRad );
        this.scene.add( mesh );
        // grounds.push(mesh);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    }

    createObjects(){
        // for(let i = 0; i < 1000; i++){
        //     let type = "sphere";
        //     if(i % 2){
        //         type ="box";
        //     }
        //     let shape;
        //     if(type == "box"){
        //         shape = this.store.getBoxBufferGeometry();
        //     }
        //     else{
        //         shape = this.store.getSphereBufferGeometry();
        //     }
        //     var view = new THREE.Mesh(shape, this.store.getMaterial());
        //     let x = (0.5 - Math.random()) * 40;
        //     let y = Math.random() * 1600;
        //     let z = (0.5 - Math.random()) * 40;
        //     view.position.set(x, y, z);
        //     view.castShadow = true;
        //     view.receiveShadow = true;
        //     this.scene.add(view);
        //     this.updaters.push(new PhysicsView(view, type, this.world));
        // }
        
    }

    initInput(){

    }

    animate() {
        requestAnimationFrame(()=>{
            this.animate();
        });
        this.world.step();
        this.fire.update();
        this.updaters.forEach((item:PhysicsView)=>{
            item.update();
        })
        this.render();
        this.stats.update();
    }

    render() {
        // var deltaTime = clock.getDelta();
        // updatePhysics( deltaTime );
        // processClick();
        // controls.update( deltaTime );
        this.renderer.render( this.scene, this.camera );

    }

}