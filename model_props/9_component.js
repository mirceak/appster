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
    htmlId: {
      type: 'INTEGER',
      references: {
        model: {
          tableName: 'scripts'
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
    models.Component.hasOne(models.Script, {foreignKey: 'id', sourceKey: 'htmlId', as: 'html'});
    models.Script.belongsTo(models.Component, {foreignKey: 'id'});
  }

  var seeder = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Components', [
        {
          name: 'Login',
          htmlId: (await Sequelize.Script.findOne({where:{name: 'LoginPageComponent'}})).id,
          type: 'page',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Welcome',
          htmlId: (await Sequelize.Script.findOne({where:{name: 'WelcomePageComponent'}})).id,
          type: 'page',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Admin',
          htmlId: (await Sequelize.Script.findOne({where:{name: 'AdminPageComponent'}})).id,
          type: 'page',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminSidebarNav',
          htmlId: (await Sequelize.Script.findOne({where:{name: 'AdminComponentSidebarNav'}})).id,
          type: 'component',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminSidebarTools',
          htmlId: (await Sequelize.Script.findOne({where:{name: 'AdminComponentSidebarTools'}})).id,
          type: 'component',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminContent',
          htmlId: (await Sequelize.Script.findOne({where:{name: 'AdminComponentContent'}})).id,
          type: 'component',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminAccordionSidebarButton',
          htmlId: (await Sequelize.Script.findOne({where:{name: 'AdminComponentAccordionSidebarButton'}})).id,
          type: 'component',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'AdminDatabaseModels',
          htmlId: (await Sequelize.Script.findOne({where:{name: 'AdminComponentDatabaseModels'}})).id,
          type: 'component',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});

      var component = await Sequelize.Component.findOne({where:{name: 'Admin'}});
      await component.addSibling( (await Sequelize.Component.findOne({where:{name: 'AdminSidebarNav'}})) );
      await component.addSibling( (await Sequelize.Component.findOne({where:{name: 'AdminSidebarTools'}})) );
      await component.addSibling( (await Sequelize.Component.findOne({where:{name: 'AdminContent'}})) );
      await component.addSibling( (await Sequelize.Component.findOne({where:{name: 'AdminDatabaseModels'}})) );

      component = await Sequelize.Component.findOne({where:{name: 'AdminSidebarNav'}});
      await component.addSibling( (await Sequelize.Component.findOne({where:{name: 'AdminAccordionSidebarButton'}})) );

      component = await Sequelize.Component.findOne({where:{name: 'AdminDatabaseModels'}});
      await component.addMixin( (await Sequelize.Mixin.findOne({where:{name: 'AdminDatabaseModelsMixin'}})) );

      component = await Sequelize.Component.findOne({where:{name: 'AdminSidebarTools'}});
      await component.addSibling( (await Sequelize.Component.findOne({where:{name: 'AdminAccordionSidebarButton'}})) );
      await component.addMixin( (await Sequelize.Mixin.findOne({where:{name: 'AdminSidebarToolsMixin'}})) );

      component = await Sequelize.Component.findOne({where:{name: 'AdminAccordionSidebarButton'}});
      await component.addMixin( (await Sequelize.Mixin.findOne({where:{name: 'AdminAccordionSidebarButtonMixin'}})) );
    },

    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Components', {}, {});
    }
  };

  return {
    fields: fields,
    attributes: attributes,
    options: options,
    associate: associate,
    name: 'Component',
    table: 'Components',
    seeder: seeder,
  }
})()