'use strict'

//remote modules
const fs = require('fs');

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

    async package_loaded_in_package_json(pack){
        return new Promise(async resolve => {
            fs.readFile('package.json', function read(err, data) {
                if (err) {
                    throw err;
                }
                resolve(JSON.parse(data).dependencies[pack] != null);
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

    package_exists(_pack, timeout = 0, interval = 0, return_pack = true){
        return new Promise(async resolve => {
            var pack = _pack;
            timeout = timeout === 0 ? 10000 : timeout;
            interval = interval === 0 ? 50 : interval;
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
        return await this.package_exists(pack)
    }
}

exports.promise = new Promise(async resolve => {
    resolve(new Utils());
});