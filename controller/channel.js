Router.route('/:_id', function() {
  setInterval(function(){

  $(".list-group-item-info").each(function(i,row){
    var current_count = $(row).data('count')
    $(row).data('count',current_count + 1)
    if(current_count == 10){
      $(row).removeClass('list-group-item-info')
    }
  })
},100)
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
      return Meteor.absoluteUrl(Session.get('channel_id'))
    }
  })
  Template.channel.events({
    'click #loginButton':function(){
      Meteor.loginWithTwitter()
    },
    'submit form': function(event) {

      var val = $('input#newPostBody').val()
      $('input#newPostBody').val("")
      if (!val) {
        return true
      }

      Posts.insert({
        user: Meteor.userId(),
        body: val,
        channel: Session.get('channel_id'),
        createAt:Date.now()
      })
    }
  })
  this.render('channel');
})
