
(async ()=>{
    let $ = (await import("jquery")).default;
    let config = ((await import('./appster_config.js')).default).default;
    let Vue = (await import("vue")).default;
    let VueRouter = (await import ('vue-router')).default;
    let Vuex = (await import ('vuex')).default;

    let axios = (await import("axios")).default;
    let BootstrapVue = (await import('bootstrap-vue')).default;
    await import('bootstrap/dist/css/bootstrap.css');
    await import('bootstrap-vue/dist/bootstrap-vue.css');
    let remoteModule = (await import ("./remoteModule")).default;

    $, config, Vue, Vuex, VueRouter, BootstrapVue, remoteModule; //eslint bypass, not explicitly accessing these variables will throw an error.

    let baseUrl = 'http://' + config.apiIp + ':' + config.apiPort + config.apiExt;
    Vue.prototype.baseUrl = baseUrl;

    let settings = await axios.get(baseUrl + 'settings');

    let mainModule = await axios.get(baseUrl + 'module/' + settings.data[0].mainFrontendModuleId);
    let mainModuleScript = await axios.get(baseUrl + 'script/' + mainModule.data.javascriptId);

    mainModule = await eval('(async ()=>{return await ' + mainModuleScript.data.code + '})()');
    mainModule();
})()
