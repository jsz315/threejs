const path = require('path')
const fs = require("fs")

class FilePlugin{
    constructor(options){
        console.log("FilePlugin constructor-------------")
        console.log(options);
        options.pages.forEach(page => {
            fs.readdirSync('./dist/js').map(file=>{
                console.log(file)
                if(file.indexOf(page + ".") != -1){
                    let f = `./dist/js/${file}`;
                    fs.unlink(f, err => {
                        console.log("删除：" + f);
                    })
                }
            })
            fs.readdirSync('./dist/css').map(file=>{
                console.log(file)
                if(file.indexOf(page + ".") != -1){
                    let f = `./dist/css/${file}`;
                    fs.unlink(f, err => {
                        console.log("删除：" + f);
                    })
                }
            })
        });
        
    }
    apply(compiler){
        console.log("FilePlugin apply-------------");
        compiler.plugin("compile", ()=>{
            console.log("FilePlugin compile-------------");
        })
        compiler.plugin("compilation", (compilation)=>{
            console.log("FilePlugin compilation-------------");
            compilation.plugin("optimize", ()=>{
                console.log("FilePlugin optimize-------------");
            })
        })
        compiler.plugin("done", ()=>{
            console.log("FilePlugin done-------------");
            var ofile = path.resolve("./dist", "win.html");
            var nfile = path.resolve("./dist", "index.php");
            console.log(ofile);
            fs.copyFile(ofile, nfile, err => {
                console.log("复制文件成功")
            })
        })
    }
}

module.exports = FilePlugin;