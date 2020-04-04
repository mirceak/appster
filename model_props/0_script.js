(()=>{
  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
    },
    name: {
      allowNull: false,
      type: 'STRING'
    },
    code: {
      allowNull: false,
      type: 'STRING(20000)'
    },
    type: {
      allowNull: false,
      type: 'STRING'
    },
    createdAt: {
      allowNull: false,
      type: 'DATE'
    },
    updatedAt: {
      allowNull: false,
      type: 'DATE'
    }
  }

  var fields = Object.assign({

  }, attributes);

  var options = {
    indexes: [
      {
        unique: true,
        fields: ['name', 'type']
      }
    ]
  }

  var associate = function(models) {
    // associations can be defined here
  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Scripts', [
        {
          name: 'mainBackendModule',
          code: `
              (async ()=>{    
                  appster = Object.assign({                                       
                      cors: await utils.require('cors'),
                      bodyParser: require("body-parser"),
                      cookieParser: require("cookie-parser"),
                      session: await utils.require('express-session'),
                      passport: await utils.require('passport'),
                      crypto: await utils.require('crypto'),
                      LocalStrategy: (await utils.require('passport-local')).Strategy,                          
                      express: await utils.require('express'),
                      passwordHash: await utils.require('password-hash'),       
                      async remoteModule(name){
                          return new Promise(async _resolve => {
                              await sequelize.Module.findOne({
                                  include:[
                                      {
                                          all: true
                                      }
                                  ],                                    
                                  where: {
                                      name: name, 
                                      type: 'appster_module'
                                  }
                              }).then(async result => {    
                                  _resolve(await appster.proxyModule(result.dataValues.javascript.code));
                              }).catch(async err => {
                              
                              });
                          })
                      },
                      modules: (await sequelize.Module.scope('appster_modules').findAll({
                          include:[
                              {
                                  all: true
                              }
                          ]
                      }))
                  }, appster);  
                  
                  appster = Object.assign({                        
                      MySQLStore: (await utils.require('express-mysql-session'))(appster.session),       
                      apiRouter: appster.express.Router(),          
                      frontEndRouter: appster.express.Router(),      
                      api: appster.express(),
                  }, appster);  

                  for (var module of appster.modules){
                      appster.modules[module.name] = await appster.proxyModule(module.Javascript.dataValues.code);
                  };
                  
                  var appsterConfigModule = await appster.modules.appsterConfig();                  
                  var appsterLoginScaffold = await appster.modules.appsterLoginScaffold();      
                  var appsterRouter = await appster.modules.appsterRouter();
              })()
          `,
          type: 'module',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'appsterConfigModule',
          code: `
            (async ()=>{       
                const secret = appster.passwordHash.generate(appster.crypto.randomBytes(256).toString() + new Date());     
                var options = {
                    host: 'database',
                    port: 3306,
                    user: 'root',
                    password: 'appster',
                    database: 'appster',
                };     
                var sessionStore = new appster.MySQLStore(options);    
                
                appster.api.use(appster.cors());
                appster.api.use(appster.bodyParser.urlencoded({ extended: true }));
                appster.api.use(appster.bodyParser.json());
                    
                appster.api.use(appster.session({
                    secret: secret,
                    store: sessionStore,
                    resave: false,
                    saveUninitialized: false,
                    cookie: {
                      maxAge: 30 * 24 * 60 * 60 * 1000
                    }
                }));
            })
          `,
          type: 'module',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'appsterRouterModule',
          code: `
            (async ()=>{                 
              await Object.keys(sequelize.models).forEach(key => {    
                  var entity = sequelize[key];
                  var isLoggedIn = async (req, res, next) => {
                      if (req.params && req.params.slug){
                          req.model = await entity.findOne({where: {slug: req.params.slug}});

                          if (req.model.guards){
                              var guards = JSON.parse(req.model.guards);
                              if (guards.indexOf('auth') != -1){    
                                  if (req.isAuthenticated()){
                                      return next();                           
                                  }

                                  return null;
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
                  appster.apiRouter.route('/' + key)
                      .all(isLoggedIn)
                      .get(async (req, res, next) => {
                          await entity.findAll().then(result => {
                              res.send(result)
                          }).catch(err => {
                              res.send(err)
                          })
                      })
                  appster.apiRouter.route('/' + key + '/:id')
                      .all(isLoggedIn)
                      .get(async (req, res, next) => {
                          if (req.model) {
                              return res.send(req.model);
                          }
                          await entity.findOne({where: {id: req.params.id}}).then(result => {
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
                              res.send(req.body.slug)
                          }).catch(err => {
                              res.send(err)
                          })
                      })
                      .delete(function (req, res, next) {
                          next(new Error('not implemented'))
                      })
              });  
              appster.apiRouter.route('/frontendRoutes')
                  .get(async (req, res, next) => {
                      var routes = await sequelize.FrontendRoute.findAll({
                        where: {
                          type: 'root_page'
                        }
                      });
                      
                      var loadComponentSibling = async (component)=>{            
                          component.dataValues.html = await loadComponentHtml(component);   
                          component.dataValues.siblings = await loadComponentSiblings(component);
                          component.dataValues.mixins = await loadComponentMixins(component);
                          for (var sibling of component.dataValues.siblings){    
                              sibling.dataValues.html = await loadComponentHtml(sibling);    
                              sibling.dataValues.siblings = await loadComponentSiblings(sibling);    
                              sibling.dataValues.mixins = await loadComponentMixins(sibling);
                              if (sibling.siblings){
                                  await loadComponentSiblings(sibling);
                              }
                          }
                      };
                      var loadComponentHtml = async (component)=>{  
                          return await component.getHtml();
                      };
                      var loadComponentSiblings = async (component)=>{  
                          return await component.getSiblings();
                      };
                      var loadMixinSiblings = async (mixin)=>{
                          var siblings = await mixin.getSiblings(); 
                            
                          for (var sibling of siblings){
                              sibling.dataValues.javascript = await sibling.getJavascript();       
                              sibling.siblings = await loadMixinSiblings(sibling);                       
                          }
                          
                          return siblings;
                      };
                      var loadComponentMixins = async (component)=>{  
                          var mixins = await component.getMixins();
                          for (var mixin of mixins){
                              mixin.dataValues.javascript = await mixin.getJavascript();
                              mixin.dataValues.siblings = await loadMixinSiblings(mixin);
                          }
                          return mixins;
                      };
                      
                      var loadRouteSiblings = async (route)=>{
                          var siblings = await route.getSiblings(); 
                            
                          for (var sibling of siblings){      
                              var frontEndRoute = await sequelize.FrontendRoute.findOne({
                                  where: {
                                      routeId: sibling.dataValues.id 
                                  }
                              });
                              frontEndRoute.route = sibling;
                              frontEndRoute.dataValues.route = sibling;
                              frontEndRoute.component = await frontEndRoute.getComponent();
                              frontEndRoute.dataValues.component = frontEndRoute.component;
                              frontEndRoute.component.siblings = await frontEndRoute.component.getSiblings(); 
                              frontEndRoute.component.dataValues.siblings = frontEndRoute.component.siblings; 
                              siblings[siblings.indexOf(sibling)] = frontEndRoute;
                                  
                              await parseFrontEndRoutes(frontEndRoute);                 
                          }
                          
                          return siblings;
                      };
                      var parseFrontEndRoutes = async (frontEndRoute)=> { 
                          frontEndRoute.route = await frontEndRoute.getRoute();
                          frontEndRoute.dataValues.route = frontEndRoute.route;
                          frontEndRoute.dataValues.siblings = await loadRouteSiblings(frontEndRoute.route);  
                                                                     
                          for (var sibling of frontEndRoute.dataValues.siblings){
                              await parseFrontEndRoutes(sibling);
                          }
                          
                          frontEndRoute.component = await frontEndRoute.getComponent();
                          frontEndRoute.dataValues.component = frontEndRoute.component;
                                                    
                          frontEndRoute.component.siblings = await frontEndRoute.component.getSiblings();
                          frontEndRoute.component.dataValues.siblings = frontEndRoute.component.siblings; 
                          for (var sibling of frontEndRoute.component.siblings){                          
                              await loadComponentSibling(sibling);
                          }
                          
                          frontEndRoute.component.dataValues.html = await loadComponentHtml(frontEndRoute.component);
                          frontEndRoute.component.dataValues.mixins = await loadComponentMixins(frontEndRoute.component);
                      }
                      
                      
                      for (var frontEndRoute of routes){
                          await parseFrontEndRoutes(frontEndRoute);
                      }
                      
                      res.send(routes)
                  });

              var routes = await sequelize.FrontendRoute.findAll({
                  include: {
                    all: true
                  }
              });
              
              var frontRouteSiblings = async (route)=> {
                  var siblings = await route.getSiblings();
                  
                  for (var sibling of siblings){
                      var frontRoute = await sequelize.FrontendRoute.findOne({
                          where: {
                              routeId: sibling.dataValues.id 
                          }
                      });
                      frontRoute.Route = sibling;
                      frontRoute.dataValues.Route = sibling;
                      frontRoute.Route.dataValues.path = route.path + '/' + frontRoute.Route.path; 
                      siblings[siblings.indexOf(sibling)] = await parseFrontRoute(frontRoute);
                  }
                  
                  return siblings;
              }
              
              var parseFrontRoute = async (frontRoute)=> {
                  frontRoute.siblings = await frontRouteSiblings(frontRoute.Route);
                  
                  var guards = await frontRoute.Route.getGuards();
                  for (var guard of guards){
                      var guardModule = await guard.getModule();
                      var guardModuleCode = (await guardModule.getJavascript()).code;
                      guard.module = await (await appster.proxyModule(guardModuleCode))();
                  };
                  frontRoute.guards = guards;
                  ((frontRoute)=> {
                      appster.frontEndRouter.get(frontRoute.Route.dataValues.path, async function(req, res, next) {
                          return await appster.modules.routeModuleController(req, res, next, frontRoute);
                      });
                  })(frontRoute);
              }
              
              for (var frontRoute of routes){
                  routes[routes.indexOf(frontRoute)] = await parseFrontRoute(frontRoute);
              };
                  
              appster.api.use(appster.express.static('app/dist'), appster.frontEndRouter);
              appster.api.use(appster.config.apiExt, appster.apiRouter);      
              appster.api.use(appster.frontEndRouter);              
              
              await appster.api.listen(appster.config.apiPort, appster.config.apiIp, () => {
                  console.log("APPSTER____________________________________________________________________________________________________http api server started.");
              });
          })
          `,
          type: 'module',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'routeModuleControllerModule',
          code: `
            (async (req, res, next, frontRoute)=>{      
              if (frontRoute){    
                  for (var guard of frontRoute.guards){
                      if (guard.module.condition && !guard.module.condition(req)){
                          return res.redirect('/' + guard.module.redirectRoute);
                      }
                  };
                  var backendRoute = await sequelize.BackendRoute.findOne({
                      where: {
                          name: frontRoute.Route.dataValues.name
                      },
                      include: [{
                          all: true
                      }]
                  });
                      
                  if (backendRoute){
                      var backendModule = await appster.proxyModule((await backendRoute.Module.getJavascript()).code);
                      
                      return backendModule(req, res, next);
                  };
              }
              res.sendFile('app/dist/appster_index.html', { root: './' });
            })
          `,
          type: 'module',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'routeModuleLoginPageControllerModule',
          code: `
            (async (req, res, next)=>{
                if (req.isAuthenticated()){
                    res.redirect('/admin');   
                }else{    
                    res.sendFile('app/dist/appster_index.html', { root: './' });
                };
            })
          `,
          type: 'module',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'authGuardModule',
          code: `
            (async ()=>{            
                return {
                    condition(req){
                        return req.isAuthenticated();                        
                    },
                    redirectRoute: 'login'
                }
            })
          `,
          type: 'module',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'routeModuleRootPageModule',
          code: `
            (async (req, res, next)=>{     
              
            })
          `,
          type: 'module',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'routeModuleLoginPageModule',
          code: `
            (async (req, res, next)=>{     
              
            })
          `,
          type: 'module',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'routeModuleAdminPageModule',
          code: `
            (async (req, res, next)=>{     
              
            })
          `,
          type: 'module',
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'appsterLoginScaffoldModule',
          code: `
            (async ()=>{     
              appster.passport.serializeUser(function(user, done) {
                  done(null, user.id);
              });
              
              appster.passport.deserializeUser((id, done)=> {
                  sequelize.User.findOne({ where: { id: id } }).then(result=>{
                      if (result){            
                          done(null, result.dataValues);
                      }else{
                          done(null, false, { message: 'Invalid User' })
                      }
                  })      
              });
              
              appster.passport.use(new appster.LocalStrategy({
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
             
              appster.api.use(appster.passport.initialize());
              appster.api.use(appster.passport.session());    
                  
              appster.frontEndRouter.post('/login',
                  appster.passport.authenticate('local', 
                      {
                          successRedirect: '/admin',
                          failureRedirect: '/login'
                      }
                   )
              );
            })
          `,
          type: 'module',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'mainFrontendModule',
          code: `
            (async ()=>{
                Vue.use(BootstrapVue);    
                
                Vue.prototype.axios = axios;
                    
                var remoteModule = async (slug)=>{return await remoteModule(axios, baseUrl, 'module', slug)};    
                var remoteComponent = async (slug)=>{return await remoteModule(axios, baseUrl, 'module', slug)};   
                var remoteMixin = async (slug)=>{return await remoteModule(axios, baseUrl, 'module', slug)};    
                                
                Vue.use(Vuex);    
                const remoteStore = await (async (remotes)=>{     
                    return {
                        modules: {
                            admin: {      
                                namespaced: true,                    
                                state: {
                                    models: []
                                },
                                mutations: {
                                    async init (state) {
                                        await axios.get(baseUrl + 'Model').then(result=>{                         
                                              state.models.push(...result.data);
                                        }) 
                                    }
                                },
                            }
                        }
                    }    
                })();
                const store = new Vuex.Store(remoteStore)
                await store.commit('admin/init');
                
                Vue.prototype.store = store;  
                              
                var proxyModule = async (module)=>{
                    return await eval(module);
                };
                
                var routes = (await axios.get(baseUrl + 'frontendRoutes')).data; 
                
                var parseSiblingMixin = async (mixin)=>{       
                    return await proxyModule(mixin.javascript.code);
                };
                var parseMixinSiblings = async (mixin)=>{       
                    if (!mixin.siblings) return [];
                    
                    for (var i=0; i<mixin.siblings.length; i++){
                        var sibling = await parseSiblingMixin(mixin.siblings[i]); 
                        sibling.mixins = await parseMixinSiblings(mixin.siblings[i]);
                        mixin.siblings[i] = sibling;
                    }
                    
                    return mixin.siblings;
                };
                var parseSiblingMixins = async (mixins, result = [])=>{
                    if (!mixins) return [];
                    
                    for (var i=0; i<mixins.length; i++){
                        result[i] = await parseSiblingMixin(mixins[i]);
                        result[i].mixins = await parseMixinSiblings(mixins[i]);
                    }
                    
                    return result;
                };
                
                var parseSibling = async (sibling)=>{       
                    if (sibling.mixins){
                        sibling.mixins = await parseSiblingMixins(sibling.mixins);
                    };
                    return {
                      components: await parseSiblings(sibling.siblings),
                      mixins: sibling.mixins,
                      template: sibling.html.code,
                    }
                };                
                var parseSiblings = async (siblings, result = {})=>{
                    if (!siblings) return {};
                    
                    for (var i=0; i<siblings.length; i++){
                        result[siblings[i].name] = await parseSibling(siblings[i]);
                    }
                    
                    return result;
                };
                var parseRoute = async (route)=> {             
                    var parsedRoute = {                        
                      name: route.route.name,
                      path: route.route.path,
                      component: {
                        components: await parseSiblings(route.component.siblings),
                        mixins: await parseSiblingMixins(route.component.mixins),
                        template: route.component.html.code,
                      }
                    };
                    for (var index in route.siblings){
                        route.siblings[index] = await parseRoute(route.siblings[index]);
                    }
                    parsedRoute.children = route.siblings;
                    return parsedRoute;
                }
                
                console.log(routes);
                for (var route of routes){
                    routes[routes.indexOf(route)] = await parseRoute(route);
                       
                }
                const router = new VueRouter({
                    mode: 'history',
                    routes: routes
                });    
                Vue.use(VueRouter);
                    console.log(routes);
                console.log("vue ready");
                    
                new Vue({
                    router
                }).$mount('#app');
            })
          `,
          type: 'module',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'LoginPageComponent',
          code: `
<b-container class='main_container'>
  <b-card
    title="Login"
    img-height="256"
    img-src="https://picsum.photos/600/300/?image=66"
    img-alt="Image"
    img-top
    tag="article"
    class="col offset-xl-2 col-xl-8"
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
          `,
          type: 'html',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'WelcomePageComponent',
          code: `
<b-container class='main_container'>
  <b-card
    title="Home"
    img-height="256"
    img-src="https://picsum.photos/600/300/?image=25"
    img-alt="Image"
    img-top
    tag="article"
    class="col offset-xl-2 col-xl-8"
  >
    <b-card-text class='card_text'>
      An abstract framework based on node.js, Vue.js, Bootstrap and mariadb.
    </b-card-text>
    
    <a v-bind:href="$router.resolve({name: 'login'}).href">Login</a>
    <a v-bind:href="$router.resolve({name: 'admin'}).href">Admin</a>
    
  </b-card>
</b-container>
          `,
          type: 'html',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminPageComponent',
          code: `
<b-container class='main_container'>
    <b-row class="main_container_row">
        <b-col cols="2" class="main_container_sidebar_col">
            <AdminSidebarNav></AdminSidebarNav>         
        </b-col>
        <b-col cols="10" class="main_container_col">
            <router-view class="main_container_router_view"></router-view>
        </b-col>   
<!--        <b-col cols="2" class="main_container_sidebar_col">-->
<!--            <AdminSidebarTools></AdminSidebarTools>         -->
<!--        </b-col>-->
    </b-row>
</b-container>
          `,
          type: 'html',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminComponentSidebarNav',
          code: `
<div>
    <div class="side_nav side_nav_left">
        <div class="navbar navbar-dark bg-info navbar_side">
            <b-navbar-brand><strong>Navigation</strong></b-navbar-brand>
        </div>   
        
        <AdminAccordionSidebarButton class="sidebar_accordion_button_body_top_level" :text="'FrontEnd'" :accordionId="'FrontEnd'" :accordionGroupId="'LeftSideNav'">    
                    
            <AdminAccordionSidebarButton :text="'Routes'" :accordionId="'Routes'" :accordionGroupId="'FrontEnd'">                
                <b-card-body class="sidebar_accordion_card_body">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button class="sidebar_action_button" variant="success" :href="'#'">List All</b-button>
                  </b-card-header>                  
                </b-card-body>
            </AdminAccordionSidebarButton>
            <AdminAccordionSidebarButton :text="'Components'" :accordionId="'Components'" :accordionGroupId="'FrontEnd'">               
                <b-card-body class="sidebar_accordion_card_body">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button class="sidebar_action_button" variant="success" :href="'#'">List All</b-button>
                  </b-card-header>                  
                </b-card-body>
            </AdminAccordionSidebarButton>
            <AdminAccordionSidebarButton :text="'Javascript'" :accordionId="'Javascript'" :accordionGroupId="'FrontEnd'">        
                <b-card-body class="sidebar_accordion_card_body">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button class="sidebar_action_button" variant="success" :href="'#'">List All</b-button>
                  </b-card-header>                  
                </b-card-body>
            </AdminAccordionSidebarButton>
            
        </AdminAccordionSidebarButton>
        <AdminAccordionSidebarButton class="sidebar_accordion_button_body_top_level" :text="'BackEnd'" :accordionId="'BackEnd'" :accordionGroupId="'LeftSideNav'">      
                  
            <AdminAccordionSidebarButton :text="'API Endpoints'" :accordionId="'API'" :accordionGroupId="'BackEnd'">                
                <b-card-body class="sidebar_accordion_card_body">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button class="sidebar_action_button" variant="success" :href="'#'">List All</b-button>
                  </b-card-header>                  
                </b-card-body>
            </AdminAccordionSidebarButton>
            <AdminAccordionSidebarButton :text="'Route Controllers'" :accordionId="'Route'" :accordionGroupId="'BackEnd'">                
                <b-card-body class="sidebar_accordion_card_body">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button class="sidebar_action_button" variant="success" :href="'#'">List All</b-button>
                  </b-card-header>                  
                </b-card-body>
            </AdminAccordionSidebarButton>
            
        </AdminAccordionSidebarButton>
        <AdminAccordionSidebarButton 
            :collapsed="['view_all'].indexOf($route.name) != -1"
            class="sidebar_accordion_button_body_top_level" 
            :text="'Database'" 
            :accordionId="'Database'" 
            :accordionGroupId="'LeftSideNav'"
        >                
            <AdminAccordionSidebarButton 
                :collapsed="['view_all'].indexOf($route.name) != -1"
                :text="'Tables'" 
                :accordionId="'Tables'" 
                :accordionGroupId="'Database'"
            >
            
                <div v-for="model in store.state.admin.models">
                    <AdminAccordionSidebarButton 
                        :collapsed="['view_all'].indexOf($route.name) != -1 && [model.name].indexOf($route.params.model) != -1"
                        :text="model.tableName" 
                        :accordionId="model.name" 
                        :accordionGroupId="'Tables'"
                    >
                        <b-card-body class="sidebar_accordion_button_body">
                            <b-card no-body>
                              <b-card-body class="sidebar_accordion_card_body">                
                                <b-card-header header-tag="header" class="p-1" role="tab">
                                  <b-button class="sidebar_action_button" variant="success" :to="{ name: 'view_all', params: {model: model.name} }">List All {{model.tableName}}</b-button>
                                </b-card-header>                  
                              </b-card-body>
                            </b-card>
                        </b-card-body>
                    </AdminAccordionSidebarButton> 
                </div>
            </AdminAccordionSidebarButton>                   
        </AdminAccordionSidebarButton>
    </div>
</div>
          `,
          type: 'html',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminComponentSidebarTools',
          code: `
<div>
    <div class="side_nav side_nav_right">
        <div class="navbar navbar-dark bg-info navbar_side">
            <b-navbar-brand><strong>Tools</strong></b-navbar-brand>
        </div>        
        
        <AdminAccordionSidebarButton class="sidebar_accordion_button_body_top_level" :text="'CLI Commands'" :accordionId="'CLI'" :accordionGroupId="'RightSideNav'"> 
           
            <AdminAccordionSidebarButton :text="'Database'" :accordionId="'DatabaseCli'" :accordionGroupId="'CLI'">           
                <b-card-body class="sidebar_accordion_card_body">                
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button class="sidebar_action_button" variant="success" :href="'#'" @click="onReRunMainSeederFile">Clear+Run Seeder</b-button>
                  </b-card-header>                  
                </b-card-body>          
            </AdminAccordionSidebarButton>
            
        </AdminAccordionSidebarButton>
    </div>
</div>
          `,
          type: 'html',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminComponentContent',
          code: `
<b-container class='main_container'>
  <b-card
    title="Home"
    img-height="256"
    img-src="https://picsum.photos/600/300/?image=25"
    img-alt="Image"
    img-top
    tag="article"
    class="col offset-xl-2 col-xl-8"
  >
    <b-card-text class='card_text'>
      An abstract framework based on node.js, Vue.js, Bootstrap and mariadb.
    </b-card-text>
    
  </b-card>
</b-container>
          `,
          type: 'html',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminComponentDatabaseModels',
          code: `
<b-container>
    <b-card>
        <b-row>
            <b-col cols="6">
                
            </b-col>
        </b-row>
        <!-- Main table element -->
        <b-table
          show-empty
          small
          stacked="md"
          :items="items"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
        >
          <template v-slot:cell(actions)="row">
            <b-button size="sm" @click="row.toggleDetails">
              {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
            </b-button>
          </template>
    
          <template v-slot:row-details="row">
    <!--            <DbItem :itemProps="{code: row.item.code, slug: row.item.slug}" />-->
                    <h1>row</h1>
          </template>
        </b-table>
    </b-card>
    
</b-container>
          `,
          type: 'html',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminComponentAccordionSidebarButton',
          code: `
<b-card-body class="sidebar_accordion_button_body">
    <b-card no-body>
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button class="sidebar_accordion_button" block href="#" v-b-toggle="'accordion_' + accordionId" variant="info">{{text}}</b-button>
      </b-card-header>
      <b-collapse v-bind="(collapsed ? {visible: true} : null)" :id="'accordion_' + accordionId" :accordion="'accordion_' + accordionGroupId" role="tabpanel">
        <slot></slot>
      </b-collapse>
    </b-card>
</b-card-body>
          `,
          type: 'html',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminComponentAccordionSidebarButtonMixin',
          code: `
({   
    props:{
        text: String,
        accordionId: String,
        accordionGroupId: String,
        collapsed: Boolean
    }
})
          `,
          type: 'javascript',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminComponentDatabaseModelsMixin',
          code: `
({
    data(){
        return {
            items: [],
            fields: [
              { key: 'id', label: 'ID', sortable: true, sortDirection: 'desc' },
              { key: 'name', label: 'Name', sortable: true },
              { key: 'tableName', label: 'Table Name', sortable: true },
              { key: 'actions', label: 'Actions' }
            ],
            form: {
            },
            totalRows: 1,
            currentPage: 1,
            perPage: 100,
            pageOptions: [5, 10, 15],
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [] 
        }
    },
    async mounted() {
      await this.get();
    },
    watch:{
        '$route.params.model': {
            async handler() {
                await this.get();       
            },
            deep: true
        }
    },
    methods: {        
        async get() {
              this.items.length = 0; 
              for (var model of this.store.state.admin.models){                  
                  if (model.name == this.$route.params.model){
                      this.fields.length = 0;
                      await this.axios.get(this.baseUrl + 'Script/' + model.attributesId).then(result=>{    
                          var fieldsObject = JSON.parse(result.data.code);
                          var keys = Object.keys(fieldsObject);
                          for (var key of keys){
                              this.fields.push({
                                  key: key,
                                  label: key.charAt(0).toUpperCase() + key.slice(1)
                              });        
                          };           
                          console.log(111, this.fields);             
                     })  
                  }
              }
              await this.axios.get(this.baseUrl + this.$route.params.model).then(result=>{    
                  this.items.push(...result.data);                  
              })             
        }
    }
})
          `,
          type: 'javascript',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminComponentSidebarToolsMixin',
          code: `
({
    methods:{
        onReRunMainSeederFile(){
            return;
            this.axios.get('/appster/api/reRunMainSeederFile').then((result)=>{
                window.location.reload();
            });
        }
    }
})
          `,
          type: 'javascript',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});
    },

    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Scripts', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'Script',
    table: 'Scripts',
    seeder: seeder,
  }
})()