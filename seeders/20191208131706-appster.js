'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('AppsterJSModules', [{
            slug: 'appster_js_module_backend_remotes_module_main',
            code: `
(async ()=>{
    await new Promise(async(resolve) => {  
        var appsterApi = express();    
        var proxyModule = async (module)=>{
            return {
                guards: module.guards ? JSON.parse(module.guards) : undefined,
                compiled: await eval('(async ()=>{return await ' + module.code + '})()')
            };
        };
        
        var remoteModule = async (slug)=>{
            return new Promise(async _resolve=>{
                await sequelize.AppsterJSModule.findOne({where:{slug: slug}}).then(async result=>{    
                    _resolve(await proxyModule(result.dataValues));
                })
            })
        };
        
        await (await remoteModule("appster_js_module_backend_appster_config")).compiled(appsterApi, MySQLStore, bodyParser, cors, session, config, passwordHash);
        await (await remoteModule("appster_js_module_backend_appster_sequelize")).compiled(sequelize, remoteModule);
        await (await remoteModule("appster_js_module_backend_login_scaffold")).compiled(passport, frontEndRouter, appsterApi, sequelize);
        await (await remoteModule("appster_js_module_backend_appster_router")).compiled(frontEndRouter, appsterApiRouter, appsterApi, sequelize, config, resolve, shell, remoteModule);
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
        
    var itemName = "AppsterJSModule";
    var _remoteModule = async (slug)=>{return await remoteModule(axios, baseUrl, itemName, slug)};    
    var remotes = await (await _remoteModule('appster_js_module_frontend_remotes')).compiled(_remoteModule, $);
    
    Vue.prototype.$remotes = remotes;
    await Vue.component("VueAceEditor", VueAceEditor);
    
    Vue.use(Vuex);    
    const remoteStore = await (await remotes.module("appster_js_module_frontend_remotes_store")).compiled(remotes);
    const store = new Vuex.Store(remoteStore)
    Vue.prototype.store = store;
    
    const router = new VueRouter({
        mode: 'history',
        routes: remotes.routes
    });    
    Vue.use(VueRouter);
        
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
(async (remoteModule, $)=>{  
    var remotes = {
        module: remoteModule
    };
    var parsers = {
        classParser: await (await remotes.module('appster_js_module_frontend_class_parser')).compiled(remotes, $),
    };    
    var stringParser = await (await remotes.module('appster_js_module_frontend_remotes_component_string_parser')).compiled(remotes, parsers);  
    remotes.component = await (await remoteModule("appster_js_module_frontend_remotes_component")).compiled(remotes, stringParser);
    remotes.routes = await (await remotes.module("appster_js_module_frontend_remotes_routes_manager")).compiled(remotes);
    
    return remotes;
})   
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_remotes',
            code: `
(async (remoteModule)=>{  
    var remotes = {
        module: remoteModule,
    };
    
    remotes.routes = await (await remotes.module("appster_js_module_backend_remotes_routes_manager")).compiled(remotes); 
    
    return remotes;
})   
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_login_scaffold',
            code: `
(async (passport, frontRouter, api, sequelize)=>{     
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
   
    api.use(passport.initialize());
    api.use(passport.session());    
        
    frontRouter.post('/login',
        passport.authenticate('local', 
            { 
                successRedirect: '/admin',
                failureRedirect: '/login'
             }
         )
    );
})   
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_appster_config',
            code: `
