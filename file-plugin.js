const path = require('path')
const fs = require("fs")
const global = require('./global')

class FilePlugin{
    constructor(options){
        console.log("FilePlugin constructor-------------")
        console.log(options);
        this.app = options.pages[0];
        options.pages.forEach(page => {
            mkdirsSync('./dist/js');
            mkdirsSync('./dist/css');
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
            console.log("FilePlugin done-------------" + this.app);
            var ofile = path.resolve("./dist", this.app + ".html");
            var file1 = path.resolve("./dist", "index.php");
            var file2 = path.resolve("./dist", "index.html");
            fs.copyFile(ofile, file1, err => {
                console.log("复制文件成功")
            })
            fs.copyFile(ofile, file2, err => {
                console.log("复制文件成功")
            })
        })
    }
}

function mkdirsSync(dirname){
    if(fs.existsSync(dirname)){
        return true;
    }
    else{
        if(mkdirsSync(path.dirname(dirname))){
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

module.exports = FilePlugin;