'use strict';

module.exports = (sequelize, DataTypes)=>{
  const Model = sequelize.define('Model', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    props: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'scripts'
        },
        key: 'id'
      },
      allowNull: false
    },
    fields: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'scripts'
        },
        key: 'id'
      },
      allowNull: false
    },
    tableName: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
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

  });
  Model.associate = function(models) {
    // associations can be defined here
  };
  return Model;
}