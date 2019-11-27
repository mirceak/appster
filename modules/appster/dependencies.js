'use strict'

//appster modules
let utils;
let shell;

//remote modules

//private vars
let dependencies = {
    "express": "^4.17.1",
    "mariadb": "^2.1.3",
    "sequelize": "^5.21.2",
    "vue": "^2.6.10"
}

let load_packages = async ()=>{
    if (!await utils.file_exists('./package.json')){
        await shell.run_command("npm init -y \n exit \n");
    }

    for (let dependency in dependencies) {
        if (!await utils.package_loaded_in_package_json(dependency)){
            var package_json = JSON.parse(await utils.get_file_content('package.json'));
            package_json.dependencies = dependencies;
            package_json = JSON.stringify(package_json);
            await utils.write_to_file('package.json', package_json)

            await shell.run_command("npm install \n exit \n");
            break;
        }
    }


}



class Dependencies{
    constructor(){
        return this;
    }

    async load(){
        await load_packages();
        console.log("APPSTER____________________________________________________________________________________________________Dependencies loaded!");
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    shell = await require('./shell.js').promise;

    resolve(new Dependencies());
});