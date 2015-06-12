Router.route('/:_id', function() {
  Session.set('channel_id', this.params._id)
  Meteor.users.update({
    _id: Meteor.userId()
  }, {
    $set: {
      visiting_channel_id: Session.get('channel_id')
    }
  })
  Template.channel.helpers({
    channel: function() {
      return Channels.findOne(Session.get('channel_id'))
    },
    users:function(){
      return Users.find({visiting_channel_id:Session.get('channel_id'),_id:{$not:Meteor.userId()}})
    },
    current_url:function(){
      return Router.current().url
    }
  })
  Template.channel.events({
    'click button': function() {
      var val = $('input').val()
      $('input').val("")
      if (!val) {
        return true
      }
      Posts.insert({
        user: Meteor.userId(),
        body: val,
        channel: Session.get('channel_id')
      })
    }
  })
  this.render('channel');
})
