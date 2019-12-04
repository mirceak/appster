'use strict'

//appster modules

//remote modules
const fs = require('fs');

//private vars

class Utils{
    constructor(){
        return this;
    }

    async file_exists(path){
        return new Promise(async resolve => {
            fs.access(path, (err) => {
                if (err != null) {
                    console.log(err.message);
                    resolve(false);
                }

                resolve(true);
            })
        })
    }

    async get_file_content(path){
        return new Promise(async resolve => {
            fs.readFile(path, function read(err, data) {
                if (err) {
                    throw err;
                }
                resolve(data);
            });
        })
    }

    async write_to_file(path, content){
        return new Promise(async resolve => {
            fs.writeFile(path, content,  ()=> {
                resolve();
            });
        })
    }

    async package_loaded_in_package_json(path, pack){
        return new Promise(async resolve => {
            fs.readFile(path, function read(err, data) {
                if (err) {
                    throw err;
                }
                let json = JSON.parse(data);
                resolve(json.dependencies && json.dependencies[pack] != null);
            });
        })
    }

    can_resolve(pack){
        try {
            require.resolve(pack);
            return true;
        } catch(e) {
            return false;
        }
    }

    package_exists(_pack, sync = false, return_pack = true){
        return new Promise(async resolve => {
            var pack = _pack;
            var timeout = sync ? 0 : 10000;
            var interval = sync ? 0 : 50;
            if (!this.can_resolve(pack)) {
                let interv = setInterval(async () => {
                    if (this.can_resolve(pack)) {
                        clearInterval(interv);

                        //module got loaded
                        if (return_pack){
                            var pack = require(pack);
                            if (pack.promise && typeof (pack.promise) == typeof (Promise)){
                                resolve(await pack.promise);
                            }else{
                                resolve(pack);
                            }
                        }else{
                            resolve(true);
                        }
                    }
                    timeout -= interval;
                    if (timeout <= 0){
                        clearInterval(interv);
                        //timed out. module not loaded
                        resolve (false);
                    }
                }, interval );
            }else{
                if (return_pack){
                    var pack = require(pack);
                    if (pack.promise && typeof (pack.promise) == typeof (Promise)){
                        resolve(await pack.promise);
                    }else{
                        resolve(pack);
                    }
                }else{
                    resolve(true);
                }
            }
        })
    }

    async require(pack){
        return await this.package_exists(pack, true)
    }
}

exports.promise = new Promise(async resolve => {
    resolve(new Utils());
});