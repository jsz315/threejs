import * as THREE from 'three'

export default class Tooler{

    public static getVector3(points:string, type:number):Array<THREE.Vector3>{
        var list:Array<THREE.Vector3> = [];
        // points = points.replace(/\s/g, "");
        var ps:Array<string> = points.split(",");
        var total:number = ps.length;
        if(total % type == 0 && total > 0){
            for(var i:number = 0; i < total; i += type){
                var point:THREE.Vector3 = new THREE.Vector3(Number(ps[i]), Number(ps[i + 1]), type == 3 ? Number(ps[i + 2]) : 0);
                list.push(point);
            }
            return list;
        }
        else{
            alert(`顶点应该为${type}的倍数`);
            return null;
        }
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

    public static getBoxSize(obj: THREE.Object3D):number{
        let box = new THREE.Box3().setFromObject(obj);
        console.log(box, 'box');
        let size = box.getSize(new THREE.Vector3());
        let num = Math.max(size.x, size.y, size.z);
        return num;
    }

    public static getMaxSize(obj: THREE.Object3D):number{
        let box = new THREE.Box3().setFromObject(obj);
        var x1 = Math.abs(box.min.x);
        var y1 = Math.abs(box.min.y);
        var z1 = Math.abs(box.min.z);
        var x2 = Math.abs(box.max.x);
        var y2 = Math.abs(box.max.y);
        var z2 = Math.abs(box.max.z);
        var max = Math.max(x1, y1, z1, x2, y2, z2);
        return max;

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