(async (appsterApi, MySQLStore, bodyParser, cors, session, config, passwordHash)=>{       
    const secret = passwordHash.generate(crypto.randomBytes(256).toString() + new Date());     
    var options = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'appster',
    };     
    var sessionStore = new MySQLStore(options);    
    
    appsterApi.use(cors());
    appsterApi.use(bodyParser.urlencoded({ extended: true }));
    appsterApi.use(bodyParser.json());
        
    appsterApi.use(session({
        secret: secret,
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    }));
})   
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_appster_sequelize',
            code: `
(async (sequelize, remoteModule)=>{       
    var models = await (await remoteModule("appster_js_module_backend_appster_models")).compiled(sequelize, remoteModule);
    
    Object.keys(models).map(async (current)=>{
        current = models[current];
        var model = sequelize.sequelize.define(current.model, current.fields, {});
    
        if (current.associations){
            model.associate = current.associations;
        }        
    
        sequelize[current.model] = model;
        sequelize.models[current.model] = sequelize[current.model];
    });
    
    Object.keys(models).map(async (current)=>{
        current = models[current];
        if (sequelize[current.model].associate) {
            sequelize[current.model].associate(sequelize);
        }
    });
    
    await sequelize.Migration.findOne({where:{slug: "appster_js_module_backend_appster_model_migration_migration"}}).then(result=>{
        console.log("APPSTER____________________________________________________________________________________________________First migration already created.");
    }).catch(async err=>{    
        console.log("APPSTER____________________________________________________________________________________________________Creating first ever migrations.");
        if (err.name == 'SequelizeDatabaseError'){
            var migrationModel = await Object.keys(models).reduce(async (reduced, current)=>{
                current = models[current];
                if (current.model == "Migration"){
                    reduced = current;
                };
                return reduced;
            }, null);
            await migrationModel.migration.up(sequelize.sequelize.getQueryInterface(), sequelize.Sequelize, remoteModule);
            await sequelize.sequelize.getQueryInterface().bulkInsert(migrationModel.table, [
                {
                    slug: "appster_js_module_backend_appster_model_migration_migration",
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ])
        }else{
            throw new Error("Something went wrong");
        }
    });
    
    Object.keys(models).map(async (current)=>{        
        current = models[current];
        if (current.model == "Migration") return;
        
        if (current.migration){        
            await sequelize.Migration.findOne({where:{slug: current.migration.name}}).then(async migration=>{
                if (migration == null){           
                    await current.migration.up(sequelize.sequelize.getQueryInterface(), sequelize.Sequelize, remoteModule);
                    await sequelize.sequelize.getQueryInterface().bulkInsert("Migrations", [
                        {
                            slug: current.migration.name,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ]);
                    if (current.seeder){                          
                        await sequelize.sequelize.getQueryInterface().bulkInsert(current.table, current.seeder)
                    } 
                }
            })  
        }      
    });
})   
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_appster_model_user_migration',
            code: `
(async ()=>{
    return {
        up: async (queryInterface, Sequelize, remoteModule) => {
            return queryInterface.createTable('Users', await (await remoteModule("appster_js_module_backend_appster_model_user_fields")).compiled(sequelize) );
        },
        down: async (queryInterface, Sequelize) => {
            return queryInterface.dropTable('Users');
        },
        name: "appster_js_module_backend_appster_model_user_migration"
    }    
})()      
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_appster_model_user_seeder',
            code: `
(async ()=>{
    return [
        {
            password: "1",
            username: "1",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]    
})()      
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_appster_models',
            code: `
(async (sequelize, remoteModule)=>{   
    return {
        user: await (await remoteModule("appster_js_module_backend_appster_model_user")).compiled(sequelize, remoteModule),
        migration: await (await remoteModule("appster_js_module_backend_appster_model_migration")).compiled(sequelize, remoteModule)   
    }
})   
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_appster_model_user',
            code: `
(async (sequelize, remoteModule)=>{   
    return {
        table: "Users",
        model: "User",
        migration: await remoteModule("appster_js_module_backend_appster_model_user_migration").compiled,
        seeder: await remoteModule("appster_js_module_backend_appster_model_user_seeder").compiled,
        fields: await (await remoteModule("appster_js_module_backend_appster_model_user_fields")).compiled(sequelize),
        associations: await remoteModule("appster_js_module_backend_appster_model_user_associations").compiled          
    }
})
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_appster_model_migration',
            code: `
