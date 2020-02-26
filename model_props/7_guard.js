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

  }

  var associate = function(models) {
    // associations can be defined here
    models.Guard.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'javascriptId', as: 'javascript'});
    models.Script.belongsTo(models.Guard, {foreignKey: 'id'});
  }

  var seeder = {
    up: (queryInterface, Sequelize) => {
      return;
      return queryInterface.bulkInsert('Guards', [
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Guards', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'Guard',
    table: 'Guards',
    seeder: seeder,
  }
})()