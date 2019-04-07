const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const Handlebars = require('handlebars');
const getMime = require('./mime');
const compress = require('./compress');

const tpl = fs.readFileSync(path.join(__dirname, '../template/dirTemplate.ejs'));
const template = Handlebars.compile(tpl.toString());


module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            res.statusCode = 200;
            const mime = getMime(filePath);
            res.setHeader('Content-Type', mime);
            fs.createReadStream(filePath).pipe(res);
            let rs = fs.createReadStream(filePath);
            rs = compress(rs, req, res);
            rs.pipe(res);
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const dir = path.relative(process.cwd(), filePath);
            const data = {
                title: path.basename(filePath),
                root: dir ? `/${dir}` : '',
                fileList: files,
            };
            res.end(template(data));
        }
    } catch (e) {
        console.error(e);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.write('<html>');
        res.write('<body>');
        res.write('<button>404 不存在的目录</button>');
        res.write(`<p>${filePath}</p>`);
        res.write('</body>');
        res.write('</html>');
        res.end();
    }
};