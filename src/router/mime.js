const path = require('path');

const mimeTypes = {
    'css': 'text/css',
    'html': 'text/html',
    'js': 'text/javascript',
    'jpeg': 'image/jpeg',
    'txt': 'text/plain'
};

module.exports = (filePath) => {
    let exts = path.extname(filePath)
        .split('.')
        .pop()
        .toLowerCase();
    if (!exts) {
        exts = filePath;
    }
    return mimeTypes[exts] || 'text/plain';
};