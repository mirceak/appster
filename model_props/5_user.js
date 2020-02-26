(()=>{
  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
    },
    username: {
      unique: true,
      allowNull: false,
      type: 'STRING'
    },
    password: {
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
      return queryInterface.bulkInsert('Users', [
        {
          password: "1",
          username: "1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'User',
    table: 'Users',
    seeder: seeder,
  }
})()