(async (sequelize, remoteModule)=>{   
    return {
        table: "Migrations",
        model: "Migration",
        migration: await remoteModule("appster_js_module_backend_appster_model_migration_migration"),
        fields: await (await remoteModule("appster_js_module_backend_appster_model_migration_fields")).compiled(sequelize) 
    }
})
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_appster_model_migration_migration',
            code: `
(async ()=>{
    return {
        up: async (queryInterface, Sequelize, remoteModule) => {
            return queryInterface.createTable('Migrations', await (await remoteModule("appster_js_module_backend_appster_model_migration_fields")).compiled(sequelize) );
        },
        down: async (queryInterface, Sequelize, remoteModule) => {
            return queryInterface.dropTable('Migrations');
        },
        name: "appster_js_module_backend_appster_model_migration_migration"
    }    
})() 
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_appster_model_migration_fields',
            code: `
(async (Sequelize)=>{   
    Sequelize = Sequelize.Sequelize;
    return {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        slug: {
            unique: true,
            allowNull: false,
            type: Sequelize.STRING
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }
    }
})
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_appster_model_user_associations',
            code: `
(async (sequelize)=>{
    
})
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_appster_model_user_fields',
            code: `
(async (Sequelize)=>{   
    Sequelize = Sequelize.Sequelize;
    return {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            unique: true,
            allowNull: false,
            type: Sequelize.STRING
        },
        password: {
            allowNull: false,
            type: Sequelize.STRING
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }
    }
})
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_appster_router',
            code: `
(async (frontRouter, apiRouter, api, sequelize, config, resolve, shell, remoteModule)=>{
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
                            
                        return res.redirect('/appster/api/AppsterJSModule/appster_js_module_frontend_remotes_component_Login');
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
        apiRouter.route('/' + key)
            .all(isLoggedIn)
            .get(async (req, res, next) => {
                await entity.findAll().then(result => {
                    res.send(result)
                }).catch(err => {
                    res.send(err)
                })
            })
        apiRouter.route('/' + key + '/:slug')
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
        apiRouter.route('/reRunMainSeederFile')
            .all(isLoggedIn)
            .get(async (req, res, next) => {                
                await shell.run_command('npx sequelize-cli db:seed:undo:all \\n exit \\n');
                await shell.run_command('npx sequelize-cli db:seed:all \\n exit \\n');
                
                res.send({message: "success", status: 200})
            })
    });    
    
    var remotes = await (await remoteModule('appster_js_module_backend_remotes')).compiled(remoteModule);
    for (var i=remotes.routes.length-1; i>=0; i--){
        ((route)=> {
            var controller = function(req, res, next) {     
                if (route.guards){
                    for (var guard of route.guards){
                        if (guard.condition && !guard.condition(req)){
                            return res.redirect('/' + guard.redirectRoute);
                        }
                    }
                };
                if (route.module){
                    route.module(req, res, next);
                    return;
                };
                res.sendFile('app/dist/appster_index.html', { root: './' });
            };
            frontRouter.get(route.fullPath, controller);
        })(remotes.routes[i]);
    };
        
    api.use(express.static('app/dist'), frontRouter);
    api.use(config.apiExt, apiRouter);      
    api.use(frontRouter);
    
    await api.listen(config.apiPort, config.apiIp, () => {
        console.log("APPSTER____________________________________________________________________________________________________http api server started.");
        resolve();
    });
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
            slug: 'appster_js_module_frontend_remotes_routes_manager',
            code: `
