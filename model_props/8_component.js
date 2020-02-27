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
    htmlId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'scripts'
        },
        key: 'id'
      },
      allowNull: false
    },
    mixinId: {
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

  }

  var associate = function(models) {
    // associations can be defined here
    models.Component.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'htmlId', as: 'html'});
    models.Component.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'mixinId', as: 'mixin'});
    models.Script.belongsTo(models.Component, {foreignKey: 'id'});
  }

  var seeder = {
    up: (queryInterface, Sequelize) => {
      return;
      return queryInterface.bulkInsert('Components', [
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Components', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'Component',
    table: 'Components',
    seeder: seeder,
  }
})()