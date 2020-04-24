import * as THREE from 'three'
import Tooler from '../Tooler'

export default class FitSize{

    constructor(){
        
    }

    static resize(model: THREE.Object3D, max:number){
        let scale: number = Tooler.getFitScale(model, max);
        model.scale.multiplyScalar(scale);
        console.log(scale, 'scale');
        console.log(model);

        let offset: THREE.Vector3 = Tooler.getOffsetVector3(model);
        console.log("model center position", offset);
        model.position.set(
            model.position.x - offset.x,
            model.position.y - offset.y,
            model.position.z - offset.z,
        )
        
    }
}