(async (remotes)=>{     
    var routes = await (await remotes.module('appster_js_module_frontend_remotes_routes')).compiled;
    
    var loadComponents = async (current)=>{
        current.component = await remotes.component(current.component);
        if (current.children) {
            for (var i=0; i<current.children.length; i++){
                current.children[i] = await loadComponents(current.children[i]);
            };
        };
        return current;
    };    
    var result = [];
    for (var i=0; i<routes.length; i++){
        var current = routes[i];    
        for (var guard of current.guards){
            current.guards[current.guards.indexOf(guard)] = await (await remotes.module(guard)).compiled;
        };
        current = await loadComponents(current);  
        result.push(current);         
    };    
    return result.map((current)=>{
        var mapped = Object.assign({}, current);
        delete mapped.module;
        return mapped; 
    })
})
       
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_backend_remotes_routes_manager',
            code: `
(async (remotes)=>{     
    var routes = await (await remotes.module('appster_js_module_frontend_remotes_routes')).compiled;
    
    var result = [];
    var parseRoutes = async (routes, parent = null)=>{
        for (var route of routes){  
            delete route.component;
              
            if (!parent){
                if (route.path.indexOf('/') == 0){
                    route.fullPath = route.path.substr(1);
                }
                route.fullPath = '/' + route.fullPath;
            }else{
                route.parent = parent;
                route.fullPath = parent.fullPath + '/' + route.path;                
            }
              
            if (route.guards){
                for (var guard of route.guards){
                    route.guards[route.guards.indexOf(guard)] = await (await remotes.module(guard)).compiled;
                };
            };
                        
            if (route.module){
                route.module = await (await remotes.module(route.module)).compiled;
            };
                     
            result.push(route);
            
            if (route.children){
                parseRoutes(route.children, route.fullPath);
            }
        }    
    };
    await parseRoutes(routes);
        
    return result;
})
       
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_route_guard_auth',
            code: `
{
    name: 'auth',
    condition: (req)=>{
        return req.isAuthenticated();
    },
    redirectRoute: 'login'
}
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_route_guard_web',
            code: `
{
    name: 'web'
}
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_route_module_root',
            code: `
(async (req, res, next)=>{
    res.sendFile('app/dist/appster_index.html', { root: './' });
})
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_route_module_login',
            code: `
(async (req, res, next)=>{
    if (req.isAuthenticated()){
        res.redirect('/admin');   
    }else{    
        res.sendFile('app/dist/appster_index.html', { root: './' });
    };
})
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_routes',
            code: `
[          
    {
        guards: [
            'appster_js_module_frontend_remotes_route_guard_web'
        ],
        name: 'root',   
        path: '/',
        component: 'appster_js_module_frontend_remotes_component_Welcome',
        module: 'appster_js_module_frontend_remotes_route_module_root'
    },
    {
        guards: [
            'appster_js_module_frontend_remotes_route_guard_web'
        ],
        name: 'login',   
        path: '/login',
        component: 'appster_js_module_frontend_remotes_component_Login',
        module: 'appster_js_module_frontend_remotes_route_module_login'
    },
    {
        guards: [
            'appster_js_module_frontend_remotes_route_guard_auth'
        ],
        name: 'admin',
        path: '/admin',
        component: 'appster_js_module_frontend_remotes_component_Admin',
        // module: 'appster_js_module_frontend_remotes_route_module_admin',
        children: [
            {
                name: '_root',   
                path: '',
                component: 'appster_js_module_frontend_remotes_component_Welcome',
                // module: 'appster_js_module_frontend_remotes_route_module__root',
            },
            {
                name: '_login',   
                path: 'login',
                component: 'appster_js_module_frontend_remotes_component_Login',
                // module: 'appster_js_module_frontend_remotes_route_module__login',
            },
            {
                name: '_admin',
                path: 'admin',
                component: 'appster_js_module_frontend_remotes_component_Admin',
                // module: 'appster_js_module_frontend_remotes_route_module__admin',
            }
        ]
    }
]
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_component',
            code: `
(async (remotes, stringParser)=>{
    return async (slug)=>{      
        var model = (await remotes.module(slug));
        var module = model.compiled ? model.compiled : {};
        module.guards = model.guards;
        
        if (stringParser && module.template){
            module.template = await stringParser(module.template);
        };
        
        if (module.mixins && Array.isArray(module.mixins)){
          module.mixins = await module.mixins.reduce(async (result, current) => {
              await (typeof current === 'string' || current instanceof String) ? result.push((await remotes.module(current, remotes)).compiled) : result.push(current);
              return result;
          }, []);
        };
        if (module.components && !Array.isArray(module.components)){
            module.components = await Object.keys(module.components).reduce(async (result, current) => {            
                var label = current;
                current = module.components[label];
                result = await result;
                result[label] = await remotes.component(current);
                return result;
            }, {});
        };
        return module;
    }
})
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_component_string_parser',
            code: `
