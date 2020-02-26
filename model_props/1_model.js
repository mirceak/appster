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
    props: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'scripts'
        },
        key: 'id'
      },
      allowNull: false
    },
    fields: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'scripts'
        },
        key: 'id'
      },
      allowNull: false
    },
    tableName: {
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
      return queryInterface.bulkInsert('Models', [
        // {
        //     name: 'Script',
        //     fields: 1,
        //     props: 2,
        //     tableName: `Scripts`,
        //     type: 'model_table',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // },
        // {
        //     name: 'Settings',
        //     fields: 3,
        //     props: 4,
        //     tableName: `Settings`,
        //     type: 'model_table',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // },
        // {
        //     name: 'Module',
        //     props: JSON.stringify({
        //
        //     }),
        //     fields: JSON.stringify({
        //
        //     }),
        //     tableName: `Modules`,
        //     type: 'model_table',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // },
        // {
        //     name: 'Migration',
        //     props: JSON.stringify({
        //
        //     }),
        //     fields: JSON.stringify({
        //
        //     }),
        //     tableName: `Migrations`,
        //     type: 'model_table',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // },
        {
          name: 'Guard',
          fields: 1,
          props: 2,
          tableName: `Guards`,
          type: 'model_table',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        // {
        //     name: 'Component',
        //     props: JSON.stringify({
        //
        //     }),
        //     fields: JSON.stringify({
        //
        //     }),
        //     tableName: `Components`,
        //     type: 'model_table',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // },
        // {
        //     name: 'Mixin',
        //     props: JSON.stringify({
        //
        //     }),
        //     fields: JSON.stringify({
        //
        //     }),
        //     tableName: `Mixins`,
        //     type: 'model_table',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // },
        // {
        //     name: 'Route',
        //     props: JSON.stringify({
        //
        //     }),
        //     tableName: `Routes`,
        //     type: 'model_table',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // },
        // {
        //     name: 'User',
        //     props: JSON.stringify({
        //
        //     }),
        //     tableName: `Users`,
        //     type: 'model_table',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // },
        // {
        //     name: 'Role',
        //     props: JSON.stringify({
        //
        //     }),
        //     tableName: `Roles`,
        //     type: 'model_table',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // },
        // {
        //     name: 'model_table',
        //     props: JSON.stringify({
        //
        //     }),
        //     tableName: `Models`,
        //     type: 'model_table',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // },
        // {
        //     name: 'Column',
        //     props: JSON.stringify({
        //
        //     }),
        //     tableName: `Columns`,
        //     type: 'model_table',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // },
      ], {});
    },


    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Models', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'Model',
    table: 'Models',
    seeder: seeder,
  }
})()