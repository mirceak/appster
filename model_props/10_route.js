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
    indexes: [
      {
        unique: true,
        fields: ['name', 'path']
      }
    ]
  }

  var associate = function(models) {
    // associations can be defined here

  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Routes', [
        {
          name: 'root',
          path: '/',
          type: 'root',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'login',
          path: '/login',
          type: 'root',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'admin',
          path: '/admin',
          type: 'root',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'admin_root',
          path: '',
          type: 'sibling',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'view_all',
          path: 'view-all/:model',
          type: 'sibling',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});

      var route = await Sequelize.Route.findOne({where:{name: 'admin'}})
      await route.addGuard(await Sequelize.Guard.findOne({where:{name: 'auth', type: 'user'}}))
      await route.addSibling( (await Sequelize.Route.findOne({where:{name: 'admin_root'}})) );
      await route.addSibling( (await Sequelize.Route.findOne({where:{name: 'view_all'}})) );

      route = await Sequelize.Route.findOne({where:{name: 'admin_root'}})
      await route.addGuard(await Sequelize.Guard.findOne({where:{name: 'auth', type: 'user'}}))

      route = await Sequelize.Route.findOne({where:{name: 'view_all'}})
      await route.addGuard(await Sequelize.Guard.findOne({where:{name: 'auth', type: 'user'}}))
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