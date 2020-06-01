import * as THREE from 'three'
import { MapView } from './MapView';
import { DirectionalLightHelper } from 'three';

export class StageView extends THREE.Object3D{
    mapView:MapView;

    constructor(){
        super();

        this.init();
        this.addLight();
    }

    addLight(){
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.add(ambientLight);

        var obj = new THREE.Object3D();
        obj.position.set(7, 0, 6);
        this.add(obj);

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.add(directionalLight);
        directionalLight.position.set(4, 10, 4);
        directionalLight.castShadow = true;
		directionalLight.shadow.camera.left = -60;
		directionalLight.shadow.camera.top = -60;
		directionalLight.shadow.camera.right = 60;
		directionalLight.shadow.camera.bottom = 60;
		directionalLight.shadow.camera.near = 1;
		directionalLight.shadow.camera.far = 200;
		directionalLight.shadow.bias = -.0004;
		directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024;
        
        directionalLight.target = obj;

        // var helper = new DirectionalLightHelper(directionalLight);
        // setTimeout(() => {
        //     helper.update();
        // }, 2000);
        
        // this.add(helper);
        // console.log(directionalLight, 'directionalLight');
    }

    init(){
        this.mapView = new MapView();
        this.add(this.mapView);
    }

    getViews(){
        return this.mapView.meshes;
    }

}