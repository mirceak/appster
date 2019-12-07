import remoteModule from "./remoteModule";

export default (slug)=>{
    return new Promise(async resolve => {
        let module = await remoteModule(slug);
        resolve({
            template: module.template,
            mixins: module.mixins
        });
    })
}