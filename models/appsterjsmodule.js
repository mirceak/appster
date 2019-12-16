'use strict';

module.exports = (sequelize, DataTypes)=>{
  const AppsterJSModule = sequelize.define('AppsterJSModule', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    slug: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    guards: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    code: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  AppsterJSModule.associate = function(models) {
    // associations can be defined here
  };
  return AppsterJSModule;
}