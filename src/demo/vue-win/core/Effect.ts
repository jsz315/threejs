import Tooler from "./Tooler";
import Animate from "./Animate";
import Cache from "./Cache";

export class Effect{

    json:any;
    parent:THREE.Object3D;
    dir:number = -1;
    positions:any;
    animates:Animate[] = [];

    constructor(){
        
    }

    update(){
        this.animates && this.animates.forEach((animate:Animate) => {
            animate.update();
        });
    }

    setData():void{
        this.positions = {};

        let animateList1:any = [];
        let animateList2:any = [];
        let views:any = [];

        for(var i:number = 0; i < this.json.leafs.length; i++){
            this.json.leafs[i].fans.forEach((item:any, index:number) => {
                let content: THREE.Object3D = this.parent.getObjectByName(item.content);
                if(content && views.indexOf(content) == -1){
                    views.push(content);
                    // console.log("动画元素:" + item.content);
                    this.positions[item.content] = content.position.clone();

                    let animate = new Animate(content);
                    item.animation.forEach((m:any)=>{
                        animate.addAnimation(m, item.openMode);
                    })
                    
                    if(item.openMode == 666){
                        animateList1.push(animate);
                        animate.createBack(true);
                    }
                    else if(Animate.isPullDown(item.openMode)){
                        animateList2.push(animate);
                        animate.createBack(false);
                    }
                    else{
                        animateList2.push(animate);
                        animate.createBack(true);
                    }
                }
                else{
                    // console.log("无法定位动画元素:" + item.content);
                }
            });

        }

        // console.log("动画解析");

        // this.animates = animateList1.concat(animateList2);
        this.animates = this.animates.concat(animateList1, animateList2);
        // console.log(this.animates);

        // Cache.getInstance().setAnimate(url, this.animates);
    }

    init(url:string, parent:THREE.Object3D){
        this.parent = parent;

        var json = Cache.getInstance().getAnimate(url);
        if(json){
            this.json = json;
            this.setData();
            return;
        }

        Tooler.loadData(url, (res: any) => {
            if(res){
                this.json = JSON.parse(res);
                this.setData();
                Cache.getInstance().setAnimate(url, this.json);
            }
            else{
                // (document.querySelector(".animate") as any).style.display = "none";
                console.log("无法解析动画数据" + url);
            }
        });

    }

    play(){
        this.animates.forEach((animate:Animate) => {
            animate.start();
        });
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
                    // content.position.set(p.x, p.y, p.z);
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
                    // content.position.set(p.x, p.y, p.z);
                    console.log(content.position);
                }
            }
        }, 30)
    }

}