(()=>{
  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
    },
    roleId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'roles'
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
    models.Guard.belongsToMany(models.Role, { through: 'GuardRoles' });
    models.Role.belongsToMany(models.Guard, { through: 'GuardRoles' });
  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      return;
      await queryInterface.bulkInsert('GuardRoles', [
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('GuardRoles', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'GuardRole',
    table: 'GuardRoles',
    seeder: seeder,
  }
})()