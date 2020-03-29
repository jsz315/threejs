const path = require('path')
const fs = require('fs')

const app = process.argv[process.argv.length - 1];
const dir = path.join('./src/demo/', app);
const glob = require('glob');
const entryFiles = glob.sync(dir + '/**/*.less');

console.log(entryFiles);


// entryFiles.forEach(item => {
//     var odata = fs.readFileSync(item, 'utf8');
//     var ndata = odata.replace(/com.mdwg./g, "com.mface.");
//     fs.writeFileSync(item, ndata, "utf8");
//     console.log("替换成功" + item.split("MDFace").pop());
// })
// console.log("处理文件总数：" + entryFiles.length);

// var list = walk('./src/demo/' + app + '/');
// console.log(list);

// list.forEach(item => {
// 	replace(item);
// })

function walk(dir) {
	var results = []
	var list = fs.readdirSync(dir)
	list.forEach(function (file) {
		file = path.join(dir, file)
		var stat = fs.statSync(file)
		if (stat && stat.isDirectory()) {
			results = results.concat(walk(file))
		} else {
			if (file.match(/\.less$/)) {
				results.push(file)
			}

		}
	})
	return results;
}

function replace(file){

}