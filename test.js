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