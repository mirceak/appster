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
    path: {
      allowNull: false,
      type: 'STRING'
    },
    backendJavascriptId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'scripts'
        },
        key: 'id'
      },
      allowNull: true
    },
    frontendJavascriptId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'scripts'
        },
        key: 'id'
      },
      allowNull: true
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
    models.Route.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'backendJavascriptId', as: 'backendJavascript'});
    models.Route.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'frontendJavascriptId', as: 'frontendJavascript'});
    models.Script.belongsTo(models.Route, {foreignKey: 'id'});

    models.Route.hasOne(models.Component, {foreignKey: 'id', sourceKey: 'componentId', as: 'component'});
    models.Component.belongsTo(models.Route, {foreignKey: 'id'});
  }

  var seeder = {
    up: (queryInterface, Sequelize) => {
      return;
      return queryInterface.bulkInsert('Routes', [
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Routes', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'Route',
    table: 'Routes',
    seeder: seeder,
  }
})()