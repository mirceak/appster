/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
(async ()=>{
    let axios = (await import("axios")).default;
    let Vue = (await import("vue")).default;
    let VueRouter = (await import ('vue-router')).default;
    let BootstrapVue = (await import('bootstrap-vue')).default;
    await import('bootstrap/dist/css/bootstrap.css');
    await import('bootstrap-vue/dist/bootstrap-vue.css');
    let remoteModule = (await import ("./remoteModule")).default;

    Vue,VueRouter,BootstrapVue, remoteModule; //eslint bypass

    let module = await axios.get('http://localhost:8080/appster/' + 'AppsterJSModule' + '/' + 'appster_js_module_frontend_remotes_module_main')
    await eval('(async ()=>{return await ' + module.data.code + '})()');
})()
