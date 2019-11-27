'use strict'

//appster modules
let utils;
let shell;

//remote modules

//private vars

//we only want our index.js (the parent module or javascript file in this case) to access the load_database() and load_server() methods so we define the rest in the outside of the class

let install_vue = async ()=>{
    if (!await utils.file_exists('./app')){
        try{
            await shell.run_command("vue create app -d -f \n");
            console.log("APPSTER____________________________________________________________________________________________________Initiated VUE.js app.")
        }catch(e){
            console.log("APPSTER____________________________________________________________________________________________________Error while trying to create the VUE.js app.")
            console.log(e.message);
        }
    }else{
        console.log("APPSTER____________________________________________________________________________________________________VUE.js app already exists.")
    }
}

let load_vue = async ()=>{
    //this package helps us build our actual website faster offering us a structured way of using blocks of code over and over again so that we don't have to copy paste all the time.
    await load_package("vue", true)

    //after loading the package we must create an app with our newly available vue framework so we will call this installing vue
    await install_vue();
}

let load_mariadb = async ()=>{
    //this package ensures we have a database we can store things in
    await load_package("mariadb")

    //our ORM - in case you want to use some other database an ORM helps you make sure you don't have to change your code by adding a generalist way of addressing the database on top of any of the supported database languages be it mariadb, sqlite, or others
    await load_sequelize();
}

let load_express = async ()=>{
    //our http server - this is where start accepting requests from clients. clients are the users trying to access your server or we can call it website directly because this is in a way what we are building.
    await load_package("express")
}

let load_sequelize = async ()=>{
    //this package gives us the ORM that helps communicate with multiple database languages in the same time. in other words we can use the same code to run the same commands but on different databases even though the databases themselves have different languages
    await load_package("sequelize")
}

var load_package = async (pack, cannot_require = false)=>{
    if (!await utils.file_exists('./package.json')){
        await shell.run_command("npm init -y \n exit \n");
    }

    if (!(await utils.package_loaded_in_package_json(pack)) || (!cannot_require && !utils.can_resolve(pack))){
        await shell.run_command("npm install " + pack + " --save \n" + "exit \n");
        //wait for the module to actually be available
        if (await utils.package_exists(pack, 10000, 50, false)){
            console.log("APPSTER____________________________________________________________________________________________________" + pack + " module installed.");
        }else{
            throw new Error("Cannot load package");
        }
    }else{
        console.log("APPSTER____________________________________________________________________________________________________" + pack + " module already installed.");
    }

};

class Dependencies{
    constructor(){
        return this;
    }

    async load_database(){
        //we use mariadb because mariadb is very commonly used as well as the fact that it's supported by our ORM (will be loaded and explained in the next method)
        await load_mariadb();
    }

    async load_server(){
        //our frontend framework - this is what we use to display our information in the browser
        await load_vue();
        //our http server framework - helps us with prebuild functions we can use to speed up the process of defining our server logic. much like vue actually just for a different purpose
        await load_express();
    }
}

exports.promise = new Promise(async resolve => {
    utils = await require('./utils.js').promise;
    shell = await require('./shell.js').promise;

    resolve(new Dependencies());
});