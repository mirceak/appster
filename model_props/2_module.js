(()=>{
  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
    },
    name: {
      allowNull: false,
      type: 'STRING'
    },
    javascriptId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'scripts'
        },
        key: 'id'
      },
      allowNull: false
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
    scopes: {
      appster_modules: {
        where: {
          type: 'appster_module'
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['name', 'type']
      }
    ]
  }

  var associate = function(models) {
    // associations can be defined here
    models.Module.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'javascriptId', as: 'javascript'});
    models.Script.belongsTo(models.Module, {foreignKey: 'id'});
  }

  var seeder = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Modules', [
        {
          name: 'mainBackend',
          javascriptId: 51,
          type: 'kernel',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'mainFrontend',
          javascriptId: 52,
          type: 'kernel',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'databaseManager',
          javascriptId: 53,
          type: 'appster_module',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});
    },

    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Modules', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'Module',
    table: 'Modules',
    seeder: seeder,
  }
})()