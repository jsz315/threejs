export default class Sprite{

    constructor(ctx, list){
        this.ctx = ctx;
        this.bound = getBound(list);
        this.x = this.bound.minX;
        this.y = this.bound.minY;
        this.pots = resetPots(list, this.x, this.y);

        this.fillStyle = "#ff0000";
        this.strokeStyle = "#000000";
        this.lineWidth = 1;
        this.globalAlpha = 0.72;
        this.selected = false;

        // this.globalCompositeOperation = 'destination-out'; 

        this.draw();
    }

    checkHit(px, py){
        if(px > this.x && px < this.x + this.bound.width){
            if(py > this.y && py < this.y + this.bound.height){
                return true;
            }
        }
        return false;
    }

    getList(){
        let list = this.pots.map(item => {
            return {
                x: item.x + this.x,
                y: item.y + this.y
            }
        })
        return list;
    }

    draw(){
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.globalAlpha = this.globalAlpha;
        this.ctx.beginPath();
        for(let i = 0; i < this.pots.length; i++) {
            let x = this.pots[i].x;
            let y = this.pots[i].y;
            if (!i) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        if(this.selected){
            this.ctx.strokeRect(0, 0, this.bound.width, this.bound.height);
        }

        this.ctx.restore();
    }
}

function resetPots(list, x, y){
    return list.map(item => {
        return {
            x: item.x - x,
            y: item.y - y
        }
    });
}

function getBound(list){
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    

    list.forEach(item => {
        if(item.x < minX){
            minX = item.x;
        }
        if(item.x > maxX){
            maxX = item.x;
        }

        if(item.y < minY){
            minY = item.y;
        }
        if(item.y > maxY){
            maxY = item.y;
        }
    })

    let width = maxX - minX;
    let height = maxY - minY;

    return {minX, minY, maxX, maxY, width, height};
}