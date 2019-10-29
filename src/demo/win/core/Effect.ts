import Tooler from "./Tooler";

export class Effect{

    json:any;
    parent:THREE.Object3D;
    dir:number = -1;
    positions:any;

    constructor(){
        
    }

    init(url:string, parent:THREE.Object3D){
        this.parent = parent;
        Tooler.loadData(url, (res: any) => {
            if(res){
                this.json = JSON.parse(res);
                this.positions = {};
                for(var i:number = 0; i < this.json.leafs.length; i++){
                    this.json.leafs[i].fans.forEach((item:any, index:number) => {
                        let content: THREE.Object3D = parent.getObjectByName(item.content);
                        if(content){
                            console.log("动画元素:" + item.content);
                            this.positions[item.content] = content.position.clone();
                        }
                        else{
                            console.log("无法定位动画元素:" + item.content);
                        }
                    });
                }
                console.log(this.json);
                console.log(this.positions);
            }
            else{
                (document.querySelector(".animate") as any).style.display = "none";
            }
        });

    }

    play(){
        if(!this.json){
            return;
        }

        this.dir *= -1;
        for(var i:number = 0; i < this.json.leafs.length; i++){
            this.json.leafs[i].fans.forEach((item:any, index:number) => {
                let content: THREE.Object3D = this.parent.getObjectByName(item.content);
                let offset = item.animation[0].offset;
                let rotate = item.animation[0].rotate;
                let duration = item.animation[0].duration;

                if(rotate){
                    this.rotateAnimate(content, rotate, index, duration);
                }
                else if(offset){
                    this.translateAnimate(content, offset, index, duration);
                }
            })
        }
    }

    rotateAnimate(content:THREE.Object3D, rotate:any, n:number, duration: number){
        let total = 1;
        let times = duration * 1000 / 30;
        let r = rotate.angle * this.dir / times;

        let tid = setInterval(() => {
            if(total++ <= times){
                Tooler.rotateOnAxis(content, rotate.pivot, rotate.axis, r);
            }
            else{
                clearInterval(tid);
                window.dispatchEvent(new CustomEvent("animate"));
                if(this.dir == -1){
                    let p = this.positions[content.name];
                    content.position.set(p.x, p.y, p.z);
                    console.log(content.position);
                }
            }
        }, 30)
    }

    translateAnimate(content:THREE.Object3D, offset:any, n:number, duration: number){
        let total = 1;
        let times = duration * 1000 / 30;

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
                    let p = this.positions[content.name];
                    content.position.set(p.x, p.y, p.z);
                    console.log(content.position);
                }
            }
        }, 30)
    }

}