import Tooler from "./Tooler";

export class Effect{

    json:any;
    parent:THREE.Object3D;
    dir:number = -1;
    positions:Array<THREE.Vector3>;

    constructor(){
        
    }

    init(url:string, parent:THREE.Object3D){
        this.parent = parent;
        Tooler.loadData(url, (res: any)=>{
            this.json = JSON.parse(res);
            this.positions = [];
            this.json.leafs[0].fans.forEach((item:any, index:number) => {
                let content: THREE.Object3D = this.parent.getObjectByName(item.content);
                this.positions.push(content.position);
            });
            console.log(this.json);
        });
    }

    play(){
        if(!this.json){
            return;
        }

        this.dir *= -1;
        this.json.leafs[0].fans.forEach((item:any, index:number) => {
            let content: THREE.Object3D = this.parent.getObjectByName(item.content);
            let offset = item.animation[0].offset;
            let rotate = item.animation[0].rotate;
            let duration = item.animation[0].duration * 1000;

            if(rotate){
                this.rotateAnimate(content, rotate, index, duration);
            }
            else if(offset){
                this.translateAnimate(content, offset, index, duration);
            }
        })
    }

    rotateAnimate(content:THREE.Object3D, rotate:any, n:number, duration: number){
        let total = 1;
        let times = duration / 30;
        let r = rotate.angle * this.dir / times;

        let tid = setInterval(() => {
            if(total++ <= times){
                Tooler.rotateOnAxis(content, rotate.pivot, rotate.axis, r);
            }
            else{
                clearInterval(tid);
                window.dispatchEvent(new CustomEvent("animate"));
                if(this.dir == -1){
                    content.position.set(this.positions[n].x, this.positions[n].y, this.positions[n].z);
                }
            }
        }, 30)
    }

    translateAnimate(content:THREE.Object3D, offset:any, n:number, duration: number){
        let total = 1;
        let times = duration / 30;

        let tid = setInterval(() => {
            if(total++ <= times){
                let x = content.position.x + offset.x / times * this.dir;
                let y = content.position.y + offset.y / times * this.dir;
                let z = content.position.z + offset.z / times * this.dir;

                content.position.set(x, y, z);
            }
            else{
                clearInterval(tid);
                window.dispatchEvent(new CustomEvent("animate"));
                if(this.dir == -1){
                    content.position.set(this.positions[n].x, this.positions[n].y, this.positions[n].z);
                }
            }
        }, 30)
    }

}