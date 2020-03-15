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
    componentId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'components'
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
    models.FrontendRoute.hasOne(models.Route, {foreignKey: 'id', sourceKey: 'routeId', as: 'route'});
    models.FrontendRoute.hasOne(models.Component, {foreignKey: 'id', sourceKey: 'componentId', as: 'component'});

    models.Route.belongsTo(models.FrontendRoute, {foreignKey: 'id', as: "frontEndRoute"});
    models.Component.belongsTo(models.FrontendRoute, {foreignKey: 'id'});
  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('FrontendRoutes', [
        {
          name: 'root',
          type: 'root_page',
          routeId: (await Sequelize.Route.findOne({where: {name: 'root'}})).id,
          componentId: (await Sequelize.Component.findOne({where: {name: 'Welcome'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'login',
          type: 'root_page',
          routeId: (await Sequelize.Route.findOne({where: {name: 'login'}})).id,
          componentId: (await Sequelize.Component.findOne({where: {name: 'Login'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'admin',
          type: 'root_page',
          routeId: (await Sequelize.Route.findOne({where: {name: 'admin'}})).id,
          componentId: (await Sequelize.Component.findOne({where: {name: 'Admin'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'admin_root',
          type: 'page',
          routeId: (await Sequelize.Route.findOne({where: {name: 'admin_root'}})).id,
          componentId: (await Sequelize.Component.findOne({where: {name: 'AdminContent'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'admin_database',
          type: 'page',
          routeId: (await Sequelize.Route.findOne({where: {name: 'view_all'}})).id,
          componentId: (await Sequelize.Component.findOne({where: {name: 'AdminDatabaseModels'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('FrontendRoutes', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'FrontendRoute',
    table: 'FrontendRoutes',
    seeder: seeder,
  }
})()