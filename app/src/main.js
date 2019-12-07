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

import remoteComponent from "./components/Appster/mixins/remoteComponent";

(async ()=>{
    //we use this proxy to create objects that can contain dynamic objects like functions out of strings
    Vue.prototype.$appstr = {
        baseUrl: 'http://localhost:8080/appster/'
    };
    axios.baseUrl = Vue.prototype.$appstr.baseUrl;

    let Welcome = await Vue.component("Welcome", await remoteComponent("Welcome"));

    new Vue({
        render: h => h(Welcome)
    }).$mount('#app');
})()
