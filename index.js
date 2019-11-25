//You can learn everything you need about this project by following the code from this file onward.
//These files will only ensure we have enough to run a http server and then will import a database that was pre-populated by myself.
//The database will contain the base of this project and will be thoroughly explained in the website it contains.

//remote modules

//private vars

(async ()=>{
    'use strict'

    const main = await require('./modules/appster/main.js').promise;

    console.log("APPSTER____________________________________________________________________________________________________EXECUTION STARTED. THANK YOU!");

    //make sure dependencies are loaded (I have made a selection of dependencies that do not require any other third party software installs. Running npm on this file will take care of absolutely everything you need)
    await main.load_dependencies();

    //start services
    await main.start_database();
    await main.start_server();

    console.log("APPSTER____________________________________________________________________________________________________EXECUTION ENDED. The server is ready!");
})();
