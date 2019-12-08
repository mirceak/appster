'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
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
};