import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import PhysicsView from './PhysicsView';
import PhyView from './PhyView';
import Store from './Store';

export default class Car{
    world: any;
    canvas:any;
    controls: OrbitControls;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    ray:THREE.Raycaster;
    mouse: THREE.Vector2;
    content: THREE.Object3D;
    stats: any;
    updaters: Array<any>;
    store:Store = new Store();

    constructor(){
        this.initCore();
        this.initLight();
        this.initOimoPhysics();
        this.initStats();
        this.animate();
    }

    initStats(){
        this.stats = new Stats();
        this.stats.setMode(0); 
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);
        // this.clock = new THREE.Clock();
    }

    initCore(){
        this.canvas = document.getElementById("canvas");

        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
        this.camera.position.set( -19.877586729468447, 38.229069946513945, 55.911914153889384 );
        this.camera.rotation.set( -0.4610108856698664, -0.3619781646171701, -0.1741157073589739 );

        this.controls = new OrbitControls( this.camera, this.canvas );
        this.controls.enableKeys = false;
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        this.ray = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, precision: "mediump", antialias: true });
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.content = new THREE.Object3D();
        this.scene.add(this.content);

        window.addEventListener( 'resize', this.onResize, false );

        // background
        // var buffgeoBack = new THREE.BufferGeometry();
        // buffgeoBack.fromGeometry( new THREE.IcosahedronGeometry(3000,1) );
        // var back = new THREE.Mesh( buffgeoBack, new THREE.MeshBasicMaterial( { map:gradTexture([[1,0.75,0.5,0.25], ['#1B1D1E','#3D4143','#72797D', '#b0babf']]), side:THREE.BackSide, depthWrite: false }  ));
        // back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(15*ToRad));
        // this.scene.add( back );

        // geometries
        // geos['sphere'] = new THREE.BufferGeometry().fromGeometry( new THREE.SphereGeometry(1,16,10));
        // geos['box'] = new THREE.BufferGeometry().fromGeometry( new THREE.BoxGeometry(1,1,1));
        // geos['cylinder'] = new THREE.BufferGeometry().fromGeometry(new THREE.CylinderGeometry(1,1,1, 20,1));

        // buffgeoSphere = new THREE.BufferGeometry();
        // buffgeoSphere.fromGeometry( new THREE.SphereGeometry( 1, 20, 10 ) );

        // buffgeoBox = new THREE.BufferGeometry();
        // buffgeoBox.fromGeometry( new THREE.BoxGeometry( 1, 1, 1 ) );

        // matSphere = new THREE[materialType]( { map: basicTexture(0), name:'sph' } );
        // matBox = new THREE[materialType]( {  map: basicTexture(2), name:'box' } );
        // matSphereSleep = new THREE[materialType]( { map: basicTexture(1), name:'ssph' } );
        // matBoxSleep = new THREE[materialType]( {  map: basicTexture(3), name:'sbox' } );
        // matGround = new THREE[materialType]( { color: 0x3D4143, transparent:true, opacity:0.5 } );
        // matGroundTrans = new THREE[materialType]( { color: 0x3D4143, transparent:true, opacity:0.6 } );

        // paddel = new THREE.Object3D();

        // rotTest = new THREE.Vector3();

        // events

        // window.addEventListener( 'resize', onWindowResize, false );
        // this.canvas.addEventListener( 'mousemove', rayTest, false);
        //canvas.onmousemove = rayTest;
    
    }

    onResize(e:Event):void{
        let w = window.innerWidth;
        let h = window.innerHeight;
        this.canvas.width = w;
        this.canvas.height = h;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }

    animate() {
        requestAnimationFrame(()=>{
            this.animate();
        });
        this.world.step();
        this.updaters.forEach((item:PhysicsView)=>{
            item.update();
        })
        this.renderer.render( this.scene, this.camera );
        this.stats.update();
    }

    initLight(){
        this.scene.add( new THREE.AmbientLight( 0x3D4143 ) );
        var light = new THREE.DirectionalLight( 0xffffff , 1);
        light.position.set( 300, 1000, 500 );
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
        var d = 300;
        light.shadow.camera = new THREE.OrthographicCamera( -d, d, d, -d,  500, 1600 );
        light.shadow.bias = 0.0001;
        light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;
        this.scene.add( light );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
    }

    initOimoPhysics(){
        this.world = new OIMO.World({
            info:false, 
            worldscale: 10,
            timestep: 1 / 60, 
            iterations: 7, 
            broadphase: 2, // 1: brute force, 2: sweep & prune, 3: volume tree
        });
        this.updaters = [];

        let mat:THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({wireframe: false});
        mat.map = new THREE.TextureLoader().load("/asset/img/m1.jpg");
        mat.emissive = new THREE.Color(0, 0, 0);

        // ground
        // var ground = this.world.add({size:[4000, 40, 10000], pos:[0,-20,0] });
        // this.addStaticBox([4000, 40, 10000], [0,-20,0], [0,0,0]);


        // let groundView1: PhyView = new PhyView("box", new THREE.Vector3(40, 4, 40), false, this.world);
        // this.scene.add(groundView1.mesh);
        // this.updaters.push(groundView1);
        // groundView1.setPosition(0, -8, 0);
        // groundView1.setup();

        let ground:THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(80, 4, 80), mat);
        this.scene.add(ground);
        ground.castShadow = true;
        ground.receiveShadow = true;
        ground.position.set(0, -8, 0);
        ground.rotation.x = 10 * Math.PI / 180;
        new PhysicsView(ground, false, this.world);

        // let groundView2: PhyView = new PhyView("box", new THREE.Vector3(40, 1, 40), false, this.world);
        // this.scene.add(groundView2.mesh);
        // this.updaters.push(groundView2);
        // groundView2.setPosition(0, 0, 30);
        // groundView2.setRotation(-30, 0, 0);

        
        let mesh:THREE.Mesh;
        let t;
        let types = ["box", "sphere", "cylinder"];
        for(let i = 0; i < 90; i++){
            let geo = this.store.getBufferGeometry(types[i % 3]);
            mesh = new THREE.Mesh(geo, this.store.getMaterial());
            
            let x = (0.5 - Math.random()) * 40;
            let y = Math.random() * 900;
            let z = (0.5 - Math.random()) * 40;
            mesh.position.set(x, y, z);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
            let physicsView:PhysicsView = new PhysicsView(mesh, true, this.world);
            this.updaters.push(physicsView);
        }

        // let carBody: PhyView = new PhyView("box", new THREE.Vector3(4, 0.5, 2), true, this.world);
        // this.scene.add(carBody.mesh);
        // this.updaters.push(carBody);
        
        // carBody.setPosition(0, 1, 0);
        // carBody.setup();
        // carBody.body.name = "carBody";

        // let w1: PhyView = new PhyView("cylinder", new THREE.Vector3(1, 0.8, 1), true, this.world);
        // this.scene.add(w1.mesh);
        // this.updaters.push(w1);
        
        // w1.setPosition(-2, 0, -2);
        // w1.setRotation(90, 0, 0);
        // w1.setup();
        // w1.body.name = "w1";

        // var axe1 = [0, 0, 1];
        // var axe2 = [0, 0, 1];

        // let j1 = this.world.add({type:"jointWheel", body1:'carBody', body2:'w1', pos1:[-2, 0, -2], pos2:[0, 0, 0], axe1:axe1, axe2:axe2, spring:[1, 1], collision:false });
        // j1.translationalLimitMotor.motorSpeed = 0.1;
        // j1.translationalLimitMotor.maxMotorForce = 10;

        // let w2: PhyView = new PhyView("cylinder", new THREE.Vector3(1, 0.8, 1), true, this.world);
        // this.scene.add(w2.mesh);
        // this.updaters.push(w2);
        // w2.setPosition(-2, 0, 2);
        // w2.setRotation(90, 0, 0);
        // w2.setup();
        // w2.body.name = "w2";

        // let j2 = this.world.add({type:"jointWheel", body1:'carBody', body2:'w2', pos1:[-2, 0, 2], pos2:[0, 0, 0], axe1:axe1, axe2:axe2, spring:[8, 1], collision:false });
        // j2.translationalLimitMotor.motorSpeed = 0.1;
        // j2.translationalLimitMotor.maxMotorForce = 10;

        // let w3: PhyView = new PhyView("cylinder", new THREE.Vector3(1, 0.8, 1), true, this.world);
        // this.scene.add(w3.mesh);
        // this.updaters.push(w3);
        // w3.setPosition(2, 0, -2);
        // w3.setRotation(90, 0, 0);
        // w3.setup();
        // w3.body.name = "w3";

        // this.world.add({type:"jointWheel", body1:'carBody', body2:'w3', pos1:[2, 0, -2], pos2:[0, 0, 0], axe1:axe1, axe2:axe2, spring:[8, 1], collision:false });

        // let w4: PhyView = new PhyView("cylinder", new THREE.Vector3(1, 0.8, 1), true, this.world);
        // this.scene.add(w4.mesh);
        // this.updaters.push(w4);
        // w4.setPosition(2, 0, 2);
        // w4.setRotation(90, 0, 0);
        // w4.setup();
        // w4.body.name = "w4";

        // this.world.add({type:"jointWheel", body1:'carBody', body2:'w4', pos1:[2, 0, 2], pos2:[0, 0, 0], axe1:axe1, axe2:axe2, spring:[8, 1], collision:false });

        this.scene.add(new THREE.AxesHelper(10));
    }

    addStaticBox(size:any, position:any, rotation:any) {
        // var mesh;
        // if(spec) mesh = new THREE.Mesh( buffgeoBox, matGroundTrans );
        // else mesh = new THREE.Mesh( buffgeoBox, matGround );
        // mesh.scale.set( size[0], size[1], size[2] );
        // mesh.position.set( position[0], position[1], position[2] );
        // mesh.rotation.set( rotation[0]*ToRad, rotation[1]*ToRad, rotation[2]*ToRad );
        // if(!grounds.length) content.add( mesh );
        // else scene.add( mesh );
        // grounds.push(mesh);
        // mesh.castShadow = true;
        // mesh.receiveShadow = true;
    }
}