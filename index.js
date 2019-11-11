//For an extra security layer, the whole program runs within an async anonymous function
(async () => {
    //Everything that runs on this platform is stored inside a mongo db by default.
    //This is done so that users can modify the code from a remote terminal.
    const mongo = require('./modules/mongoose/Mongoose');
    const fs = require('fs');
    let logger = null;

    var mainModule = async (AppsterData) => {
        //Our database is ready, we can start loading and running our main module.
        try {
            console.log(['Finished Initiating Appster Model.', "Starting to instantiate the \"" + AppsterData.name + "\" module..."]);
            await (async ()=>{
                await eval(AppsterData.eval);
            })();
        } catch (error) {
            throw new Error(["Error on module: \"" + AppsterData.name + '" ', error]);
        }
    };

    //We start the mongo module with a promise just in case we need to extend this in the future.
    //This way we're sure we won't be bothered by the asynchronicity of the require function.
    await mongo.start.then(async AppsterData => {
        await mainModule(AppsterData);
    }).catch(e => {
        var msg = ['Error while executing program loop: ', e];
        if (logger)
        logger.types.init.log(msg);
        else console.log(msg)
    }).finally(() => {
        var msg = ['Finished Initiating Program'];
        //Make sure to check that this log is last to ensure your code is structured correctly
        if (logger)
        logger.types.init.log(msg);
        else console.log(msg)
    });
})()