'use strict';

module.exports = (sequelize, DataTypes)=>{
  const Settings = sequelize.define('Settings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    mainBackendModuleId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'modules'
        },
        key: 'id'
      },
      allowNull: false,
    },
    mainFrontendModuleId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'modules'
        },
        key: 'id'
      },
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {

  });
  Settings.associate = function(models) {
    // associations can be defined here
    Settings.hasOne(models.Module, {foreignKey: 'id', sourceKey: 'mainBackendModuleId', as: 'mainBackendModule'});
    Settings.hasOne(models.Module, {foreignKey: 'id', sourceKey: 'mainFrontendModuleId', as: 'mainFrontendModule'});
    models.Module.belongsTo(Settings, {foreignKey: 'id'});
  };
  return Settings;
}