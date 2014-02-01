var http = require('http');
var Browser = require('zombie');
var assert = require('assert');
var app = require('../../app');
// Set a different port, so both application and tests can run.
var server = http.createServer(app).listen(3030);
var browser = new Browser({ site: 'http://localhost:3030' });
// Set sample files directory used during tests.
var sampleFiles = __dirname + '/files/';

describe('The Not So Fancy Photo Gallery', function() {

  describe('Add a new photo', function() {
    before(function(done) {
      browser.visit('/add', done);
    });

    it('should show a photo upload form', function() {
      assert.ok(browser.success);
      assert.equal(browser.text('h2'), 'Add a new photo');
    });

    it('should refuse empty submissions', function(done) {
      browser.pressButton('Add', function(error) {
        if (error) return done(error);
        assert.ok(browser.success);
        assert.equal(browser.text('h2'), 'Add a new photo');
        assert.equal(browser.text('strong'), "Oops, you need to choose an image file.");
        done();
      });
    });

    it('should refuse file extensions that are not images', function(done) {
        browser.attach('We play nice with .jpg, .jpeg, .png and .gif files.', sampleFiles + 'sample.doc');
        browser.pressButton('Add', function(error) {
          if (error) return done(error);
          assert.ok(browser.success);
          assert.equal(browser.text('h2'), 'Add a new photo');
          assert.equal(browser.text('strong'), "Oops, are you sure it's a image file?");
          done();
        });
    });

    it('should refuse not supported image types', function(done) {
      browser.attach('We play nice with .jpg, .jpeg, .png and .gif files.', sampleFiles + 'sample.tiff');
      browser.pressButton('Add', function(error) {
        if (error) return done(error);
        assert.ok(browser.success);
        assert.equal(browser.text('h2'), 'Add a new photo');
        assert.equal(browser.text('strong'), "Oops, are you sure it's a image file?");
        done();
      });
    });

    it('should redirect to gallery and show success message on upload success', function(done) {
      browser.attach('We play nice with .jpg, .jpeg, .png and .gif files.', sampleFiles + 'sample2.jpg');
      browser.pressButton('Add', function(error) {
        if (error) return done(error);
        assert.ok(browser.success);
        assert.equal(browser.location.pathname, '/');
        assert.equal(browser.text('strong'), 'The photo was successfully added!');
        done();
      });
    });

    it('should show the last added image as the last one on the gallery', function(done) {
      var lastImage = browser.query('.gallery .gallery-photo:last-child img');
      assert.equal(lastImage.src, 'http://localhost:3030/photos/sample2.jpg');
      done();
    });
  });

  describe('Edit a existing photo', function() {
    before(function(done) {
      browser.visit('/edit/sample2.jpg', done);
    });

    it('should show a photo edit form', function() {
      assert.ok(browser.success);
      assert.equal(browser.text('h2'), 'Edit photo');
    });

    it('should refuse empty name submissions', function(done) {
      browser.fill('New name:', '');
      browser.pressButton('Save', function(error) {
        if (error) return done(error);
        assert.ok(browser.success);
        assert.equal(browser.text('h2'), 'Edit photo');
        assert.equal(browser.text('strong'),
          'Oops, you need to provide a name. Maybe amazing_rio?');
        done();
      });
    });

    it('should redirect to gallery and show success message on edit success', function(done) {
      browser.fill('New name:', 'somename');
      browser.pressButton('Save', function(error) {
        if (error) return done(error);
        assert.ok(browser.success);
        assert.equal(browser.location.pathname, '/');
        assert.equal(browser.text('strong'), "The photo was successfully edited!");
        done();
      });
    });

    it('should redirect to the list and show a error message when trying to edit a non existing image', function(done){
      browser.visit('/edit/someinvalidimage.jpg', function(error) {
        if (error) return done(error);
        assert.ok(browser.success);
        assert.equal(browser.location.pathname, '/list');
        assert.equal(browser.text('strong'),
          "Looks like I can't edit this photo, why don't you try to edit another one?");
        done();
      });
    });
  });

  describe('View all photos', function() {
    before(function(done) {
      browser.visit('/list', done);
    });

    it('should show a list of photos', function() {
      assert.ok(browser.success);
      assert.ok(browser.query('.list-group'));
    });

    it('should show a edit link on a photo item', function(done) {
      var photoItemEditAction = browser.query('.list-group .list-group-item:last-child span .photo-item-action-edit');
      assert.equal(photoItemEditAction.href, 'http://localhost:3030/edit/somename.jpg');
      done();
    });

    it('should show a remove link on a photo item', function(done) {
      var photoItemRemoveAction = browser.query('.list-group .list-group-item:last-child span .photo-item-action-remove');
      assert.equal(photoItemRemoveAction.href, 'http://localhost:3030/remove/somename.jpg');
      done();
    });
  });

  describe('Remove a photo', function() {
    before(function(done) {
      browser.visit('/remove/somename.jpg', done);
    });

    it('should redirect back to the list', function() {
      assert.ok(browser.success);
      assert.equal(browser.location.pathname, '/list');
    });

    it('should show a success message', function(done) {
      assert.ok(browser.success);
      assert.equal(browser.text('strong'), 'The photo was successfully removed!');
      done();
    });
  });
});
