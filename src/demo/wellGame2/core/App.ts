import Stats from 'three/examples/jsm/libs/stats.module';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PhysicsView from './PhysicsView';
import Store from './Store';
import Fire from './Fire';
import ComputeGeometry from './ComputeGeometry';
import * as CANNON from 'cannon';
import Draw from './Draw';
// import '../asset/lib/CannonDebugRenderer';
const CannonDebugRenderer = require('../asset/lib/CannonDebugRenderer')(THREE, CANNON);

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
    
    world:any;
    updaters: Array<PhysicsView> = [];
    store:Store = new Store();
    fire:Fire;
    debugRenderer:any;

    constructor(){
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.8, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();

        let solver = new CANNON.GSSolver();
        this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
        this.world.defaultContactMaterial.contactEquationRelaxation = 4;

        solver.iterations = 8;
        solver.tolerance = 0.1;
        this.world.solver = new CANNON.SplitSolver(solver);

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
        this.renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;

  
        // CannonDebugRenderer

        var ambientLight = new THREE.AmbientLight( 0xffffff );
        ambientLight.intensity = 0.4;
        this.scene.add( ambientLight );

        this.fire = new Fire();
        this.scene.add( this.fire.light );
        // this.scene.add(new THREE.DirectionalLightHelper(light));
        window.addEventListener( 'resize', this.onResize, false );

        console.log(THREE);

        this.debugRenderer = new CannonDebugRenderer(this.scene, this.world);


        // this.scene.add(new Draw());
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

        // ComputeGeometry.checkThree(THREE);

        var box1 = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 20), new THREE.MeshStandardMaterial());
        var box2 = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), new THREE.MeshStandardMaterial());

        var res = ComputeGeometry.subtract(box1, box2);
        (res as THREE.Mesh).material = new THREE.MeshStandardMaterial({color: 0xff9900});
        res.position.y = 10;

        var num = (20 - 4) / 2;
        this.addStaticBox([num, 1, 20], [-20 / 2 + num / 2, 10.2, 0], [0, 0, -30]);
        this.addStaticBox([num, 1, 20], [20 / 2 - num / 2, 10.2, 0], [0, 0, 30]);

        this.addStaticBox([4, 1, num], [0, 10.2, -20 / 2 + num / 2], [30, 0, 0]);
        this.addStaticBox([4, 1, num], [0, 10.2, 20 / 2 - num / 2], [-30, 0, 0]);

        // var compoundBody = new CANNON.Body({ mass: 0 });

        // var sx = 20 - 4 / 2;
        // var sz = 20;
        // var sy = 1;

        // var shape1 = new CANNON.Box(new CANNON.Vec3(sx / 2, sy / 2, sz / 2));
        // compoundBody.addShape(shape1, new CANNON.Vec3( -2 - sx / 2, 0, 0));
        // compoundBody.addShape(shape1, new CANNON.Vec3( 2 + sx / 2, 0, 0));

        // sx = 4 / 2;
        // sz = 20 - 4 / 2;
        // sy = 1;

        // var shape2 = new CANNON.Box(new CANNON.Vec3(sx / 2, sy / 2, sz / 2));

        // compoundBody.addShape(shape2, new CANNON.Vec3( 0, 0, -2 - sx / 2));
        // compoundBody.addShape(shape2, new CANNON.Vec3(0, 0, 2 + sx / 2));

        // compoundBody.position.set(0, 10, 0);
        // this.world.add(compoundBody);

        // this.scene.add(res);

        // var matrix = [];
        // var sizeX = 64,
        //     sizeY = 64;

        // for (var i = 0; i < sizeX; i++) {
        //     matrix.push([]);
        //     for (var j = 0; j < sizeY; j++) {
        //         var height = Math.cos(i / sizeX * Math.PI * 5) * Math.cos(j/sizeY * Math.PI * 5) * 2 + 2;
        //         if(i===0 || i === sizeX-1 || j===0 || j === sizeY-1)
        //             height = 3;
        //         matrix[i].push(height);
        //     }
        // }

        // var hfShape = new CANNON.Heightfield(matrix, {
        //     elementSize: 100 / sizeX
        // });
        // var hfBody = new CANNON.Body({ mass: 0 });
        // hfBody.addShape(hfShape);
        // hfBody.position.set(-sizeX * hfShape.elementSize / 2, -sizeY * hfShape.elementSize / 2, -1);
        // this.world.add(hfBody);
    }

    addStaticBox(size:any, position:any, rotation:any) {
        // this.world.add({size: size, pos: position, rot: rotation, move: false});
        // var  ToRad = 0.0174532925199432957;

        // let shape = new CANNON.Box(new CANNON.Vec3(size[0] / 2, size[1] / 2, size[2] / 2));
        // let body = new CANNON.Body({
        //     mass: 0,
        //     position: new CANNON.Vec3(position[0], position[1], position[2]),
        //     shape: shape
        // })

        // if(rotation[0] != 0){
        //     body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), rotation[0] * ToRad);
        // }
        // else if(rotation[1] != 0){
        //     body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotation[1] * ToRad);
        // }
        // else if(rotation[2] != 0){
        //     body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), rotation[2] * ToRad);
        // }


        // this.world.add(body);

        var  ToRad = 0.0174532925199432957;
        let mat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial();
        mat.metalness = 0.1;
        mat.roughness = 0.72;
        mat.map = new THREE.TextureLoader().load("/asset/img/p6.jpg");

        var mesh = new THREE.Mesh( new THREE.BoxGeometry(size[0], size[1], size[2]), mat );
        mesh.position.set( position[0], position[1], position[2] );

        var view = new PhysicsView(mesh, "box", this.world, true);
        mesh.rotation.set( rotation[0] * ToRad, rotation[1] * ToRad, rotation[2] * ToRad );
        view.updateBodyTrs();

        this.scene.add( mesh );
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.updaters.push(view);

        this.addMap();
    }

    addMap(){
        var matrix = [];
        var sizeX = 10,
            sizeY = sizeX;
        var angle = 4;

        for (var i = 0; i < sizeX; i++) {
            matrix.push([]);
            for (var j = 0; j < sizeY; j++) {
                var height = Math.sin(i / sizeX * Math.PI * angle) * Math.sin(j / sizeY * Math.PI * angle) * angle + angle;
                if(i===0 || i === sizeX-1 || j===0 || j === sizeY-1)
                    height = angle;

                matrix[i].push(height);
            }
        }

        var hfShape = new CANNON.Heightfield(matrix, {
            elementSize: 100 / sizeX
        });
        var hfBody;

        var quat = new CANNON.Quaternion();
        var pos = new CANNON.Vec3(-sizeX * hfShape.elementSize / 2, -20, 100);

        quat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

        // Use normal
        hfBody = new CANNON.Body({ mass: 0 });
        hfBody.addShape(hfShape, new CANNON.Vec3(0, 0, 0));
        hfBody.position.copy(pos);
        hfBody.quaternion.copy(quat);
        
        this.world.add(hfBody);

        let mesh:THREE.Mesh = this.drawMap(hfBody.shapes[0]);
        mesh.position.copy(pos);
        mesh.quaternion.copy(quat);
        this.scene.add(mesh);
    }

    drawMap(shape:any):THREE.Mesh{
        var geometry = new THREE.Geometry();

        var v0 = new CANNON.Vec3();
        var v1 = new CANNON.Vec3();
        var v2 = new CANNON.Vec3();
        for (var xi = 0; xi < shape.data.length - 1; xi++) {
            for (var yi = 0; yi < shape.data[xi].length - 1; yi++) {
                for (var k = 0; k < 2; k++) {
                    shape.getConvexTrianglePillar(xi, yi, k===0);
                    v0.copy(shape.pillarConvex.vertices[0]);
                    v1.copy(shape.pillarConvex.vertices[1]);
                    v2.copy(shape.pillarConvex.vertices[2]);
                    v0.vadd(shape.pillarOffset, v0);
                    v1.vadd(shape.pillarOffset, v1);
                    v2.vadd(shape.pillarOffset, v2);
                    geometry.vertices.push(
                        new THREE.Vector3(v0.x, v0.y, v0.z),
                        new THREE.Vector3(v1.x, v1.y, v1.z),
                        new THREE.Vector3(v2.x, v2.y, v2.z)
                    );
                    var i = geometry.vertices.length - 3;
                    geometry.faces.push(new THREE.Face3(i, i+1, i+2));
                }
            }
        }
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();

        let mat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial();
        mat.metalness = 0.1;
        mat.roughness = 0.72;
        mat.map = new THREE.TextureLoader().load("/asset/img/p6.jpg");

        let mesh = new THREE.Mesh(geometry, mat);
        return mesh;
    }

    createObjects(){
        for(let i = 0; i < 10; i++){
            let type = ["sphere", "box", "cylinder"][i % 3];
            let shape = this.store.getBufferGeometry(type);
            var view = new THREE.Mesh(shape, this.store.getMaterial());
            let x = (0.5 - Math.random()) * 80;
            let y = Math.random() * 900;
            let z = (0.5 - Math.random()) * 80;
            view.position.set(x, y, z);
            view.castShadow = true;
            view.receiveShadow = true;
            this.scene.add(view);
            this.updaters.push(new PhysicsView(view, type, this.world, false, this.scene));
        }
        
    }

    initInput(){

    }

    animate() {
        requestAnimationFrame(()=>{
            this.animate();
        });
        this.world.step(1 / 60);
        this.fire.update();
        this.updaters.forEach((item:PhysicsView)=>{
            item.update();
        })
        this.render();
        this.debugRenderer.update();
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