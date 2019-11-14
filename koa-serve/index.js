const path = require("path")
const Koa = require('koa')
// const multer = require('koa-multer')
const Router = require('koa-router')
const cors = require('koa-cors')
const static = require('koa-static')
const bodyparser = require('koa-bodyparser')
const request = require('request')
const koaBody = require('koa-body')
const fs = require('fs')
const dirTooler = require("./tooler/dirTooler");
const downloadTooler = require("./tooler/downloadTooler");

const app = new Koa()
const router = new Router()
const UPLOAD_PATH = path.join(__dirname, '../static/upload/glb')

// async function test(){
//     let url = "http://3d.mendaow.com/data/rendering_small.gif";
//     await downloadTooler.start(url);
//     console.log("下载成功")
// }

// test();

// init("0.0.0.0", 8899);
init(getIPAddress(), 8899);

function init(host, port) {

	app.use(cors({
		origin: function (ctx) {
			return "*";
		},
		exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
		maxAge: 5
    }))
    
    // app.use(bodyparser());
    app.use(koaBody({
        multipart: true,
        formidable: {
            maxFileSize: 3000 * 1024 * 1024,
            multipart: true
        }
    }))

    app.use(router.routes(), router.allowedMethods())

    app.use(static(
		path.join(__dirname, '../static')
	))

	// const storage = multer.diskStorage({
	// 	destination: function (req, file, cb) {
	// 		cb(null, path.join(__dirname, '../static/upload'))
	// 	},
	// 	filename: function (req, file, cb) {
	// 		cb(null, file.originalname);
	// 	}
	// })

	// var upload = multer({
	// 	storage: storage
    // });
    
    // router.post('/upload', upload.single("file"), async (ctx, next) => {
	// 	ctx.body = {
    //         filename: ctx.req.file.name
    //     }
	// })

	router.post('/upload', async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        const file = ctx.request.files.file;
		const reader = fs.createReadStream(file.path);
		const id = file.name.split(".")[0];
		const folder = `${UPLOAD_PATH}/${id}`;
		let filePath = `${folder}/${file.name}`;
		dirTooler.mkdirsSync(folder);
        const upStream = fs.createWriteStream(filePath);
        reader.pipe(upStream);

        let assets = ctx.request.body.assets;
        if(assets){
            let list = assets.split(";")
            list.forEach(item => {
                downloadTooler.start(item, folder);
            })
        }
        
		ctx.body = '{"code":200,"datas":"保存成功"}';
	})
	
	
	router.get("/abc", async (ctx, next) => {
		ctx.body = "hello";
	})

	router.post("/imgs", async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        console.log(ctx.request);
		let params = ctx.request.body.params;
		console.log(params);
		ctx.body = "save success";
	})

    app.listen(port, host)
    console.log(`http://${host}:${port}`);
}

function getIPAddress() {
	const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址
	let IPAddress = '127.0.0.1';
	for (var devName in interfaces) {
		var iface = interfaces[devName];
		for (var i = 0; i < iface.length; i++) {
			var alias = iface[i];
			if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
				IPAddress = alias.address;
			}
		}
	}
	return IPAddress;
}







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
