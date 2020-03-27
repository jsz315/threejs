export default class Copy {
    public static newData(data:any):any{
        var obj:any = JSON.parse(JSON.stringify(data));
        // console.log('new data', obj);
        return obj;
    }
}