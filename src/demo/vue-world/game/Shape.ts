import * as THREE from 'three'
import Tooler from './Tooler';

export class Shape extends THREE.Group{

    list:Array<THREE.Vector3>;
    line:THREE.Line;
    points:Array<THREE.Mesh>;
    container:THREE.Object3D;
    
    constructor(pointStr:string, type:number){
        super();

        this.container = new THREE.Object3D();
        this.add(this.container);

        var list:Array<THREE.Vector3> = Tooler.getVector3(pointStr, type);
        if(list.length > 0){
            this.points = Tooler.getPoints(list);
            for(var i:number = 0; i < this.points.length; i++){
                this.points[i].name = 'point';
                this.container.add(this.points[i]);
            }
            if(list.length > 1){
                this.line = Tooler.getLines(list);
                this.add(this.line);
            }
        }
        this.list = list;
    }

    changeLineColor(color:string){
        this.line.material = new THREE.MeshBasicMaterial({color: new THREE.Color(color)});
    }

}