(()=>{
  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
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
    models.EntityGuard.belongsTo(models.Model, {foreignKey: 'entityModelId', as: 'EntityModel'});
    models.EntityGuard.belongsTo(models.Model, {foreignKey: 'guardsModelId', as: 'GuardsModel'});
  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('EntityGuards', [
        {
          entityModelId: (await Sequelize.Model.findOne({where:{name: 'Route'}})).id,
          guardsModelId: (await Sequelize.Model.findOne({where:{name: 'RouteGuard'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          entityModelId: (await Sequelize.Model.findOne({where:{name: 'Component'}})).id,
          guardsModelId: (await Sequelize.Model.findOne({where:{name: 'ComponentGuard'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          entityModelId: (await Sequelize.Model.findOne({where:{name: 'Module'}})).id,
          guardsModelId: (await Sequelize.Model.findOne({where:{name: 'ModuleGuard'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          entityModelId: (await Sequelize.Model.findOne({where:{name: 'Model'}})).id,
          guardsModelId: (await Sequelize.Model.findOne({where:{name: 'ModelGuard'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('EntityGuards', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'EntityGuard',
    table: 'EntityGuards',
    seeder: seeder,
  }
})()