'use strict'

//appster modules

//remote modules

//private vars
let props;
let modelName = 'appster_js_module';

let init = async (Sequelize, sequelize) => {
    class appster_js_module extends Sequelize.Model {
    };

    props = {
        slug: {
            type: Sequelize.STRING,
            primaryKey: true,
            unique: true
        },
        code: {
            type: Sequelize.TEXT
        }
    };

    await appster_js_module.init(props, {sequelize, modelName: modelName});

    await sequelize.define(modelName, props).sync({force: true});

    await appster_js_module.create(
        {
            slug: 'appster_js_module_frontend_main_module',
            code:`       
(async ()=>{
Vue.use(BootstrapVue)

axios.baseUrl = 'http://localhost:8080/appster/';

Vue.prototype.$axios = axios;
Vue.prototype.$remoteModule = remoteModule;

var remoteComponent = await remoteModule("appster_js_module_frontend_remoteComponent");
var remoteMixin = await remoteModule("appster_js_module_frontend_remoteMixin");

var remotes = {
    module: remoteModule,
    component: remoteComponent,
    mixin: remoteMixin
}

var Welcome = await Vue.component("Welcome", await remoteComponent("appster_js_module_frontend_remoteComponent_Welcome", remotes));
await Vue.component("Login", await remoteComponent("appster_js_module_frontend_remoteComponent_Login", remotes));

const router = new VueRouter({
  routes:[
    
  ]
});
Vue.use(VueRouter)

new Vue({
    render: h => h(Welcome)
}).$mount('#app');
})()
            `,
            updatedAt: new Date(),
            createdAt: new Date()
        }
    );
    await appster_js_module.create(
        {
            slug: 'appster_js_module_frontend_remoteComponent',
            code:`
(async (slug, remotes)=>{
    return new Promise(async resolve => {
        let module = await remotes.module(slug);
        resolve({
            template: module.template,
            mixins: await module.mixins.reduce(async (result, current) => {
                result.push(await remotes.mixin(current, remotes));
                return result;
            }, [])
        })
    })
})
            `,
            updatedAt: new Date(),
            createdAt: new Date()
        }
    );
    await appster_js_module.create(
        {
            slug: 'appster_js_module_frontend_remoteMixin',
            code:`
(async (slug, remotes)=>{
    return new Promise(async resolve => {
        resolve((await remotes.module(slug)));
    })
})
            `,
            updatedAt: new Date(),
            createdAt: new Date()
        }
    );

    await appster_js_module.create(
        {
            slug: 'appster_js_module_frontend_remoteComponent_Welcome',
            code:`
            {
                template: \`
<b-container>
  <b-card
    title="Appster"
    img-src="https://picsum.photos/600/300/?image=25"
    img-alt="Image"
    img-top
    tag="article"
  >
    <b-card-text>
      An abstract framework based on node.js, Vue.js, Bootstrap and mariadb.
    </b-card-text>
    
    <Login/>
    
  </b-card>
</b-container>
\`
                , mixins: 
[
    'appster_js_module_frontend_remoteComponent_mixin_loginCard'
]
            }`,
            updatedAt: new Date(),
            createdAt: new Date()
        }
    );


    await appster_js_module.create(
        {
            slug: 'appster_js_module_frontend_remoteComponent_mixin_loginCard',
            code:`         
{
    data(){
        return {
            auth_props:{
                display_register_menu: false
            }              
        }
    },
    mounted() {
    },
    methods: {        
    }
}
            `,
            updatedAt: new Date(),
            createdAt: new Date()
        }
    );
    await appster_js_module.create(
        {
            slug: 'appster_js_module_frontend_remoteComponent_Login',
            code:`
            {
                template: \`
<b-card
title="Login"
>
<b-card-text>
  Login here.
</b-card-text>

</b-card>
                \`,            
mixins: []
            }`,
            updatedAt: new Date(),
            createdAt: new Date()
        }
    );
    return {props: {...props, modelName}, model: appster_js_module};
}

exports.init = init;