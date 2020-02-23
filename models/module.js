'use strict';

module.exports = (sequelize, DataTypes)=>{
  const Module = sequelize.define('Module', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    javascriptId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'scripts'
        },
        key: 'id'
      },
      allowNull: false,
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING
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
    scopes: {
      modules: {
        where: {
          type: 'module'
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['name', 'type']
      }
    ]
  });
  Module.associate = function(models) {
    // associations can be defined here
    Module.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'javascriptId', as: 'javascript'});
    models.Script.belongsTo(Module, {foreignKey: 'id'});
  };
  return Module;
}