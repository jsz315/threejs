import * as THREE from 'three'

export default class Tooler{

    public static getVector3(points:string):Array<THREE.Vector3>{
        var list:Array<THREE.Vector3> = [];
        points = points.replace(/\s/g, "");
        var ps:Array<string> = points.split(",");
        var total:number = ps.length;
        if(total % 3 == 0 && total > 0){
            for(var i:number = 0; i < total; i += 3){
                var point:THREE.Vector3 = new THREE.Vector3(Number(ps[i]), Number(ps[i + 1]), Number(ps[i + 2]));
                list.push(point);
            }
        }
        return list;
    }

    public static getPoints(ps: Array<THREE.Vector3>):Array<THREE.Mesh>{
        var list:Array<THREE.Mesh> = [];
        var total:number = ps.length;
        var mat: THREE.MeshNormalMaterial = new THREE.MeshNormalMaterial();
        for(var i:number = 0; i < total; i++){
            var mesh:THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(), mat);
            mesh.position.copy(ps[i]);
            list.push(mesh);
        }
        return list;
    }


    public static getLines(points: Array<THREE.Vector3>):THREE.Line{
        var geometry = new THREE.Geometry();
        var total:number = points.length;
        for(var i:number = 0; i < total; i++){
            geometry.vertices.push(points[i]);
        }
        return new THREE.Line(geometry, new THREE.MeshNormalMaterial());
    }

    public static getBoxSize(obj: THREE.Object3D):THREE.Vector3{
        let box = new THREE.Box3().setFromObject(obj);
        let size = box.getSize(new THREE.Vector3());
        return size;
    }

    public static checkMobile():boolean{
        let list = ["Android", "iPhone", "iPad"];
        let res = list.find(item => {
            if(navigator.userAgent.indexOf(item) != -1){
                return true;
            }
        })
        return !!res;
    }
}