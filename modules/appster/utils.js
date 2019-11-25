'use strict'

//remote modules
const fs = require('fs');

class Utils{
    constructor(){
        return this;
    }

    async folder_exists(path){
        return new Promise(async resolve => {
            fs.access(path, fs.F_OK, (err) => {
                if (err) {
                    resolve(false);
                }

                resolve(true);
            })
        })
    }

    module_exists(path){
        try {
            require.resolve(path);
            return true;
        } catch(e) {
            return false;
        }
    }

    package_exists(name){
        return Object.keys(require('../../package.json').dependencies).indexOf(name) != -1;
    }
}

exports.promise = new Promise(async resolve => {
    resolve(new Utils());
});