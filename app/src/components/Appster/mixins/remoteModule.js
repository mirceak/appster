import axios from "axios";
import moduleProxy from "./moduleProxy";

let baseUrl = "http://localhost:8080/appster/";
let itemName = "appster_js_module";

export default async (slug)=>{
    let module = await axios
        .get(baseUrl + itemName + '/' + slug)
    return await moduleProxy(module.data.code);
}