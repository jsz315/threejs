import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 

export class Core {
    private static _instance: Core;

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;

    constructor() {

    }

    public static get instance(): Core {
        if (this._instance == null) {
            this._instance = new Core();
        }
        return this._instance;
    }
}