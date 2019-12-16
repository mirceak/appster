'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('AppsterJSModules', [{
            slug: 'appster_js_module_backend_remotes_module_main',
            code: `
(async ()=>{            
    const appsterApi = express();
    appsterApi.use(cors());
    appsterApi.use(bodyParser.urlencoded({ extended: true }));
    appsterApi.use(bodyParser.json());
    
    var options = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'appster',
    };
     
    var sessionStore = new MySQLStore(options);    
    const secret = crypto.randomBytes(256).toString(); 
    
    appsterApi.use(session({
        secret: secret,
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    }));
    
    let remoteModule = async (code)=>{
        return await eval('(async ()=>{return await '+code+'})()');;
    }
    
    Object.keys(sequelize.models).forEach(key => {    
        let entity = sequelize[key];
        let isLoggedIn = async (req, res, next) => {
            if (req.params && req.params.slug){
                req.model = await entity.findOne({where: {slug: req.params.slug}});
                if (req.model.guards){
                    let guards = JSON.parse(req.model.guards);
                    if (guards.indexOf('auth') != -1){    
                        if (req.isAuthenticated())
                            return next();   
                            
                        return res.send({
                            code: "{}",
                            guards: req.model.guards
                        });
                    }else{      
                        return next();                            
                    }
                }else{                     
                    return next();                    
                }
            }else{
                return next();
            }
        };
        
        appsterRouter.route('/' + key)
            .all(isLoggedIn)
            .get(async (req, res, next) => {
                await entity.findAll().then(result => {
                    res.send(result)
                }).catch(err => {
                    res.send(err)
                })
            })
        appsterRouter.route('/' + key + '/:slug')
            .all(isLoggedIn)
            .get(async (req, res, next) => {
                if (req.model) {
                    return res.send(req.model);
                }
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
            .post(async (req, res, next) => {
                await entity.update({code: req.body.code}, {where: {slug: req.body.slug}}).then(result => {
                    res.send( req.body.slug)
                }).catch(err => {
                    res.send(err)
                })
            })
            .delete(function (req, res, next) {
                next(new Error('not implemented'))
            })
    });
    
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser((id, done)=> {
        sequelize.User.findOne({ where: { id: id } }).then(result=>{
            if (result){            
                done(null, result.dataValues);
            }else{
                done(null, false, { message: 'Invalid User' })
            }
        })      
    });
    
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        
        function(username, password, done) {    
            sequelize.User.findOne({ where: { username: username } }).then( result => {     
              if (!result) {
                return done(null, false, { message: 'Incorrect username.' });
              }
              if (result.dataValues.password != password) {
                return done(null, false, { message: 'Incorrect password.' });
              }
              return done(null, result.dataValues);
            });
        }
    ));
    
    let frontEntApi = express();
    frontEndRouter.get('/user/authenticated', (req, res, next) => {
        res.send(req.isAuthenticated())
    })
        
    frontEndRouter.post('/login',
        passport.authenticate('local', 
            { 
                successRedirect: '/#/welcome',
                failureRedirect: '/#/login'
             }
         )
    );
   
    appsterApi.use(passport.initialize());
    appsterApi.use(passport.session());    
    appsterApi.use(express.static('app/dist'), frontEndRouter);
    appsterApi.use(config.apiExt, appsterRouter); 
    
    appsterApi.listen(config.apiPort, config.apiIp, () => {
        console.log("APPSTER____________________________________________________________________________________________________http api server started.");
    });
})()
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_module_main',
            code: `
