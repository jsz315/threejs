import * as THREE from 'three'
import { MapView } from './MapView';

export class StageView extends THREE.Object3D{
    mapView:MapView;

    constructor(){
        super();

        this.init();
        this.addLight();
    }

    addLight(){
        var ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.add(ambientLight);
    }

    init(){
        this.mapView = new MapView();
        this.add(this.mapView);
    }

    getViews(){
        return this.mapView.meshes;
    }

}