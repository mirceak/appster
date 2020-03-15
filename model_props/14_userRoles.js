(()=>{
  var attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: 'INTEGER'
    },
    userId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'users'
        },
        key: 'id'
      },
      allowNull: false
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
    models.User.belongsToMany(models.Role, { through: 'UserRoles' });
    models.Role.belongsToMany(models.User, { through: 'UserRoles' });
  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      return;
      await queryInterface.bulkInsert('UserRoles', [
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('UserRoles', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'UserRole',
    table: 'UserRoles',
    seeder: seeder,
  }
})()