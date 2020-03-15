(()=>{
  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
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
    guardId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'guards'
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
    models.Module.belongsToMany(models.Guard, { through: 'ModuleGuards' });
    models.Guard.belongsToMany(models.Module, { through: 'ModuleGuards' });
  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      return;
      await queryInterface.bulkInsert('ModuleGuards', [
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('ModuleGuards', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'ModuleGuard',
    table: 'ModuleGuards',
    seeder: seeder,
  }
})()