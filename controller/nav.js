var Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images")]
});

if (Meteor.isServer) {
  Meteor.startup(function() {
    var cwd = process.cwd();
    console.log(cwd);
  })

}


if (Meteor.isClient) {
  Template.nav.events({
    'click button': function() {
      var val = $('input').val()
      $('input').val("")
      if (!val) {
        return true
      }
      Channels.insert({
        name: val,
        image: Session.get('channel_image_url')
      }, function(err, _id) {
        Router.go('/' + _id)
      })
    },
    'change .fileInput': function(event, template) {
      var files = event.target.files;
      for (var i = 0, ln = files.length; i < ln; i++) {
        Images.insert(files[i], function(err, fileObj) {
          console.log(fileObj)
          Session.set('channel_image_url','/cfs/files/images/' + fileObj._id)
            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        });
      }
    }
  })
}