(async ()=>{
    Vue.use(BootstrapVue);    
    
    Vue.prototype.axios = axios;
    
    let needsAuthRedirect = false;
        
    let itemName = "AppsterJSModule";
    let _remoteModule = async (slug)=>{return await remoteModule(axios, baseUrl, itemName, slug)};    
    let remotes = await (await _remoteModule('appster_js_module_frontend_remotes')).compiled(_remoteModule);
    
    Vue.prototype.$remotes = remotes;
    await Vue.component("VueAceEditor", VueAceEditor);
    
    Vue.use(Vuex);    
    const remoteStore = await (await remotes.module("appster_js_module_frontend_remotes_store")).compiled(remotes);
    const store = new Vuex.Store(remoteStore)
    Vue.prototype.store = store;        
    
    axios.interceptors.response.use(async (response) => {
        if (response && (response.data.slug == 'appster_js_module_frontend_remotes_component_Login' && !response.config.url.includes('appster_js_module_frontend_remotes_component_Login'))){
            store.commit('changeState', {authenticated:false});
        }
        return response;
    }, async (error) => {
        // Do something with response error
        return Promise.reject(error);
    });    
    
    await axios.get('/user/authenticated').then(response=>{
        store.commit('changeState', {authenticated: response.data});
    });
    
    const routes = await (await remotes.module("appster_js_module_frontend_remotes_routes")).compiled(remotes);
    const router = new VueRouter({
        routes: routes
    });    
    Vue.use(VueRouter);
    
    router.beforeEach((to, from, next) => {    
        if (!store.state.authenticated 
            && routes.reduce((result, current)=>{
                if (current.path == to.path && current.component.guards.indexOf('auth') != -1){
                    result = true;
                }
                return result;
            }, null) != null
            && to.path != '/login')
        {                      
            if (from.path !== '/login') {
                return router.push('/login');     
            }else{
                return router.go(-1);    
            }
            return;
        } 
         
        if (store.state.authenticated 
            && routes.reduce((result, current)=>{
                if (current.path == to.path && current.component.guards.indexOf('auth') == -1){
                    result = true;
                }
                return result;
            }, null) != null
            && to.path == '/login')
        {      
            if (from.path != '/'){
                if (from.path != '/welcome'){
                    return router.replace(from.path);
                }
                return router.go(-1);
            }
            return router.push('/welcome');
        }      
        return next();
    })
    
    new Vue({
        router
    }).$mount('#app');
})()
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes',
            code: `
(async (remoteModule)=>{     
    return {
        module: remoteModule,
        component: (await remoteModule("appster_js_module_frontend_remotes_component")).compiled,
        template: (await remoteModule("appster_js_module_frontend_remotes_template")).compiled
    }    
})   
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_store',
            code: `
(async (remotes)=>{     
    return {
      state: {
        authenticated: false,
        msg: "hi from store"
      },
      mutations: {
        changeState (state, newVal) {
            this.state = Object.assign(state, newVal);
        }
      }
    }    
})   
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_routes',
            code: `
(async (remotes)=>{     
    return [
        { 
            path: '/', 
            component: await remotes.component("appster_js_module_frontend_remotes_component_Home", remotes) 
        },
        { 
            path: '/login', 
            component: await remotes.component("appster_js_module_frontend_remotes_component_Login", remotes) 
        },
        { 
            path: '/welcome', 
            component: await remotes.component("appster_js_module_frontend_remotes_component_Welcome", remotes) 
        }
    ]
})
       
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        },{
            slug: 'appster_js_module_frontend_remotes_component',
            code: `
