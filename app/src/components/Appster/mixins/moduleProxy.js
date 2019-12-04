export default (code)=>{
    //if parsing our code fails we need to return false
    try{
        return eval(`(()=>{return ${code}})()`);
    }catch(e){
        //we also show the code we ran and the error in case it fails
        console.log("Module Proxy Code- ", code);
        console.log("Module Proxy Error- ", e);
    }
    return null;
}