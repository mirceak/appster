(()=>{
  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
    },
    mainBackendModuleId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'modules'
        },
        key: 'id'
      },
      allowNull: false,
    },
    mainFrontendModuleId: {
      type: 'INTEGER',
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
    models.Settings.hasOne(models.Module, {foreignKey: 'id', sourceKey: 'mainBackendModuleId', as: 'mainBackendModule'});
    models.Settings.hasOne(models.Module, {foreignKey: 'id', sourceKey: 'mainFrontendModuleId', as: 'mainFrontendModule'});
    models.Module.belongsTo(models.Settings, {foreignKey: 'id'});
  }

  var seeder = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Settings', [
        {
          mainBackendModuleId: 1,
          mainFrontendModuleId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Settings', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'Settings',
    table: 'Settings',
    seeder: seeder,
  }
})()