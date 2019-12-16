export default async (axios, baseUrl, itemName, slug)=>{
    let module = await axios
        .get(baseUrl + itemName + '/' + slug)
    try {
        return {
            guards: module.data.guards ? JSON.parse(module.data.guards) : undefined,
            compiled: await eval(`(async ()=>{return await ${module.data.code}})()`)
        };
    } catch (e) {
        //we also show the code we ran and the error in case it fails
        console.log("Module Proxy Code- ", module.data.code);
        console.log("Module Proxy Error- ", e);
    }
}