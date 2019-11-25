'use strict'

//appster modules

//remote modules
const Sequelize = require('sequelize');

//private vars

class Api{
    constructor(){
        return this;
    }

    async start(){

    }
}

exports.promise = new Promise(async resolve => {
    resolve(new Api());
});