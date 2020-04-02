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
        let res;
        let host = getHost();
        if(isERP()){
            res = await axios.get(host + "/api/index/modelPrice", {
                params: {
                    type: sourcetype,
                    id: id,
                    v: Math.random()
                }
            });
        }
        else{
            res = await axios.get(host + "/mapi/index.php", {
                params: {
                    app:"modelshow",
                    fnn:"modelDetailById",
                    sourcetype: sourcetype,
                    yun3d_id: id,
                    v: Math.random()
                }
            });
        }
    
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
                if(item.show_offer == 2){
                    await getItem(item);
                    list.push(item);
                }
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

function isERP(){
    if(location.search.indexOf('3d.mendaow.com') != -1 || location.search.indexOf('3d.mendaoyun.com') != -1){
        return false;
    }
    return true;
}

function getHost(){
    return location.search.match(/http.*?.com/)[0];
}

async function getItem(obj){
    return new Promise(async resolve=>{
        // var host = Tooler.isTest() ? 'http://3d.mendaow.com' : 'https://3d.mendaoyun.com';
        var host = getHost();

        var url = host + '/data/upload' + obj.plan_path + "/" + obj.pricejson_file + "?v=" + Math.random();
        console.log(url);
        let res = await axios.get(url);
        var data = res.data;
        console.log(data);
        obj.area = data.acreage;
        obj.price = data.cost;
        obj.count = data.items[0] ? data.items[0].discount : 1;           
        obj.all = obj.count * obj.price * obj.setnum;
        obj.size = [data.length || 1, data.height || 1, data.width || 1].join(" x ");
        obj.items = data.items;
        resolve();
    });
}


export default {
    getList,
    getItem
}