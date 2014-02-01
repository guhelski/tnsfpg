var http = require('http');
var Browser = require('zombie');
var assert = require('assert');
var fs = require('fs');
var app = require('../../app');
// Set a different port, so both application and tests can run.
var server = http.createServer(app).listen(3030);
var browser = new Browser({ site: 'http://localhost:3030' });
// Set sample files directory used during tests.
var sampleFiles = __dirname + '/files/';
var photoFiles = app.get('photos');

describe('TNSFPG Gallery', function() {
  before(function(done) {
    cleanPhotos(photoFiles);
    populatePhotos(photoFiles);
    browser.visit('/', done);
  });

  it('should show a image gallery', function() {
    assert.ok(browser.success);
    assert.ok(browser.query('.gallery'));
  });

  it('should show the next image when the next button is clicked', function(done) {
    browser.fire('#next', 'click', function(error) {
      if (error) return done(error);
      var currentPhoto = browser.query('.current img');
      assert.equal(currentPhoto.src, 'http://localhost:3030/photos/sample3.jpg');
      done();
    });
  });

  it('should show the previous image when the previous button is clicked', function(done) {
    browser.fire('#prev', 'click', function(error) {
      if (error) return done(error);
      var currentPhoto = browser.query('.current img');
      assert.equal(currentPhoto.src, 'http://localhost:3030/photos/sample2.jpg');
      done();
    });
  });

  it('should do nothing when the next button is clicked and the current image is the last', function(done) {
    // We are on sample2.jpg.
    browser.fire('#next', 'click', function(error) {
      // Now on sample3.jpg.
      browser.fire('#next', 'click', function(error) {
        // We should go nowhere.
        if (error) return done(error);
        var currentPhoto = browser.query('.current img');
        assert.equal(currentPhoto.src, 'http://localhost:3030/photos/sample3.jpg');
        done();
      });
    });
  });

  it('should do nothing when the previous button is clicked and the current image is the first', function(done) {
    // We are on sample3.jpg.
    browser.fire('#prev', 'click', function(error) {
      // Now on sample2.jpg.
      browser.fire('#prev', 'click', function(error) {
        // We should go nowhere.
        if (error) return done(error);
        var currentPhoto = browser.query('.current img');
        assert.equal(currentPhoto.src, 'http://localhost:3030/photos/sample2.jpg');
        done();
      });
    });
  });

  after(function(done) {
    cleanPhotos(photoFiles);
    // Bring the Doctor back.
    fs.createReadStream(sampleFiles + 'sample1.jpg').pipe(fs.createWriteStream(photoFiles + '/' + 'sample1.jpg'));
    done();
  });
});

var cleanPhotos = function(dir) {
  fs.readdir(dir, function(err, files) {
    if (err) return done(err);

    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        var filePath = dir + '/' + files[i];
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      }
    }
  });
};

var populatePhotos = function(dir) {
   // Not much error handling here.
  fs.createReadStream(sampleFiles + 'sample2.jpg').pipe(fs.createWriteStream(dir + '/' + 'sample2.jpg'));
  fs.createReadStream(sampleFiles + 'sample3.jpg').pipe(fs.createWriteStream(dir + '/' + 'sample3.jpg'));
  fs.createReadStream(sampleFiles + 'sample4.jpg').pipe(fs.createWriteStream(dir + '/' + 'sample4.jpg'));
};
