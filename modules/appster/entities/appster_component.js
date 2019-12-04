'use strict'

//appster modules

//remote modules

//private vars
let props;
let modelName = 'appster_component';

let init = async (Sequelize, sequelize) => {
    class Appster_component extends Sequelize.Model {
    };

    props = {
        slug: {
            type: Sequelize.STRING,
            primaryKey: true,
            unique: true
        },
        template: {
            type: Sequelize.TEXT
        },
        mixin: {
            type: Sequelize.TEXT
        }
    };

    await Appster_component.init(props, {sequelize, modelName: modelName});

    await sequelize.define(modelName, props).sync({force: true});

    await Appster_component.create(
        {
            slug: 'Welcome',
            template: `
<b-container>
  <b-card
    title="Appster"
    img-src="https://picsum.photos/600/300/?image=25"
    img-alt="Image"
    img-top
    tag="article"
  >
    <b-card-text>
      An abstract framework based on node.js, Vue.js, Bootstrap and mariadb.
    </b-card-text>
    
    <AppstrComponent  :id='"Login"' :custom_data.sync="auth_props"/>
    <AppstrComponent :id='"Register"' :custom_data.sync="auth_props"/>
  </b-card>
</b-container>
                `,
            mixin: `{
                data(){
                    return {
                        auth_props:{
                            display_register_menu: false
                        }              
                    }
                },
                mounted() {
                    
                }
            }`,
            updatedAt: new Date(),
            createdAt: new Date()
        }
    );

    await Appster_component.create(
        {
            slug: 'Login',
            template: `
<b-container>
  <b-card
    v-if="!data.display_register_menu"
    title="Login"
  >
    <b-card-text>
      Please login before we start...
    </b-card-text>

    <b-button href="#" variant="success">Login</b-button>
    <b-button @click="hide" variant="info">Register</b-button>
    
  </b-card>
</b-container>
                `,
            mixin: `{
                props:{
                    data: Object,
                    model: Object
                },
                mounted() {
                },
                methods: {
                    hide(){
                        this.data.display_register_menu = true;
                    }
                }
            }`,
            updatedAt: new Date(),
            createdAt: new Date()
        }
    );

    await Appster_component.create(
        {
            slug: 'Register',
            template: `
<b-container>
  <b-card
    v-if="data.display_register_menu"
    title="Register"
  >
    <b-card-text>
      Please register before we start...
    </b-card-text>

    <b-button href="#" variant="success">Register</b-button>
    <b-button @click="hide" variant="info">Login</b-button>
    
  </b-card>
</b-container>
                `,
            mixin: `{
                props:{
                    data: Object,
                    model: Object
                },
                mounted() {
                },
                methods: {
                    hide(){
                        this.data.display_register_menu = false;
                    }
                }
            }`,
            updatedAt: new Date(),
            createdAt: new Date()
        }
    );

    return {props: {...props, modelName}, model: Appster_component};
}

exports.init = init;