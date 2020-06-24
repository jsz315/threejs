import Tooler from "./Tooler";

export default class Animate {
    
    //动效物体
    view:THREE.Object3D;

    //动画序列
    animations:object[];

    //当前动画序列编号
    aid:number = 0;

    //是否运动
    running:boolean;

    //运动方式
    moveType:number;

    public static ROTATE:number = 1;
    public static TRANSLATE:number = 2;

    constructor(view:THREE.Object3D){
        this.view = view;
        this.animations = [];
    }

    /**
     * 添加动画
     * @param animation 动画对象
     * @param openMode 打开模式
     */
    addAnimation(animation:any, openMode:number){

        //延迟计时器
        animation.delayStart = 0;

        //开启动效延迟时间
        animation.openDelay = animation.openDelay || 0;

        //关闭动效延迟时间
        animation.closeDelay = animation.closeDelay || 0;

        //播放时间计算动效执行总帧数
        animation.frames = animation.duration * 1000 / 40;

        //动效执行帧位置
        animation.fid = 0;

        //动效方向
        animation.dir = 1;

        //运动方式
        animation.moveType = animation.rotate ? Animate.ROTATE : Animate.TRANSLATE;

        //运动段数
        animation.parts = Animate.isPullDown(openMode) ? 4 : 2;

        this.animations.push(animation);
    }

    public static isPullDown(openMode:number){
        // return openMode <= 216 && openMode >= 213;
        return openMode <= 216 && openMode >= 209;
    }

    /**
     * 添加反向动画序列
     */
    createBack(reverse:boolean){
        let list = JSON.parse(JSON.stringify(this.animations));
        if(reverse){
            list.reverse();
            list.forEach((animation:any) => {
                this.toBackAnimation(animation);
                this.animations.push(animation);
            })
        }
        else{
            let aim:any = [];
            this.animations.forEach((animation:any) => {
                aim.push(animation);
                let temp = JSON.parse(JSON.stringify(animation));
                this.toBackAnimation(temp);
                aim.push(temp);
            })
            this.animations = aim;
        }
    }

    toBackAnimation(animation:any){
        if(animation.rotate){
            animation.rotate.angle *= -1;
        }
        if(animation.offset){
            animation.offset.x *= -1;
            animation.offset.y *= -1;
            animation.offset.z *= -1;
        }
        animation.dir = -1;
    }

    start(){
        this.running = true;
    }

    end(){
        this.running = false;
        console.log("animation end");
        window.dispatchEvent(new CustomEvent("animate"));
        // listener.emit("effect");
    }

    update(){
        if(this.running){
            var animation:any = this.animations[this.aid];

            //延迟执行
            if(animation.delayStart == 0){
                animation.delayStart = Date.now() + 200;
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

            
            if(++animation.fid < animation.frames){

                if(animation.moveType == Animate.ROTATE){
                    var r:number = animation.rotate.angle / animation.frames;
                    // if(animation.rotate.axis.x == 1){
                    //     animation.rotate.axis.x = 0;//======================
                    //     animation.rotate.axis.y = 1;//======================
                    // }
                   
                    Tooler.rotateOnAxis(this.view, animation.rotate.pivot, animation.rotate.axis, r);
                }
                else{
                    let x = this.view.position.x + animation.offset.x / animation.frames;
                    let y = this.view.position.y + animation.offset.y / animation.frames;
                    let z = this.view.position.z + animation.offset.z / animation.frames;
                    this.view.position.set(x, y, z);
                }
            }
            else{

                animation.delayStart = 0;
                animation.fid = 0;

                if(++this.aid % (this.animations.length / animation.parts) == 0){
                    // if(animation.dir == -1){
                    //     this.aid = 0;
                    // }
                    if(this.aid == this.animations.length){
                        this.aid = 0;
                    }
                    this.end();
                }
            }
        }
    }
}