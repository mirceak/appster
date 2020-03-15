(()=>{
  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
    },
    name: {
      unique: true,
      allowNull: false,
      type: 'STRING'
    },
    optionsId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'scripts'
        },
        key: 'id'
      },
      allowNull: false
    },
    fieldsId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'scripts'
        },
        key: 'id'
      },
      allowNull: false
    },
    attributesId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'scripts'
        },
        key: 'id'
      },
      allowNull: false
    },
    associateId: {
      type: 'INTEGER',
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
      type: 'STRING'
    },
    type: {
      allowNull: false,
      type: 'STRING'
    },
    createdAt: {
      allowNull: false,
      type: 'DATE'
    },
    updatedAt: {
      allowNull: false,
      type: 'DATE'
    }
  }

  var fields = Object.assign({

  }, attributes);

  var options = {

  }

  var associate = function(models) {
    // associations can be defined here
    models.Model.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'optionsId', as: 'options'});
    models.Model.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'fieldsId', as: 'fields'});
    models.Model.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'attributesId', as: 'attributes'});
    models.Model.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'associateId', as: 'associate'});
    models.Script.belongsTo(models.Model, {foreignKey: 'id'});
  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      return;
      return queryInterface.bulkInsert('Models', [
        {
          name: 'Guard',
          fields: 1,
          props: 2,
          tableName: `Guards`,
          type: 'model_table',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Models', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'Model',
    table: 'Models',
    seeder: seeder,
  }
})()