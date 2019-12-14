'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('AppsterJSModules', [{
            slug: 'appster_js_module_backend_remotes_module_main',
            code: `
(async ()=>{    
    const port = config.apiPort;
    const ip = config.apiIp;
    
    const frontPort = config.frontEndPort;
    const frontIp = config.frontEndIp;
    
    const appsterApi = express();
    appsterApi.use(cors());
    appsterApi.use(bodyParser.urlencoded({ extended: false }));
    appsterApi.use(bodyParser.json());
    appsterApi.use(cookieParser(crypto.randomBytes(256), {
        sameSite: 'none'
    }));
    
    var options = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'appster',
    };
     
    var sessionStore = new MySQLStore(options);
    
    appsterApi.use(session({
        secret: crypto.randomBytes(256),
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    }));
    
    passport.use(new LocalStrategy(
      function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        });
      }
    ));
    
    Object.keys(sequelize.models).forEach(key => {
        let entity = sequelize[key];
        router.route('/' + key)
            .all(function (req, res, next) {
                // runs for all HTTP verbs first
                // think of it as route specific middleware!
                next()
            })
            .get(async (req, res, next) => {
                await entity.findAll().then(result => {
                    res.send(result)
                }).catch(err => {
                    res.send(err)
                })
            })
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
   
    appsterApi.use(passport.initialize());
    appsterApi.use(passport.session());
    appsterApi.use('/api/appster', router); 
    
    appsterApi.listen(port, ip, () => {
        console.log("APPSTER____________________________________________________________________________________________________http api server started.");
    });
    
    let frontEntApi = express();
    frontEntApi.use(express.static('app/dist'));
    
    frontEntApi.listen(frontPort, frontIp, () => {
        console.log("APPSTER____________________________________________________________________________________________________front-end server started.");
    });
})()
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_module_main',
            code: `
(async ()=>{
    Vue.use(BootstrapVue)
    
    let itemName = "AppsterJSModule";
    
    Vue.prototype.axios = axios;
    let _remoteModule = async (slug)=>{ return await remoteModule(axios, baseUrl, itemName, slug)};
    let remotes = {
        module: _remoteModule,
        component: await _remoteModule("appster_js_module_frontend_remotes_component"),
        template: await _remoteModule("appster_js_module_frontend_remotes_template")
    }
    Vue.prototype.$remotes = remotes;
    await Vue.component("VueAceEditor", VueAceEditor);
        
    const routes = await (await remotes.module("appster_js_module_frontend_remotes_routes"))(remotes);
    const router = new VueRouter({
      routes
    });
    
    Vue.use(VueRouter);
    Vue.use(Vuex);
    
    const remoteStore = await (await remotes.module("appster_js_module_frontend_remotes_store"))(remotes);
    const store = new Vuex.Store(remoteStore)
    Vue.prototype.store = store;
    
    new Vue({
        router
    }).$mount('#app');
})()
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_store',
            code: `
(async (remotes)=>{     
    return {
      state: {
        msg: "hi from store"
      },
      mutations: {
        changeMessage (state) {
          state.msg = state.msg;
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
    let module = await remotes.module(slug);
    if (module.template && typeof module.template === 'object'){
      module.template = await remotes.module(current, remotes);
    };
    if (module.mixins && Array.isArray(module.mixins)){
      module.mixins = await module.mixins.reduce(async (result, current) => {
          await (typeof current === 'string' || current instanceof String) ? result.push(await remotes.module(current, remotes)) : result.push(current);
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
            code: `
            {
                name: \'Welcome\',
                template: \`
<b-container>
  <b-card
    title="Appster"
    img-height="128"
    img-src="https://picsum.photos/600/300/?image=25"
    img-alt="Image"
    img-top
    tag="article"
  >
    <b-card-text>
      An abstract framework based on node.js, Vue.js, Bootstrap and mariadb.
    </b-card-text>
    
    <AppsterModuleEditor/>
    
  </b-card>
</b-container>
\`
                , mixins: 
[
    {
        mounted(){
            console.log(this.store.state.msg);
        }
    }
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
            slug: 'appster_js_module_frontend_remotes_component_AppsterModuleEditor',
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
    ]
}
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }


        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('AppsterJSModules', {slug: {[Sequelize.Op.like]: "appster_js_module_%"}}, {});
    }
};
