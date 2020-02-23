'use strict';

module.exports = (sequelize, DataTypes)=>{
  const Script = sequelize.define('Script', {
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
    code: {
      allowNull: false,
      type: DataTypes.STRING(20000)
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
    indexes: [
      {
        unique: true,
        fields: ['name', 'type']
      }
    ]
  });
  Script.associate = function(models) {
    // associations can be defined here
  };
  return Script;
}