/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
import axios from "axios";
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

import moduleProxy from "./components/Appster/mixins/moduleProxy";
import remoteModule from "./components/Appster/mixins/remoteModule";

import Welcome from "./components/Welcome";
import AppstrComponent from "./components/Appster/ApstrComponent/AppstrComponent"

(async ()=>{
    //we use this proxy to create objects that can contain dynamic objects like functions out of strings
    Vue.prototype.$moduleProxy = moduleProxy;
    Vue.prototype.$axios = axios;

    Vue.prototype.$appstr = {
        baseUrl: 'http://localhost:8080/appster/'
    };

    Vue.prototype.$axios.baseUrl = Vue.prototype.$appstr.baseUrl;

    Vue.component("AppstrComponent", AppstrComponent);

    new Vue({
        render: h => h(Welcome)
    }).$mount('#app');
})()
