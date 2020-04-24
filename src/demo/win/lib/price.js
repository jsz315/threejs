import axios from "axios";
import Tooler from '../core/Tooler'
import listener from "./listener"

async function getList(){
    return new Promise(async resolve=>{
        let u = Tooler.getQueryString("u");
        if(!u){
            resolve();
        }
        
        var temp = u.split("-");
        let id = temp.pop();
        let sourcetype = temp.pop();
    
        let host = getHost();
        let res;
        if(isERP()){
            res = await axios({
                url: host + "/api/index/modelPrice",
                method: 'post',
                data: {
                    type: sourcetype,
                    id: id,
                    v: Math.random()
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        }
        else{
            res = await axios.get(host + "/mapi/index.php", {
                params: {
                    app: "modelshow",
                    fnn: "modelDetailById",
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
                
                await getItem(item);
                if(item.show_offer == 2){
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
        var host = getHost();
        var path = isERP() ? "json/" : "upload";
        var url = host + '/data/' + path + obj.plan_path + "/" + obj.pricejson_file + "?v=" + Math.random();
        console.log(url);
        let res = await axios.get(url);
        var data = res.data;
        console.log(data);
        obj.area = data.acreage;
        obj.price = data.amount || 0;
        obj.discount = isERP() ? data.items[0].discount : data.items[0].tmpDiscount;     
        obj.count = data.items[0].count;           
        obj.all = obj.count * obj.price * obj.setnum;
        obj.size = [data.length, data.height, data.width].join(" x ");
        obj.items = data.items;
        obj.seriesName = data.seriesName;

        listener.emit('colorMap', !data.multiColor);
        // listener.emit("colorMap", this.isSingleColor);

        resolve();
    });
}


export default {
    getList,
    getItem,
    getHost,
    isERP
}