(async (slug, remotes)=>{
    let model = (await remotes.module(slug))
    let module = model.compiled ? model.compiled : {};
    module.guards = model.guards;
    
    if (module.template && typeof module.template === 'object'){
      module.template = (await remotes.module(current, remotes)).compiled;
    };
    if (module.mixins && Array.isArray(module.mixins)){
      module.mixins = await module.mixins.reduce(async (result, current) => {
          await (typeof current === 'string' || current instanceof String) ? result.push((await remotes.module(current, remotes)).compiled) : result.push(current);
          return result;
      }, []);
    };
    if (module.components && !Array.isArray(module.components)){
      module.components = await Object.keys(module.components).reduce(async (result, current) => {
          let label = current;
          current = module.components[current];
          result[label] = async ()=> {
              return await remotes.component(current, remotes);
          };
          return await result;
      }, {});
    };
    return module;
})
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_template',
            code: `
(async (slug, remotes)=>{
    return await remotes.module(slug)
})
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_component_Welcome',
            guards:
                `[
                    "auth"
                ]`,
            code: `
            {
                name: \'Welcome\',
                template: \`
<b-container>
  <b-card
    title="Welcome"
    img-height="128"
    img-src="https://picsum.photos/600/300/?image=33"
    img-alt="Image"
    img-top
    tag="article"
  >
    <b-card-text>
    </b-card-text>
    
    <AppsterModuleEditor/>
    
  </b-card>
</b-container>
\`
                , mixins: 
[
]
                , components:
{
    AppsterModuleEditor:'appster_js_module_frontend_remotes_component_AppsterModuleEditor'
}
            }
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_component_Home',
            guards:
                `[
                    "web"
                ]`,
            code: `
            {
                name: \'Home\',
                template: \`
<b-container>
  <b-card
    title="Home"
    img-height="128"
    img-src="https://picsum.photos/600/300/?image=25"
    img-alt="Image"
    img-top
    tag="article"
  >
    <b-card-text>
      An abstract framework based on node.js, Vue.js, Bootstrap and mariadb.
    </b-card-text>
        
  </b-card>
</b-container>
\`
                , mixins: 
[
]
                , components:
{
}
            }
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_component_Login',
            guards:
            `[
                "guest"
            ]`,
            code: `
            {
                name: \'Login\',
                template: \`
<b-container>
  <b-card
    title="Login"
    img-height="128"
    img-src="https://picsum.photos/600/300/?image=66"
    img-alt="Image"
    img-top
    tag="article"
  >
    
    <form action="/login" method="post">
        <div>
            <label>Username:</label>
            <input type="text" name="username"/>
        </div>
        <div>
            <label>Password:</label>
            <input type="password" name="password"/>
        </div>
        <div>
            <input type="submit" value="Log In"/>
        </div>
    </form>
        
  </b-card>
</b-container>
\`
                , mixins: 
[
]
                , components:
{
}
            }
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_mixin_AppsterAceEditor',
            code: `      
{
    data(){
        return {
            modules: [],
            content: null,       
        }
    },
    async mounted() {
        await this.getAll();
        console.log("hello world");
    },
    methods: {        
        async getAll(){
             await this.axios.get(this.baseUrl + 'AppsterJSModule').then(result=>{                           
                  this.modules.push(...result.data.map(current=>{
                      return {value: {slug: current.slug, code:current.code}, text: current.slug};
                  }));
             })
        },
        async save(){
             await this.$refs.appster_ace_editor.update();
             await this.axios.post(this.baseUrl + 'AppsterJSModule/' + this.content.slug, {code: this.content.code, slug: this.content.slug})
            .then(function (response) {
            
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
}
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_mixin_AppsterModuleEditor',
            code: `      
{
    props:[
        'content'
    ],
        data(){
        return {
        }
    },
    methods:{
        update(){
            this.$emit('update:content', this.$refs.editor.getValue());
        }
    },
    mounted() {
        console.log("hello worldz");
    },
}
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_component_AppsterModuleEditor',
            guards:
            `[
                "auth"
            ]`,
            code: `      
{
    name: 'AppsterModuleEditor',
    template: \`
        <b-card
        title="Appster Module Editor"
        >
          <b-card-text>
            Edit your platform's modules here.
          </b-card-text>
          
          <b-form-select v-model="content" :options="modules" class="mb-3">
              <template v-slot:first>
                    <option v-if='modules.length' :value="null" disabled>-- Please select a module --</option>
                    <option v-if='!modules.length' :value="null" disabled>-- No visible modules --</option>
              </template>
          </b-form-select>
                  
          <AppsterAceEditor ref="appster_ace_editor" v-if='content' :content.sync='content.code'/>        
    
          <b-button v-if='content' @click="save" variant="success">Save</b-button>
        </b-card>
    \`,            
    mixins: 
    [    
        'appster_js_module_frontend_remotes_mixin_AppsterAceEditor'
    ]
    , components:
    {
        AppsterAceEditor:'appster_js_module_frontend_remotes_component_AppsterAceEditor'
    }
}
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_component_AppsterAceEditor',
            code: `      
{
    name: 'AppsterAceEditor',
    template: \`
<VueAceEditor
        :height="300 + 'px'"
        :width="100 + '%'"
        :content="content"
        lang="javascript"
        theme="chrome"
          
        ref="editor"
>
</VueAceEditor>
    \`,            
    mixins: 
    [
        'appster_js_module_frontend_remotes_mixin_AppsterModuleEditor'
    ]
}
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        },

        ], {});
    },


    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('AppsterJSModules', {slug: {[Sequelize.Op.like]: "appster_js_module_%"}}, {});
    }
};
