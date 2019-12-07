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

import remoteModule from "./components/Appster/mixins/remoteModule";

(async ()=>{
    //we use this proxy to create objects that can contain dynamic objects like functions out of strings
    axios.baseUrl = 'http://localhost:8080/appster/';

    let mainModule = await remoteModule("appster_js_module_main_module");
    await mainModule.start(Vue, axios, remoteModule);
})()
