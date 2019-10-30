import * as BABYLON from 'babylonjs'
import Stats from 'three/examples/jsm/libs/stats.module';
import CameraMaker from './CameraMaker';
import Fire from './Fire';

export default class App{

    canvas:any;
    engine:BABYLON.Engine;
    scene:BABYLON.Scene;
    camera:BABYLON.Camera;
    stats: any;
    sphere:BABYLON.Mesh;
    offset:BABYLON.Vector3 = new BABYLON.Vector3(-4, 1, -8);
    fire:Fire;

    constructor(){
        this.canvas = document.getElementById("canvas");
        this.engine = new BABYLON.Engine(this.canvas, true);

        this.createScene();
        this.createStats();

        // var physicsPlugin = new BABYLON.CannonJSPlugin();
        // physicsPlugin.setTimeStep(1 /120);
        // var physicsEngine = this.scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), physicsPlugin);
        console.log(this.offset);

        this.engine.runRenderLoop(()=>{
            this.fire.update();
            this.scene.render();
            this.stats.update();
            // this.sphere.translate(new BABYLON.Vector3(0, 0, 1), 0.05, BABYLON.Space.LOCAL);
        })
        window.addEventListener("resize", ()=>{
            this.engine.resize();
        })
    }

    createScene(){
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = CameraMaker.getFreeCamera(this.scene);
        this.camera.attachControl(this.canvas);
        this.fire = new Fire(this.scene);
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

        // var light:BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 1), this.scene);
        // light.intensity = 0.8;
        
        var material:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("material", this.scene);
        material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        material.diffuseTexture = new BABYLON.Texture("/asset/img/p6.jpg", this.scene);
        material.bumpTexture = new BABYLON.Texture("/asset/img/p6_nor.jpg", this.scene);
        (material.diffuseTexture as BABYLON.Texture).uScale = 4;
        (material.diffuseTexture as BABYLON.Texture).vScale = 4;
        (material.bumpTexture as BABYLON.Texture).uScale = 4;
        (material.bumpTexture as BABYLON.Texture).vScale = 4;

        var sphere:BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2}, this.scene);
        sphere.material = material;

        this.addBox(new BABYLON.Color3(1, 0, 0), new BABYLON.Vector3(7, 0, 0));
        this.addBox(new BABYLON.Color3(0, 1, 0), new BABYLON.Vector3(0, 7, 0));
        this.addBox(new BABYLON.Color3(0, 0, 1), new BABYLON.Vector3(0, 0, 7));

        var ground:BABYLON.Mesh = BABYLON.Mesh.CreateGroundFromHeightMap("map", "/asset/img/p6_nor.jpg", 40, 40, 40, 0, 0.4, this.scene);
        var groundMat:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("groundMat", this.scene);
        groundMat.diffuseTexture = new BABYLON.Texture("/asset/img/p6.jpg", this.scene);
        groundMat.bumpTexture = new BABYLON.Texture("/asset/img/p6_nor.jpg", this.scene);
        groundMat.diffuseColor = new BABYLON.Color3(0, 1, 1);
        ground.material = groundMat;

        this.sphere = sphere;
        sphere.parent = this.camera;
        sphere.position.set(0, 0, 8);
        this.fire.light.parent = this.camera;
    }

    addBox(color: BABYLON.Color3, position:BABYLON.Vector3){
        var box:BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("box", {}, this.scene);
        var mat:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("material", this.scene);
        mat.diffuseColor = color;
        box.material = mat;
        box.position = position;
    }

    createStats(){
        this.stats = new Stats();
        this.stats.setMode(0); 
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);
    }

}