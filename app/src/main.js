/* eslint-disable */

(async ()=>{
    let config = ((await import('./appster_config.js')).default).default;
    let axios = (await import("axios")).default;
    let Vue = (await import("vue")).default;
    let VueRouter = (await import ('vue-router')).default;
    let BootstrapVue = (await import('bootstrap-vue')).default;
    await import('bootstrap/dist/css/bootstrap.css');
    await import('bootstrap-vue/dist/bootstrap-vue.css');
    let remoteModule = (await import ("./remoteModule")).default;

    config, Vue,VueRouter,BootstrapVue, remoteModule; //eslint bypass

    let module = await axios.get('http://' + config.apiIp + ':' + config.apiPort + '/appster/' + 'AppsterJSModule' + '/' + 'appster_js_module_frontend_remotes_module_main')
    await eval('(async ()=>{return await ' + module.data.code + '})()');
})()
