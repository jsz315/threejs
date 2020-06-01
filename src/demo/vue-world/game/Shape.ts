import * as THREE from 'three'
import Tooler from './Tooler';

export class Shape extends THREE.Group{
    list:Array<THREE.Vector3>;
    line:THREE.Line;
    
    constructor(points:string){
        super();

        var list:Array<THREE.Vector3> = Tooler.getVector3(points);
        if(list.length > 0){
            var ps:Array<THREE.Mesh> = Tooler.getPoints(list);
            for(var i:number = 0; i < ps.length; i++){
                this.add(ps[i]);
            }
            if(list.length > 1){
                this.line = Tooler.getLines(list);
                this.add(this.line);
            }
        }
        this.list = list;
            
    }

}