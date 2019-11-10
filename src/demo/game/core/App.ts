import * as BABYLON from 'babylonjs'
import Stats from 'three/examples/jsm/libs/stats.module';
import CameraMaker from './CameraMaker';
import Fire from './Fire';
// import * as CANNON from '../asset/lib/cannon.min'

export default class App{

    canvas:any;
    engine:BABYLON.Engine;
    scene:BABYLON.Scene;
    camera:BABYLON.Camera;
    stats: any;
    sphere:BABYLON.Mesh;
    fire:Fire;
    shadowGenerator: BABYLON.ShadowGenerator;

    constructor(){
        this.canvas = document.getElementById("canvas");
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        // this.scene.shadowsEnabled = true;
        console.log("this.scene");
        console.log(this.scene);
        this.camera = CameraMaker.getFreeCamera(this.scene);
        this.camera.attachControl(this.canvas);

        var physicsPlugin = new BABYLON.AmmoJSPlugin();
        physicsPlugin.setTimeStep(1 /120);
        this.scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), physicsPlugin);
        // this.scene.collisionsEnabled = true;

        this.createScene();
        this.createStats();
        
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
       
        this.fire = new Fire(this.scene);
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

        // var light:BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 1), this.scene);
        // light.intensity = 0.8;
        
        // var material:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("material", this.scene);
        // material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        // material.diffuseTexture = new BABYLON.Texture("/asset/img/p6.jpg", this.scene);
        // material.bumpTexture = new BABYLON.Texture("/asset/img/p6_nor.jpg", this.scene);
        // (material.diffuseTexture as BABYLON.Texture).uScale = 4;
        // (material.diffuseTexture as BABYLON.Texture).vScale = 4;
        // (material.bumpTexture as BABYLON.Texture).uScale = 4;
        // (material.bumpTexture as BABYLON.Texture).vScale = 4;
        // var sphere:BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2}, this.scene);
        // sphere.material = material;

        this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.fire.light);
        // this.shadowGenerator.setDarkness(0.8);
        // this.shadowGenerator.useCloseExponentialShadowMap = true;
        // this.shadowGenerator.blurScale = 2;
        // this.shadowGenerator.bias = 0.01;
        // this.shadowGenerator.usePoissonSampling = true;
        // shadowGenerator.useExponentialShadowMap = true;
        this.shadowGenerator.usePoissonSampling = true;
        // shadowGenerator.useBlurExponentialShadowMap = true;
        this.shadowGenerator.forceBackFacesOnly = true;
        this.shadowGenerator.blurKernel = 32;
        this.shadowGenerator.useKernelBlur = true;

        var hemisphericLight1 = new BABYLON.HemisphericLight("hemisphericLight1", new BABYLON.Vector3(1, -1, -1), this.scene);
        hemisphericLight1.diffuse = BABYLON.Color3.FromHexString("#FFFFFF");
        hemisphericLight1.specular = BABYLON.Color3.FromHexString("#FFFFFF");
        hemisphericLight1.groundColor = BABYLON.Color3.FromHexString("#FFFFFF");
        hemisphericLight1.intensity = 0.4;

        var hemisphericLight2 = new BABYLON.HemisphericLight("hemisphericLight2", new BABYLON.Vector3(1, -1, 0.4), this.scene);
        hemisphericLight2.diffuse = BABYLON.Color3.FromHexString("#FFFFFF");
        hemisphericLight2.specular = BABYLON.Color3.FromHexString("#FFFFFF");
        hemisphericLight2.groundColor = BABYLON.Color3.FromHexString("#FFFFFF");
        hemisphericLight2.intensity = 0.3;

        

        this.addBox(new BABYLON.Color3(1, 0, 0), new BABYLON.Vector3(7, 0, 0));
        this.addBox(new BABYLON.Color3(0, 1, 0), new BABYLON.Vector3(0, 7, 0));
        this.addBox(new BABYLON.Color3(0, 0, 1), new BABYLON.Vector3(0, 0, 7));

        for(let i = 0; i < 1; i++){
            let c = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            let p = new BABYLON.Vector3(
                (0.5 - Math.random()) * 10,
                (0.5 - Math.random()) * -30,
                (0.5 - Math.random()) * 10,
            );
            this.addSphere(c, p);
        }
        
        // var ground:BABYLON.Mesh = BABYLON.Mesh.CreateGroundFromHeightMap("map", "/asset/img/p6_nor.jpg", 80, 80, 40, 0, 0.4, this.scene);
        // var ground:BABYLON.Mesh = BABYLON.Mesh.CreatePlane("plane", 400, this.scene);
        // var ground:BABYLON.Mesh = BABYLON.Mesh.CreateGround("plane", 80, 80, 80, this.scene);

        var ground:BABYLON.Mesh = BABYLON.Mesh.CreateBox("plane", 1, this.scene);
        ground.scaling = new BABYLON.Vector3(10, 1, 10);
        var groundMat:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("groundMat", this.scene);
        groundMat.diffuseTexture = new BABYLON.Texture("/asset/img/p6.jpg", this.scene);
        // groundMat.bumpTexture = new BABYLON.Texture("/asset/img/p6_nor.jpg", this.scene);
        groundMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        groundMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);

        (groundMat.diffuseTexture as any).uScale = 4;
        (groundMat.diffuseTexture as any).vScale = 4;
        ground.material = groundMat;
        ground.position.y = -10;
        ground.receiveShadows = true;

        this.shadowGenerator.getShadowMap().renderList.push(ground);

        // this.sphere = sphere;
        // sphere.parent = this.camera;
        // sphere.position.set(0, 0, 8);
        this.fire.light.parent = this.camera;

        new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            friction: 0.5,
            restitution: 0.9
        }, this.scene);
       
    }

    addBox(color: BABYLON.Color3, position:BABYLON.Vector3){
        // var material = new BABYLON.ShaderMaterial("shader", this.scene, "/asset/shader/test1");

        var box:BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("box", {}, this.scene);
        var mat:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("material", this.scene);
        // mat.wireframe = true;
        mat.diffuseColor = color;
        box.material = mat;
        box.position = position;
        new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 1,
            friction: 0.5,
            restitution: 0.5
        })
        this.shadowGenerator.getShadowMap().renderList.push(box);
    }

    addSphere(color: BABYLON.Color3, position:BABYLON.Vector3){
        var sphere:BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {
            segments: 7,
            diameter: Math.random() * 2 + 0.4
        }, this.scene);

        var mat:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("material", this.scene);
        mat.diffuseColor = color;
        mat.specularColor = new BABYLON.Color3(0, 0, 0);
        // mat.wireframe = true;
        sphere.material = mat;
        sphere.position = position;
        new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {
            mass: 1,
            friction: 0.8,
            restitution: 0.2
        })

        // sphere.receiveShadows = true;
        this.shadowGenerator.getShadowMap().renderList.push(sphere);
        // this.fire.light.includedOnlyMeshes.push(sphere);
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