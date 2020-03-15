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
    path: {
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
      return queryInterface.bulkInsert('Routes', [
        {
          name: 'root',
          path: '/',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'login',
          path: '/login',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'admin',
          path: '/admin',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        // {
        //   name: 'admin_root',
        //   path: '',
        //   createdAt: new Date(),
        //   updatedAt: new Date()
        // },
        // {
        //   name: 'admin_database',
        //   path: '/database',
        //   createdAt: new Date(),
        //   updatedAt: new Date()
        // },
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