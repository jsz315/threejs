import Tooler from "./Tooler";

export default class Animate {
    
    view:THREE.Object3D;
    animations:object[];
    running:boolean;
    aid:number = 0;
    moveType:number;

    public static ROTATE:number = 1;
    public static TRANSLATE:number = 2;

    constructor(view:THREE.Object3D){
        this.view = view;
        this.animations = [];
    }

    addAnimation(animation:any){
        animation.delayStart = 0;

        animation.openDelay = animation.openDelay || 0;
        animation.closeDelay = animation.closeDelay || 0;
        animation.times = animation.duration * 1000 / 40;
        animation.tid = 0;
        animation.dir = 1;
        animation.moveType = animation.rotate ? Animate.ROTATE : Animate.TRANSLATE;
        this.animations.push(animation);
    }

    createBack(){
        let list = JSON.parse(JSON.stringify(this.animations));
        list.reverse();
        list.forEach((animation:any) => {
            if(animation.rotate){
                animation.rotate.angle *= -1;
            }
            if(animation.offset){
                animation.offset.x *= -1;
                animation.offset.y *= -1;
                animation.offset.z *= -1;
            }
            animation.dir = -1;
            this.animations.push(animation);
        })
    }

    start(){
        this.running = true;
    }

    end(){
        this.running = false;
        console.log("animation end");
        window.dispatchEvent(new CustomEvent("animate"));
    }

    update(){
        if(this.running){
            var animation:any = this.animations[this.aid];

            if(animation.delayStart == 0){
                animation.delayStart = Date.now();
                return;
            }

            if(animation.dir == 1){
                if(Date.now() - animation.delayStart < animation.openDelay * 1000){
                    return;
                }
            }
            else{
                if(Date.now() - animation.delayStart < animation.closeDelay * 1000){
                    return;
                }
            }

            if(++animation.tid < animation.times){
                if(animation.moveType == Animate.ROTATE){
                    var r:number = animation.rotate.angle / animation.times;
                    Tooler.rotateOnAxis(this.view, animation.rotate.pivot, animation.rotate.axis, r);
                }
                else{
                    let x = this.view.position.x + animation.offset.x / animation.times;
                    let y = this.view.position.y + animation.offset.y / animation.times;
                    let z = this.view.position.z + animation.offset.z / animation.times;
                    this.view.position.set(x, y, z);
                }
            }
            else{
                animation.delayStart = 0;
                animation.tid = 0;
                if(++this.aid % (this.animations.length / 2) == 0){
                    if(animation.dir == -1){
                        this.aid = 0;
                    }
                    this.end();
                }
            }
        }
    }
}