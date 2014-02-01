var express = require('express');
var photos = require('./routes/photos');
var http = require('http');
var path = require('path');
var hbs = require('hbs');
var flash = require('connect-flash');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// Treat Handlebars files as html files.
app.set('view engine', 'html');
// Tell Express that we are going to use Handlebars.
app.engine('html', hbs.__express);
// Setup connect-flash.
app.use(express.cookieParser('superparser'));
app.use(express.session({ key: 'tnsfpg', cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// Set photos directory.
app.set('photos', path.join(__dirname, 'public/photos'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', photos.read(app.get('photos')));

app.get('/add', photos.add);
app.post('/add', photos.create(app.get('photos')));

app.get('/list', photos.read(app.get('photos')));

app.get('/edit/:name', photos.edit(app.get('photos')));
app.post('/edit/:name', photos.update(app.get('photos')));

app.get('/remove/:name', photos.del(app.get('photos')));

// Set default 404 error page.
app.use(photos.notfound);
// Export app as a module so our functional tests can run.
module.exports = app;
// And should start or listen only when called directly.
if (!module.parent) {
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
}