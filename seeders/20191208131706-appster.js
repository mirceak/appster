'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('AppsterJSModules', [{
      slug: 'appster_js_module_backend_remotes_module_main',
      code: `
(async ()=>{
    const api = express();

    const port = config.apiPort;
    const ip = config.apiIp;
    
    // Add headers
    api.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://' + config.frontEndIp + (config.frontEndPort == '80' ? '' : ":" + config.frontEndPort) );

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });
    
    Object.keys(sequelize.models).forEach(key => {
        let entity = sequelize[key];
        router.route('/' + key + '/:slug')
            .all(function (req, res, next) {
                // runs for all HTTP verbs first
                // think of it as route specific middleware!
                next()
            })
            .get(async (req, res, next) => {
                await entity.findOne({where: {slug: req.params.slug}}).then(result => {
                    res.send(result)
                }).catch(err => {
                    res.send(err)
                })
            })
            .put(function (req, res, next) {
                // just an example of maybe updating the user
                req.user.name = req.params.name
                // save user ... etc
                res.json(req.user)
            })
            .post(function (req, res, next) {
                next(new Error('not implemented'))
            })
            .delete(function (req, res, next) {
                next(new Error('not implemented'))
            })
    });

    api.use('/appster', router);
    api.listen(port, ip, () => {
        console.log("APPSTER____________________________________________________________________________________________________http api server started.");
    })
})()
      `,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      slug: 'appster_js_module_frontend_remotes_module_main',
      code: `
(async ()=>{
Vue.use(BootstrapVue)

let baseUrl = 'http://' + config.apiIp + ':' + config.apiPort + '/appster/';
let itemName = "AppsterJSModule";

Vue.prototype.$axios = axios;
Vue.prototype.$remoteModule = async (slug)=>{ return await remoteModule(axios, baseUrl, itemName, slug)};

var remotes = {
    module: Vue.prototype.$remoteModule,
    component: await Vue.prototype.$remoteModule("appster_js_module_frontend_remotes_component"),
    mixin: await Vue.prototype.$remoteModule("appster_js_module_frontend_remotes_mixin")
}

var Welcome = await Vue.component("Welcome", await remotes.component("appster_js_module_frontend_remotes_component_Welcome", remotes));
await Vue.component("Login", await remotes.component("appster_js_module_frontend_remotes_component_Login", remotes));

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
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      slug: 'appster_js_module_frontend_remotes_component',
      code: `
(async (slug, remotes)=>{
    let module = await remotes.module(slug);
    return {
        template: module.template,
        mixins: await module.mixins.reduce(async (result, current) => {
            result.push(await remotes.mixin(current, remotes));
            return result;
        }, [])
    }
})
      `,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      slug: 'appster_js_module_frontend_remotes_mixin',
      code: `
(async (slug, remotes)=>{
    return await remotes.module(slug)
})
      `,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      slug: 'appster_js_module_frontend_remotes_component_Welcome',
      code: `
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
    
]
            }
      `,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      slug: 'appster_js_module_frontend_remotes_mixin_Login',
      code: `      
{
    data(){
        return {
            auth_props:{
                display_register_menu: false
            }              
        }
    },
    mounted() {
        console.log("hello world");
    },
    methods: {        
    }
}
      `,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      slug: 'appster_js_module_frontend_remotes_component_Login',
      code: `      
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
    mixins: 
    [
        'appster_js_module_frontend_remotes_mixin_Login'
    ]
}
      `,
      createdAt: new Date(),
      updatedAt: new Date()
    }


    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('AppsterJSModules', null, {});
  }
};
