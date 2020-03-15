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
    moduleId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'modules'
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
    models.Guard.hasOne(models.Module, {foreignKey: 'id', sourceKey: 'moduleId', as: 'module'});
    models.Module.belongsTo(models.Guard, {foreignKey: 'id'});
  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Guards', [
        {
          name: 'auth',
          type: 'user',
          moduleId: (await Sequelize.Module.findOne({where:{name: 'authGuard'}})).id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
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