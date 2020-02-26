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
  }

  var seeder = {
    up: (queryInterface, Sequelize) => {
      return;
      return queryInterface.bulkInsert('Roles', [
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Roles', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'Role',
    table: 'Roles',
    seeder: seeder,
  }
})()