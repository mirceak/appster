import axios from "axios";

let baseUrl = "http://localhost:8080/appster/";
let itemName = "AppsterJSModule";

export default async (slug)=>{
    let module = await axios
        .get(baseUrl + itemName + '/' + slug)
    try {
        return await eval(`(async ()=>{return await ${module.data.code}})()`);
    } catch (e) {
        //we also show the code we ran and the error in case it fails
        console.log("Module Proxy Code- ", module.data.code);
        console.log("Module Proxy Error- ", e);
    }
}