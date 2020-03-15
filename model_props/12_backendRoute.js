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
    type: {
      allowNull: false,
      type: 'STRING'
    },
    routeId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'routes'
        },
        key: 'id'
      },
      allowNull: false
    },
    moduleId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'modules'
        },
        key: 'id'
      },
      allowNull: true
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
    models.BackendRoute.hasOne(models.Route, {foreignKey: 'id', sourceKey: 'routeId', as: 'route'});
    models.BackendRoute.hasOne(models.Module, {foreignKey: 'id', sourceKey: 'moduleId', as: 'module'});

    models.Route.belongsTo(models.BackendRoute, {foreignKey: 'id'});
    models.Module.belongsTo(models.BackendRoute, {foreignKey: 'id'});
  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('BackendRoutes', [
        {
          name: 'root',
          type: 'page',
          routeId: (await Sequelize.Route.findOne({where: {name: 'root'}})).id,
          moduleId: (await Sequelize.Module.findOne({where: {name: 'routeModuleRootPage'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'login',
          type: 'page',
          routeId: (await Sequelize.Route.findOne({where: {name: 'login'}})).id,
          moduleId: (await Sequelize.Module.findOne({where: {name: 'routeModuleLoginPage'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'admin',
          type: 'page',
          routeId: (await Sequelize.Route.findOne({where: {name: 'admin'}})).id,
          moduleId: (await Sequelize.Module.findOne({where: {name: 'routeModuleAdminPage'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('BackendRoutes', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'BackendRoute',
    table: 'BackendRoutes',
    seeder: seeder,
  }
})()