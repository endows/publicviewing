Users = new Meteor.Collection('users')
Channels = new Meteor.Collection('channels',{
  transform:function(doc){
    doc.visitors = Users.find({visiting_channel_id:doc._id}).fetch()
    return doc
  }
})

Router.route('/', function () {
  Template.channel_list.helpers({
    channels:function(){
      return Channels.find()
    }
  })
  this.render('channel_list');
});

Router.route('/:_id', function () {
  Session.set('channel_id',this.params._id)
  Template.channel.helpers({
    channel:function(){
      return Channels.findOne(Session.get('channel_id'))
    }
  })
  this.render('channel');
});
