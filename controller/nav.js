var Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {
    // path: "./images"
  })]
});

if (Meteor.isServer) {
  Meteor.startup(function() {
    var cwd = process.cwd();
    console.log(cwd);
  })

}


if (Meteor.isClient) {
  Template.nav.events({
    'change .fileInput': function(event, template) {
      var files = event.target.files;
      for (var i = 0, ln = files.length; i < ln; i++) {
        Images.insert(files[i], function(err, fileObj) {
          console.log(fileObj)
            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        });
      }
    }
  })
}
