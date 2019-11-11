var Schema = null;
var Model = null;

exports.init = async mongoose => {
    if (Model != null) {
        return Model
    }
    ;

    _Schema = mongoose.Schema;

    Schema = new _Schema({
        name: String,
        eval: String,
    }, { collection: 'modules' });

    Model = mongoose.model('Appster', Schema);

    //We first check if our client has the default data loaded
    return await Model.find({name: 'main'}).then(async result => {
        await Model.find().deleteMany().exec();

        //if (!result.length){
        return await defaults(Model);
        // }else{
        //     return result[0];
        // }
    });
}

const defaults = async AppsterModel => {
    await AppsterModel.create({
        name: 'utils',
        eval: `new Promise(async (resolve, reject) => {
            var exports = {};

            exports.getPackage = async (packageInstallPath, packageName, skipRequire = false) => {
                return new Promise(async (resolve, reject) => {
                    var object = null;
                    var tries = 6;
                    while (object == null && tries > 0) {
                        try {
                            if (skipRequire) throw new Error();
                            object = require(packageName);
                        } catch (e) {
                            if (!skipRequire){
                                await shell.execute('npm install ' + packageInstallPath).then(result => {
                                    console.log(result)
                                });                            
                            } else await shell.execute(packageName).then(async result => {
                                //found package
                                tries = 1;
                            }).catch(async e=>{
                                await shell.execute('npm install ' + packageInstallPath).then(result => {
                                    console.log(result)
                                });                            
                            });
                        };
                        tries --;
                    }
                    resolve(object);
                });
            };

            resolve(exports);
        })`
    });

    await AppsterModel.create({
        name: 'shell',
        eval: `new Promise((resolve, reject)=>{
            var exports = {};
            
            const nodeCmd = require('node-cmd');
            exports.execute = (command)=>{
                return new Promise(async (resolve, reject) => {
                    await nodeCmd.get(command, async (err, data, stderr) => {
                        if (err == null) {
                            resolve(data);
                        } else {
                            reject("Error on shell command: \\"" + command + "\\" " + err);
                        }
                    });
                });
            };
            
            resolve(exports);
        })`
    });

    await AppsterModel.create({
        name: 'logger',
        eval: `new Promise((resolve, reject)=>{
            var exports = {};
            
            const tags = {
                init: {
                    tag: 'init',
                    logFunc: (msgs)=>{
                        console.log("Initiation Log: ", ...msgs);
                    }
                }
            };
            
            const _log = (tags, msgs)=>{
                tags.forEach(tag=>{
                    tag.logFunc(msgs);
                });
            };
            
            exports.types = {
                init: {
                    tags: [tags.init],
                    log: function(msgs){
                        _log(this.tags, msgs);
                    }
                }
            };
            
            resolve(exports);
        });`
    });

    await AppsterModel.create({
        name: 'fileManager',
        eval: `new Promise((resolve, reject) => {
            var exports = {};

            exports.write = (file, data) => {
                return new Promise((resolve, reject) => {
                    fs.writeFile(file, data, 'utf-8', (err)=>{
                        if (err) reject(err);
                        resolve();
                    });
                });
            };
            exports.read = async (file) => {
                return new Promise((resolve, reject) => {
                    fs.readFile(file, 'utf-8', (err, data) => {
                        if (err) reject(err);

                        resolve(data);
                    });
                });
            };

            resolve(exports);
        });`
});

    return await AppsterModel.create({
        name: 'main',
        eval: `(async ()=>{        
                const mongoose = require('mongoose');            
                mongoose.connect('mongodb://localhost:27017/appster', {autoIndex: true, useNewUrlParser: true, useUnifiedTopology: true});

                mongoose.models = {};
                var _Schema = mongoose.Schema;

                var AppsterSchema = new _Schema({
                    name: String,
                    eval: String,
                });
                var AppsterModel = mongoose.model('Appster', AppsterSchema);   
                
                var loadModule = async (moduleName)=>{
                    var object = null;   
                    
                    await AppsterModel.find({name: moduleName}).then(async result=>{
                        object = await eval(result[0].eval).then(result=>{return result}).catch(e=>{console.log("Error", e)});
                    });        
                                      
                    return object;
                }
                
                logger = await loadModule('logger');       
                logger.types.init.log(["Finished loading Logger"]);
                logger.types.init.log(["Loading Shell"]);
                var shell = await loadModule('shell');
                logger.types.init.log(["Finished loading Shell"]);
                logger.types.init.log(["Loading Utils"]);
                var utils = await loadModule('utils');
                logger.types.init.log(["Finished loading Utils"]);
                var fileManager = await loadModule('fileManager');
                logger.types.init.log(["Finished loading File Manager"]);
                
                logger.types.init.log(["Loading Express"]);
                var express = await utils.getPackage('express', 'express');
                logger.types.init.log(["Finished loading Express"]);
                
                logger.types.init.log(["Loading Axios"]);
                var express = await utils.getPackage('axios', 'axios');
                logger.types.init.log(["Finished loading Axios"]);
                
                logger.types.init.log(["Loading Vue Cli Package"]);
                var Vue = await utils.getPackage('-g @vue/cli', 'vue -h', true);
                logger.types.init.log(["Finished loading Vue Cli Package"]);
                                
                logger.types.init.log(["Initiating Vue Cli"]);
                await shell.execute('cd app/').then(async result => {
                    logger.types.init.log(["Found Vue Cli App"]);
                }).catch(async e => {                
                    logger.types.init.log(["Creating Vue Cli App"]);
                    await shell.execute('vue create app -d -f').then(async (result) => {     
                        fs.unlinkSync('./app/src/components/HelloWorld.vue');
                        logger.types.init.log(["Finished removing unnecessary Vue files."]);
                        
                        //main.js
                        await fileManager.write("./app/src/main.js", \`
import Vue from 'vue';
import App from './App.vue';
import moduleProxy from "./mixins/moduleProxy";
import axios from "axios";

Vue.config.productionTip = false

//we use this proxy to create objects that can contain dynamic objects like functions out of strings
Vue.prototype.$moduleProxy = moduleProxy;
Vue.prototype.$axios = axios;

Vue.prototype.$appstr = {
    baseUrl: '/appstr/'
};

new Vue({
    render: h => h(App),
}).$mount('#app')
                        \`);
                        
                        //App.vue
                        await fileManager.write("./app/src/App.vue", \`
<template>
  <div id="app">
    <AppsterComponent msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import AppsterComponent from './components/AppsterComponent.vue'

export default {
  name: 'app',
  components: {
    AppsterComponent
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
                        \`);
                        
                        //components/AppsterComponent.vue
                        await fileManager.write("./app/src/components/AppsterComponent.vue", \`
<template>
    <component
        v-if="readyToRender"
        v-bind:is="template"
        :model.sync="model"
    >
    </component>
</template>

<script>
    import dbModel from "../mixins/dbModel";

    export default {
        name: "AppstrComponent",
        mixins:[
            dbModel
        ],
        computed: {
            //we check if can show the component
            readyToRender() {
                return this.valid_model;
            },
            //we get the template for rendering
            template() {
                return {
                    template: this.model.template,
                    mixins: this.model.mixin[0] == '{' ? [this.$moduleProxy(this.model.mixin)] : this.$moduleProxy(this.model.mixin),
                };
            },
        },
    }
</script>

<style scoped>

</style>
                        \`);
                                    
                        //mixins folder
                        fs.mkdirSync("./app/src/mixins");            
                                    
                        //mixins/dbModel.js
                        await fileManager.write("./app/src/mixins/dbModel.js", \`
import dbItem from "./dbItem";

export default {
    data(){
        return {
            _modelLoaded: false,
            _modelsLoaded: false,
            _model: {},
            _models: []
        }
    },
    props:{
        id: Number
    },
    mixins:[
        dbItem
    ],
    computed:{
        model: {
            get(){
                if (!this._modelLoaded){
                    this._modelLoaded = true;
                    var _this = this;
                    this.show().then((model)=>{
                        _this.model = {...model.data};
                    });
                }
                return this._data._model;
            },
            set(value){
                this._data._model = value;
            }
        },
        models: {
            get(){
                if (!this._modelsLoaded){
                    this._modelsLoaded = true;
                    var _this = this;
                    this.index().then((models)=>{
                        _this.models = [...models.data];
                    });
                }
                return this._data._models;
            },
            set(value){
                this._data._models = value;
            }
        },
        valid_model(){
            //if we have the template ready the model should be considered valid at this point
            return this.model && this.model.template;
        }
    },
}
                        \`);
                        
                        //mixins/dbItem.js
                        await fileManager.write("./app/src/mixins/dbItem.js", \`
import makesRequests from "./makesRequests";

export default {
    mixins:[
        makesRequests
    ],
    methods:{
        async index(){
            return await this.$axios
                .get(this.baseUrl + this.itemName)
        },
        async create(){
            return await this.$axios
                .get(this.baseUrl + this.itemName + '/create')
        },
        async show(){
            return await this.$axios
                .get(this.baseUrl + this.itemName + '/' + this.id)
        },
        async store(form){
            return await this.$axios
                .post(this.baseUrl + this.itemName, form)
        },
        async edit(id){
            return await this.$axios
                .get(this.baseUrl + this.itemName + id + "/edit")
        },
        async update(id, form){
            return await this.$axios
                .put(this.baseUrl + this.itemName + '/' + id, form)
        },
        async destroy(id){
            return await this.$axios
                .delete(this.baseUrl + this.itemName + id)
        }
    }
}
                        \`);     
                        
                        //mixins/makesRequests.js
                        await fileManager.write("./app/src/mixins/makesRequests.js", \`
export default {
    computed:{
        baseUrl(){
            return this.$appstr.baseUrl;
        },
    }
}
                        \`);      
                                                
                        //mixins/moduleProxy.js
                        await fileManager.write("./app/src/mixins/moduleProxy.js", \`
export default (code)=>{
    //if parsing our code fails we need to return false
    try{
        return eval("(()=>{return " + code + "})()");
    }catch(e){
        //we also show the code we ran and the error in case it fails
        /* eslint-disable no-console */
        console.log("Module Proxy Code- ", code);
        console.log("Module Proxy Error- ", e);
    }
    return null;
}
                        \`);             
                        
                        logger.types.init.log(["Finished writing Vue main module."]);
                        
                        logger.types.init.log(["Created Vue Cli App"]);
                    })
                }).finally(async ()=>{               
                
                    logger.types.init.log(["Serving Vue Cli App"]);
                    await shell.execute('cd app/ & npm run serve -- --port 80').then(result => {
                        logger.types.init.log(["Finished Serving Vue Cli App"]);
                    }).catch(e=>{
                        /* eslint-disable no-console */
                        console.log(e);
                    });                
                });              
        })()`
    });
}

