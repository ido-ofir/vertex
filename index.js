var express = require('express');
var path = require('path');
var app = express();

app.use('/', express.static(path.join(process.cwd(), 'front')));

app.listen(3000, function(){
    console.log('listening on port 3000');
});