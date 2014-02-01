var path = require('path');
var fs = require('fs');
var join = path.join;

exports.read = function(dir) {
  return function(req, res, next) {
    // Read the photos directory.
    fs.readdir(dir, function(err, images) {
      if (err) return next(err);
      // Sort images, first modified to last.
      images.sort(function(a, b) {
        return fs.statSync(dir + '/' + a).mtime.getTime() - fs.statSync(dir + '/' + b).mtime.getTime();
      });
      // Make a list of em.
      var photoList = [];
      for (var i = 0; i < images.length; i++) {
        photoList.push({
          name: images[i],
          path: images[i]
        });
      }
      // Check the request path to define which view we should render, gallery or photo list.
      var view = req.path == '/' ? 'photos/gallery' : 'photos/list';

      res.render(view, {
        photos: photoList,
        message: req.flash()
      });
    });
  };
};

exports.add = function(req, res) {
  res.render('photos/add', {
    message: req.flash()
  });
};

exports.create = function (dir) {
  return function(req, res, next){
    // Check if we have a image file in the post request.
    if (!req.files.photo) {
      req.flash('error', "Oops, you need to choose an image file.");
      res.redirect('/add');
    } else {
      // We do, so let's make it happen.
      var image = req.files.photo.image;
      var imageName = image.name;
      // Test the file extension, just the main ones.
      if (imageName.match(/\.(jpg|jpeg|png|gif)$/)) {
        // Sanitize.
        imageName = imageName.replace(/[^a-z0-9_\-\.]/gi, '_');
        var path = join(dir, imageName);
        
        fs.rename(image.path, path, function(err){
          if (err) return next(err);
          req.flash('success', 'The photo was successfully added!');
          res.redirect('/');
        });
      } else {
        req.flash('error', "Oops, are you sure it's a image file?");
        res.redirect('/add');
      }
    }
  };
};

exports.edit = function(dir) {
  return function(req, res, next){
    var imageName = req.params.name;
    // Check if this image file actually exists.
    fs.readdir(dir, function(err, photos) {
      if (err) return next(err);

      if (photos.indexOf(imageName) > -1) {
        // Separate the name from it's extension.
        var imageExtension = imageName.substr(imageName.lastIndexOf('.') + 1);
        imageName = imageName.substr(0, imageName.lastIndexOf('.'));

        res.render('photos/edit', {
          name: imageName,
          extension: imageExtension,
          message: req.flash()
        });
      } else {
        req.flash('error', "Looks like I can't edit this photo, why don't you try to edit another one?");
        res.redirect('/list');
      }
    });
  };
};

exports.update = function(dir) {
  return function(req, res, next){
    var originalName = req.body.photo.original;
    var originalNameExtension = originalName.substr(-4);

    var newName = req.body.photo.rename;
    // Check if we have a new name.
    if (newName) {
      var originalNamePath = join(dir, originalName);
      var newNamePath = join(dir, newName + originalNameExtension);
      // So we rename it.
      fs.rename(originalNamePath, newNamePath, function(err){
        if (err) return next(err);
        req.flash('success', 'The photo was successfully edited!');
        res.redirect('/');
      });
    } else {
      // Or just show a insightful hint.
      req.flash('error', 'Oops, you need to provide a name. Maybe amazing_rio?');
      res.redirect('/edit/' + originalName);
    }
  };
};

exports.del = function(dir){
  return function(req, res, next){
    var imageName = req.params.name;
    fs.unlink(dir + '/' + imageName, function(err) {
      if (err) return next(err);
      req.flash('success', 'The photo was successfully removed!');
      res.redirect('/list');
    });
  };
};

exports.notfound = function(req, res) {
  res.status(404).format({
    html: function() {
      res.render('404');
    }
  });
};
