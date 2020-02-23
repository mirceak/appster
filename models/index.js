'use strict';

//appster modules
let utils;

module.exports = (async ()=>{
  const fs = require('fs');
  const path = require('path');
  utils = await require('../modules/appster/utils.js').promise;
  const Sequelize = await utils.require('sequelize');
  const basename = path.basename(__filename);
  const env = process.env.NODE_ENV || 'development';
  const config = require(__dirname + '/../config/config.json')[env];
  const db = {};
  db.models = {};

  let sequelize;
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }

  await fs
      .readdirSync(__dirname)
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
      })
      .reduce(async (result, file) => {
        const model = await sequelize['import'](path.join(__dirname, file));
        db[model.name] = await model;
        db.models[model.name] = db[model.name];
      }, null);

  Object.keys(db.models).forEach( modelName => {
    if (db.models[modelName].associate) {
      db.models[modelName].associate(db.models);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
})()
