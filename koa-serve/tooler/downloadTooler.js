const fs = require('fs')
const axios = require('axios')

async function start(url, folder){
    let name = folder + "/" + url.split("/").pop()
    const writer = fs.createWriteStream(name)
    const res = await axios({
        url,
        method: "GET",
        responseType: "stream"
    })
    res.data.pipe(writer);
    return new Promise((resolve, reject)=>{
        writer.on("finish", resolve);
        writer.on("error", reject);
    })
}

module.exports = {
    start
}