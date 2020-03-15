(()=>{
  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
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
    guardId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'guards'
        },
        key: 'id'
      },
      allowNull: false
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
    models.Route.belongsToMany(models.Guard, { through: 'RouteGuards' });
    models.Guard.belongsToMany(models.Route, { through: 'RouteGuards' });

    models.RouteGuard.hasMany(models.Guard, {foreignKey: 'id', sourceKey: 'guardId', as: 'guards'});
    models.Guard.belongsTo(models.RouteGuard, {foreignKey: 'id'});
  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      return;
      await queryInterface.bulkInsert('RouteGuards', [
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('RouteGuards', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'RouteGuard',
    table: 'RouteGuards',
    seeder: seeder,
  }
})()