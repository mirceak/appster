(()=>{

  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
    },
    javascriptId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'modules'
        },
        key: 'id'
      },
      allowNull: false
    },
    index: {
      allowNull: false,
      type: 'INTEGER'
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
    models.Migration.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'javascriptId', as: 'javascript'});
    models.Script.belongsTo(models.Migration, {foreignKey: 'id'});
  }

  var seeder = {
    up: (queryInterface, Sequelize) => {
      // return queryInterface.bulkInsert('Migrations', [
      //
      // ], {});
    },

    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Migrations', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'Migration',
    table: 'Migrations',
    seeder: seeder,
  }
})()
