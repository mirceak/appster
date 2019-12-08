'use strict';

//appster modules
let utils;

module.exports = (async (sequelize, DataTypes)=>{
  utils = await require('../modules/appster/utils.js').promise;
  const Sequelize = await utils.require('sequelize');
  const AppsterJSModule = sequelize.define('AppsterJSModule', {
    slug: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true
    },
    code: {
      type: Sequelize.TEXT
    }
  }, {});
  AppsterJSModule.associate = function(models) {
    // associations can be defined here
  };
  return AppsterJSModule;
})