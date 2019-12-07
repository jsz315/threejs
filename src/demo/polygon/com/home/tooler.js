function computeShape(type, list) {
    // var subj = getAimList(list[0]);
    // var clip = getAimList(list[1]);

    var solution = new ClipperLib.Paths();
    var c = new ClipperLib.Clipper();
    for(let i = 0; i < list.length; i++){
        let obj = getAimList(list[i]);
        if(i == 0){
            c.AddPaths(obj, ClipperLib.PolyType.ptSubject, true);
        }
        else{
            c.AddPaths(obj, ClipperLib.PolyType.ptClip, true);
        }
    }

    var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
    var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
    
    c.Execute(ClipperLib.ClipType[type], solution, subject_fillType, clip_fillType);
    let str = JSON.stringify(solution).toLowerCase();
    console.log("solution", solution);
    console.log(str);
    return eval(str);
}

function getAimList(pots) {
    let aim = pots.map(list=>{
        return list.map(item => {
            return {
                X: item.x,
                Y: item.y
            }
        })
    })
    return aim;
}

export default {
    computeShape
}