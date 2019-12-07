// import axios from "axios";
import moduleProxy from "./moduleProxy";

export default async (code)=>{
    //if parsing our code fails we need to return false
    try{
        return await moduleProxy(`(()=>{return ${code}})()`);
    }catch(e){
        //we also show the code we ran and the error in case it fails
        console.log("Module Proxy Code- ", code);
        console.log("Module Proxy Error- ", e);
    }
    return null;
}