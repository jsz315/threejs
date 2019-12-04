import './index.less'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import Vue from 'vue'
import axios from "axios";
import Home from "./com/home/index.vue"
import {
    Toast
} from 'mint-ui';

Vue.use(MintUI)

Vue.prototype.$toast = (tip) => {
    Toast({
        message: tip,
        position: 'top',
        duration: 2000
    });
}

Vue.prototype.$get = (url, param) => {
    return axios.get(url, {
        params: param
    });
}

Vue.prototype.$post = (url, param, isForm = true) => {
    let data;
    if (isForm) {
        data = new FormData();
        for (let i in param) {
            data.append(i, param[i]);
        }
    } else {
        data = param;
    }
    return axios.post(url, data);
}

new Vue({
    render: h => h(Home)
}).$mount("#home");

// import App from'./App'

// let app = new App();
// app.setup();

window.onload = function () {
    draw();
}

function draw() {
    var subj_paths = [
        [{
            X: 10,
            Y: 10
        }, {
            X: 110,
            Y: 10
        }, {
            X: 110,
            Y: 110
        }, {
            X: 10,
            Y: 110
        }],
        [{
            X: 20,
            Y: 20
        }, {
            X: 20,
            Y: 100
        }, {
            X: 100,
            Y: 100
        }, {
            X: 100,
            Y: 20
        }]
    ];
    var clip_paths = [
        [{
            X: 50,
            Y: 50
        }, {
            X: 150,
            Y: 50
        }, {
            X: 150,
            Y: 150
        }, {
            X: 50,
            Y: 150
        }],
        [{
            X: 60,
            Y: 60
        }, {
            X: 60,
            Y: 140
        }, {
            X: 140,
            Y: 140
        }, {
            X: 140,
            Y: 60
        }]
    ];
    var scale = 100;
    ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
    ClipperLib.JS.ScaleUpPaths(clip_paths, scale);
    var cpr = new ClipperLib.Clipper();
    cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
    var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
    var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
    var clipTypes = [ClipperLib.ClipType.ctUnion, ClipperLib.ClipType.ctDifference, ClipperLib.ClipType.ctXor, ClipperLib.ClipType.ctIntersection];
    var clipTypesTexts = "Union, Difference, Xor, Intersection";
    var solution_paths, canvas_str, canvas, ctx, desc = document.getElementById('desc'),
        i, i2, j, x, y;
    for (i = 0; i < clipTypes.length; i++) {
        solution_paths = new ClipperLib.Paths();
        cpr.Execute(clipTypes[i], solution_paths, subject_fillType, clip_fillType);
        //console.log(JSON.stringify(solution_paths));
        canvas = document.getElementById("canvas" + i);
        canvas.width = canvas.height = 160;
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "red";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (i2 = 0; i2 < solution_paths.length; i2++) {
            for (j = 0; j < solution_paths[i2].length; j++) {
                x = solution_paths[i2][j].X / scale;
                y = solution_paths[i2][j].Y / scale;
                if (!j) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        }
        ctx.fill();
        ctx.stroke();
    }
    desc.innerHTML = clipTypesTexts;
}

function Main()
{
    var subj = [[{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}]]; 
    var clip = [[{X:50,Y:50},{X:150,Y:50},{X:150,Y:150},{X:50,Y:150}]];
//   DrawPolygons(subj, 0x8033FFFF);
//   DrawPolygons(clip, 0x80FFFF33);

  var solution = new ClipperLib.Paths();
  var c = new ClipperLib.Clipper();
  c.AddPaths(subj, ClipperLib.PolyType.ptSubject, true);
  c.AddPaths(clip, ClipperLib.PolyType.ptClip, true);
//   c.Execute(ClipperLib.ClipType.ctUnion, solution);
  c.Execute(ClipperLib.ClipType.ctDifference, solution);

//   DrawPolygons(solution, 0x40808080);

  console.log("solution", solution);
  console.log(JSON.stringify(solution));
    
}



Main();