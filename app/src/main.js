/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
(async ()=>{
    let axios = (await import("axios")).default;
    let Vue = (await import("vue")).default;
    let BootstrapVue = (await import('bootstrap-vue')).default;
    await import('bootstrap/dist/css/bootstrap.css');
    await import('bootstrap-vue/dist/bootstrap-vue.css');

    Vue.use(BootstrapVue)

    let remoteModule = (await import ("./remoteModule")).default;
    //we use this proxy to create objects that can contain dynamic objects like functions out of strings
    axios.baseUrl = 'http://localhost:8080/appster/';

    let mainModule = await remoteModule("appster_js_module_main_module");
    await mainModule.start(Vue, axios, remoteModule);
})()
