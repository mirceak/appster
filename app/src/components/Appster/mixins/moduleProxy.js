export default async (code)=>{
    //if parsing our code fails we need to return false
    try{
        return await eval(`(async ()=>{return await ${code}})()`);
    }catch(e){
        //we also show the code we ran and the error in case it fails
        console.log("Module Proxy Code- ", code);
        console.log("Module Proxy Error- ", e);
    }
    return null;
}