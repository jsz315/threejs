import axios from "axios";
import Tooler from '../core/Tooler'

async function getList(){
    return new Promise(async resolve=>{
        let u = Tooler.getQueryString("u");
        if(!u){
            resolve();
        }
        
        var temp = u.split("-");
        let id = temp.pop();
        let sourcetype = temp.pop();
    
        let link = "/mapi/index.php";
        let res = await axios.get(link, {
                params: {
                    app:"modelshow",
                    fnn:"modelDetailById",
                    sourcetype: sourcetype,
                    yun3d_id:id
                }
            });
    
        console.log(res);
        if (res.data && res.data.code == 200) {
            var list = [];
            for(var i in res.data.datas){
                var item = res.data.datas[i];
                item.price = '-';
                item.count = '-';
                item.area = '-';
                item.all = '-';
                item.size = '-';
                await getItem(item);
                list.push(item);
            }

            var totalNum = 0;
            var totalArea = 0;
            var totalPrice = 0;
            list.forEach(item=>{
                totalNum += item.setnum;
                totalArea += item.area;
                totalPrice += item.all;
            })
            resolve({
                list, totalNum, totalArea, totalPrice
            })
        }
        resolve();
    })
}

async function getItem(obj){
    return new Promise(async resolve=>{
        var host = Tooler.isTest() ? 'http://3d.mendaow.com' : 'https://3d.mendaoyun.com';
        var url = host + '/data/upload' + obj.plan_path + "/" + obj.pricejson_file;
        console.log(url);
        let res = await axios.get(url);
        var data = res.data;
        console.log(data);
        obj.area = data.acreage;
        obj.price = data.price;
        obj.count = data.items[0].discount;           
        obj.all = obj.count * obj.price * obj.setnum;
        obj.size = [data.length, data.height, data.width].join(" x ");
        obj.items = data.items;
        resolve();
    });
}


export default {
    getList,
    getItem
}