(async (remotes, parsers)=>{
    return async (string)=>{        
        var separators = [
            {
                parser: parsers.classParser,
                pre: '{#class=#{', 
                post: '}#=#}'
            }
        ];
        
        for (var i=0; i<separators.length; i++){        
            while (string.includes(separators[i].pre) && string.includes(separators[i].post)){
                var separator = separators[i];
                var objVal = string.split(separator.pre).pop().split(separator.post)[0];     
                var objArr = objVal.trim().split(' ');
                for (var j=0; j<objArr.length; j++){   
                     await separator.parser(objArr[j]);
                };
                string = string.replace(separator.pre+objVal+separator.post, objArr.toString().split(',').toString().replace(/,/g, ' '));       
            }
        };
        
        return string;
    }
})
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_class_parser',
            code: `
(async (remotes, $)=>{
    var loadedClasses = [];
    return async (id)=>{
        var oldResult = loadedClasses.reduce((result, current)=>{
           if (current.id == id){
                result = current;
                return result;
           } 
        }, null);
        if (!oldResult){
            var classString = await (await remotes.module('appster_js_module_frontend_class_parser_id_'+id)).compiled(); 
            var classObject = {
                id: id,
                code: classString
            };
            loadedClasses.push(classObject);   
            if ($ != null){
                $("<style type='text/css'> " + classString + " </style>").appendTo("head");
            }                     
            return classObject;  
        }
    }
})
            `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_class_parser_id_main_container',
            code: `
(async ()=>{
    return \`   
        .main_container_router_view {
            max-height: calc(100vh - 56px);
            min-height: 100vh;
            width: auto; 
            overflow-y: auto;
        }
        
        .main_container_sidebar_col {
            margin: 0; 
            padding: 0; 
            min-width: 200px; 
            max-width: 200px;
            min-height: 100vh; 
            max-height: 100vh
        }
        .main_container_col {
            width: auto; 
            margin: 0; 
            padding: 0;
        }
        .main_container_row {
            margin: 0; 
            padding: 0;
        }
        .main_container {
            padding: 0; 
            margin: 0; 
            max-width: 100%;
        }
        .side_nav_right {
            border-left-style: solid;        
        }
        .side_nav_left {
            border-right-style: solid;   
        }
        .navbar_side {
            border-bottom-style: solid;   
            border-color: lightgray;
        }
        .side_nav {
            border-color: lightgray; 
            min-width: 100%; 
            max-width: 100%; 
            min-height: 100vh; 
            max-height: 100vh;
        }        
        .sidebar_accordion_button {
            text-align: left
        }
        .sidebar_action_button {
            text-align: left;
            width: 100%
        }
        .sidebar_accordion_card_body {
            padding: 4px;
        }
        .top_navbar {
            margin: 0px; 
            padding: 8px 4px
        }
    \`
})
            `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_class_parser_id_card_text',
            code: `
(async ()=>{
    return \`   
        .card_text {
            color: red;
        }
    \`
})
            `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_component_Admin',
            guards:
                `[
                    "auth"
                ]`,
            code: `
            {
                name: \'Admin\',
                template: \`
<b-container class='{#class=#{main_container}#=#}'>
    <b-row class="main_container_row">
        <b-col class="main_container_sidebar_col">
            <AppsterSidebarNav></AppsterSidebarNav>         
        </b-col>
        <b-col class="main_container_col">
            <router-view class="main_container_router_view"></router-view>
        </b-col>   
        <b-col class="main_container_sidebar_col">
            <AppsterSidebarTools></AppsterSidebarTools>         
        </b-col>
    </b-row>
</b-container>
\`
                , mixins: 
[
]
                , components:
{
    AppsterSidebarNav:'appster_js_module_frontend_remotes_component_AppsterSidebarNav',
    AppsterSidebarTools:'appster_js_module_frontend_remotes_component_AppsterSidebarTools'
}
            }
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_component_AppsterSidebarNav',
            guards:
                `[
                    "auth"
                ]`,
            code: `
            {
                name: \'AppsterSidebarNav\',
                template: \`       
<div>
    <div class="side_nav side_nav_left">
        <div class="navbar navbar-dark bg-info navbar_side">
            <b-navbar-brand><strong>Navigation</strong></b-navbar-brand>
        </div>   
    </div>
</div>
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
            slug: 'appster_js_module_frontend_remotes_component_AppsterSidebarTools',
            guards:
                `[
                    "auth"
                ]`,
            code: `
            {
                name: \'AppsterSidebarTools\',
                template: \`       
<div>
    <div class="side_nav side_nav_right">
        <div class="navbar navbar-dark bg-info navbar_side">
            <b-navbar-brand><strong>Tools</strong></b-navbar-brand>
        </div>
        
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button class="sidebar_accordion_button" block href="#" v-b-toggle.accordion-1 variant="info">Database</b-button>
          </b-card-header>
          <b-collapse id="accordion-1" accordion="my-accordion1" role="tabpanel">
            <b-card-body class="sidebar_accordion_card_body">
                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button class="sidebar_accordion_button" block href="#" v-b-toggle.accordion-2 variant="info">CLI Commands</b-button>
                  </b-card-header>
                  <b-collapse id="accordion-2" accordion="my-accordion2" role="tabpanel">
                    <b-card-body class="sidebar_accordion_card_body">
                      <b-button class="sidebar_action_button" variant="warning" @click="onReRunMainSeederFile">Clear+Run Seeder</b-button>
                    </b-card-body>
                  </b-collapse>
                </b-card>
            </b-card-body>
          </b-collapse>
        </b-card>
    </div>
</div>
\`
                , mixins: 
[
    {
        methods:{
            onReRunMainSeederFile(){
                this.axios.get('/appster/api/reRunMainSeederFile').then((result)=>{
                    window.location.reload();
                });
            }
        }
    }
]
                , components:
{
}
            }
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_component_AppsterNavbar',
            guards:
                `[
                    "auth"
                ]`,
            code: `
            {
                name: \'AppsterNavbar\',
                template: \`
<b-navbar toggleable="lg" type="dark" variant="info" class="top_navbar"">
    <b-navbar-brand href="#">NavBar</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">Link</b-nav-item>
        <b-nav-item href="#" disabled>Disabled</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>

        <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
</b-navbar>
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
            slug: 'appster_js_module_frontend_remotes_component_Welcome',
            code: `
            {
                name: \'Welcome\',
                template: \`
<b-container class='{#class=#{main_container}#=#}'>
  <b-card
    title="Home"
    img-height="256"
    img-src="https://picsum.photos/600/300/?image=25"
    img-alt="Image"
    img-top
    tag="article"
    class="col offset-xl-2 col-xl-8"
  >
    <b-card-text class='{#class=#{card_text}#=#}'>
      An abstract framework based on node.js, Vue.js, Bootstrap and mariadb.
    </b-card-text>
    
    <a v-bind:href="this.$router.resolve({name: 'login'}).href">Login</a>
    <a v-bind:href="this.$router.resolve({name: 'admin'}).href">Admin</a>
    
  </b-card>
</b-container>
\`
    ,mixins: 
[
]
    ,components:
{
}

}
      `,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            slug: 'appster_js_module_frontend_remotes_component_Base',
            guards:
                `[
                    "web"
                ]`,
            code: `
            {
                name: \'Base\',
                template: \`
<b-container class='{#class=#{main_container}#=#}'>
    <router-view></router-view>
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
                    "web"
                ]`,
            code: `
            {
                name: \'Login\',
                template: \`
<b-container class='{#class=#{main_container}#=#}'>
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
