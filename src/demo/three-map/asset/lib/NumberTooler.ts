export class NumberTooler{

    /**
     * 2进制字符串转16进制字符串，结果不带0x
     * @param str 
     */
    static string2T16(str:string):string{
        var n = parseInt(str, 2);
        return n.toString(16);
    }

    /**
     * 16进制字符串转2进制字符串
     * @param str 
     */
    static string16T2(str:string):string{
        var reg = /0x/i;
        if(!reg.test(str)){
            str = "0x" + str;
        }
        return Number(str).toString(2);
    }

    /**
     * 自动补0字符串
     * @param str 需要补0的字符串
     * @param total 需要返回的总长度
     */
    static addZero(str:string, total:number):string{
        var list = [];
        for(var i = 0; i < total; i++){
            list.push(0);
        }
        return (list.join("") + str).substr(-total);
    }

    /**
     * 编码起始点位置
     * @param start 起点
     * @param end 终点
     */
    static encodeMap(start:any, end:any):number{
        var list = [];
        list.push(NumberTooler.addZero(start.row + "", 2));
        list.push(NumberTooler.addZero(start.col + "", 2));
        list.push(NumberTooler.addZero(end.row + "", 2));
        list.push(NumberTooler.addZero(end.col + "", 2));
        var num = Number('0x' + list.join(""));
        return num;
    }

    /**
     * 解码起始点位置
     * @param num 10进制数字
     */
    static decodeMap(num:number):Array<number>{
        var str = NumberTooler.addZero(num.toString(16), 8);
        var list = [];
        for(var i = 0; i < 4; i++){
            list.push(Number(str.substr(i * 2, 2)));
        }
        return list;
    }
}