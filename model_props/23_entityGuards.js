(()=>{
  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
    },
    entityModelId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'models'
        },
        key: 'id'
      },
      allowNull: false
    },
    guardsModelId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'models'
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
    models.EntityGuard.hasOne(models.Model, {foreignKey: 'id', sourceKey: 'entityModelId', as: 'entityModel'});
    models.EntityGuard.hasOne(models.Model, {foreignKey: 'id', sourceKey: 'guardsModelId', as: 'guardsModel'});
    models.Model.belongsTo(models.EntityGuard, {foreignKey: 'id'});
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