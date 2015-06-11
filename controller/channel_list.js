Router.route('/', function() {
  Meteor.users.update({
    _id: Meteor.userId()
  }, {
    $set: {
      visiting_channel_id: ''
    }
  })

  Template.channel_list.helpers({
    channels: function() {
      return Channels.find().fetch().sort(function(a, b) {
        return a.visitors.count() < b.visitors.count()
      })
    }
  })

  Template.channel_list.events({
    'click button': function() {
      var val = $('input').val()
      $('input').val("")
      if (!val) {
        return true
      }
      Channels.insert({
        name: val
      }, function(err, _id) {
        Router.go('/' + _id)
      })
    }
  })

  this.render('channel_list');
});
