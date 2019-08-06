module.exports = {
    //文件地址
    cdnDomain: "//yun.dui88.com/",
    //代理服务器
    server: "kjj.m.duibatest.com.cn",
    //端口
    port: 3000,
    // 开发环境
    dev: {
        // 单引号不能少
        PATH: JSON.stringify("/mock"),
        MOCK: true,
        PROXY: false
    },
    // 生产环境
    prod: {
        // 单引号不能少
        PATH: JSON.stringify(""),
        MOCK: false,
        PROXY: false
    }
}
