const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob')
const axios = require('axios');

// let url = "http://192.168.21.40:8000/win.html";
let url = "http://3d.mendaow.com/api/window_library/sysdiss";
axios.post(url, {
    id: 20777
}).then(res=>{
    console.log(res);
}).catch(err=>{
    console.log(err);
})

// fs.readdirSync('./dist/js').map(file=>{
//     console.log(file)
//     if(file.indexOf("win.") != -1){
//         let f = `./dist/js/${file}`;
//         fs.unlink(f, err => {
//             console.log("删除：" + f);
//         })
//     }
// })

/*
const walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = path.join(dir, file)
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()){
            results = results.concat(walk(file))
        }
        else{
            results.push(file)
        }
    })
    return results
}

const getApps = function(app){
    const list = walk(path.join(__dirname, 'src'))
    const r = new RegExp("src\\\\.*" + app)
    let aim = []
    list.forEach(item => {
        var match = r.exec(item);
        if(match){
            if(aim.indexOf(match[0]) == -1){
                aim.push(match[0])
            }
        }
    })

    if(aim.length == 0){
        throw new Error("没有找到项目")
    }
    aim = aim.map(item => {
        return "./" + item.replace(/\\/g,"/")
    })
    return aim
}

const getEntry = function(apps){
    var obj = {};
    apps.forEach(item => {
        var key = item.split("/").pop()
        obj[key] = item + "/index.js"
    })
    return obj
}

const getHtml = function(apps){
    return apps.map(item => {
        var key = item.split("/").pop()
        return new HtmlWebpackPlugin({
            filename: `${key}.html`,
            template: item + `/index.html`
        })
    })
}

const apps = getApps(process.argv[process.argv.length - 1])
const global = {
    entry: getEntry(apps),
    html: getHtml(apps)
}

console.log(global)
*/

["http://3d.mendaoyun.com/data/upload/model_store/125/15069/a3d/15069.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/15058/a3d/15058.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/MPD0011068/a3d/MPD0011068.a3d", "http://3d.mendaoyun.com/data/upload/model_my/11829/18294/a3d/18294.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/TBB0015086/a3d/TBB0015086.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/TBM0013284/a3d/TBM0013284.a3d", "http://3d.mendaoyun.com/data/upload/model_store/272/TYY0012779/a3d/TYY0012779.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/TBB0015087/a3d/TBB0015087.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/TLH0015093/a3d/TLH0015093.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/TLL0015074/a3d/TLL0015074.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/JZC0015080/a3d/JZC0015080.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/JZC0015081/a3d/JZC0015081.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/JZC0015079/a3d/JZC0015079.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/JZC0015082/a3d/JZC0015082.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/JZJ0013373/a3d/JZJ0013373.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/JZJ0014436/a3d/JZJ0014436.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/DDJ0015097/a3d/DDJ0015097.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/DDZ0013045/a3d/DDZ0013045.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/JJJ0012241/a3d/JJJ0012241.a3d", "http://3d.mendaoyun.com/data/upload/model_store/125/JZC0013062/a3d/JZC0013062.a3d"]