const path = require("path")
// const Koa = require('koa')
// const multer = require('koa-multer')
// const Router = require('koa-router')
// const cors = require('koa-cors')
// const static = require('koa-static')
// const bodyparser = require('koa-bodyparser')
// const request = require('request')

const dirTooler = require("./tooler/dirTooler");
const downloadTooler = require("./tooler/downloadTooler");

// let fname = path.resolve(__dirname, "../static/upload/glb/m456");
// console.log(fname);
// dirTooler.mkdirsSync(fname);
// console.log("ok");

async function test(){
    let url = "http://3d.mendaow.com/data/rendering_small.gif";
    await downloadTooler.start(url);
    console.log("下载成功")
}

test();

// yarn add koa koa-router koa-body koa-send koa-multer koa-cors koa-static koa-bodyparser request vue vue-loader vue-template-compiler vuex vue-router
// yarn add babylonjs 

/*
本地链接 IPv6 地址:	fe80::342c:4604:c3d1:992f%10
IPv4 地址:	192.168.21.40
IPv4 DNS 服务器:	192.168.20.2
制造商:	Realtek
描述:	Realtek PCIe GbE Family Controller
驱动程序版本:	10.31.828.2018
物理地址(MAC):	00-CF-E0-53-54-4F
*/
