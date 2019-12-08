'use strict'

//appster modules
let utils;

//remote modules
let Sequelize;

//private vars

let entity_register = [
    {entity: require('./appster_js_module.js')}
];

exports.get = async (sequelize) => {
    utils = await require('../utils.js').promise;
    Sequelize = await utils.require('sequelize');

    return entity_register.reduce(async (result, current) => {
        result.push(await current.entity.init(Sequelize, sequelize));
        return result;
    }, []);
}