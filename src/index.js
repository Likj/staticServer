const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig');
const router = require('./router/router');


const server = http.createServer((req, res) => {
    const filePath = path.resolve(process.cwd() + conf.root);
    const absoluteReqUrl = path.join(filePath + req.url);
    router(req, res, absoluteReqUrl);

});

server.listen(conf.port, conf.hostname, (err) => {
    if(err) throw new Error(err);
    console.info(`服务已经运行在${chalk.red(conf.hostname + ':' + conf.port)}`)
});