/**
 * 统一包含路由
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const files = fs.readdirSync('./routes');
const middlewares = require('./middlewares');
const routesall = {};

for (let i = 0; i < files.length; i++) {
    Object.assign(routesall, require('./routes/' + files[i]));
}

for (let k in routesall) {
    let root_k = k.split('|');
    if (root_k.length > 2) {
        let [methodtype, methorname, ...middlewarenames] = root_k;

        if (typeof middlewarenames !== 'undefined') {
            const middlewarearr = [];
            for (let i = 0; i < middlewarenames.length; i++) {
                let midmethord = middlewares[middlewarenames[i]];
                if (typeof midmethord === 'function') {
                    middlewarearr.push(midmethord);
                }
            }
            router[methodtype](methorname, ...middlewarearr, routesall[k]);
        }
    }
    if (root_k.length = 2) {
        router[root_k[0]](root_k[1], routesall[k]);
    }
    if (root_k.length < 2) {
        console.log('请好好配置');
    }

}


module.exports = router;