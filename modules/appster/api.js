'use strict'

//appster modules
let utils;
let entity_register;

//remote modules
let express;
let Sequelize;

//private vars
let router;

class Api {
    constructor() {
        return this;
    }

    async start() {
        return new Promise(async resolve => {
            if (!express) {
                Sequelize = await utils.require('sequelize');
                express = await utils.require('express');
                router = express.Router();
            }

            const api = express();

            const port = 8080
            const ip = '127.0.0.1'

            const sequelize = new Sequelize('appster', 'root', null, {
                dialect: 'mariadb',
                dialectOptions:
                    {
                        connectTimeout: 1000
                    }
            })

            await sequelize
                .authenticate()
                .then(async () => {

                    // Add headers
                    api.use(function (req, res, next) {

                        // Website you wish to allow to connect
                        res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

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

                    entity_register = await entity_register.get(sequelize);

                    entity_register.forEach(entity => {
                        router.route('/' + entity.props.modelName + '/:slug')
                            .all(function (req, res, next) {
                                // runs for all HTTP verbs first
                                // think of it as route specific middleware!
                                next()
                            })
                            .get(async (req, res, next) => {
                                await entity.model.findOne({where: {slug: req.params.slug}}).then(result => {
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
                        resolve();
                    })

                })
                .catch(err => {
                    throw new Error('Unable to connect to the database:', err.message);
                });
        });
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    entity_register = await require('./entities/entity_register.js');

    resolve(new Api());
});