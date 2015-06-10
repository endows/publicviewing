Users = Meteor.users
Users.allow({
  update:function(){
    return true
  }
})

<<<<<<< HEAD
Channels = new Meteor.Collection('channels',{
  transform:function(doc){
    doc.visitors = Users.find({visiting_channel_id:doc._id})
=======

Channels = new Meteor.Collection('channels',{
  transform:function(doc){
    doc.visitors = Users.find({visiting_channel_id:doc._id})
    return doc
  }
})

Posts = new Meteor.Collection('posts',{
  transform:function(doc){
    doc.user = Users.findOne(doc.user)
    doc.channel = Channels.findOne(doc.channel)
>>>>>>> post_with_user_id
    return doc
  }
})

Users._transform = function(doc){
  doc.posts = Posts.find({user:doc._id})
  return doc
}


Router.route('/', function () {
  Meteor.users.update({_id: Meteor.userId()},{$set:{visiting_channel_id:''}})

  Template.channel_list.helpers({
    channels:function(){
      return Channels.find()
    }
  })
  this.render('channel_list');
});

Router.route('/:_id', function () {
  Session.set('channel_id',this.params._id)
  Meteor.users.update({_id: Meteor.userId()},{$set:{visiting_channel_id:Session.get('channel_id')}})
  Template.channel.helpers({
    channel:function(){
      return Channels.findOne(Session.get('channel_id'))
    }
  })
  Template.channel.events({
    'click button':function(){
      var val = $('input').val()
      $('input').val("")
      if(!val){
        return true
      }
      Posts.insert({user:Meteor.userId(),body:val,channel:Session.get('channel_id')})
    }
  })
  this.render('channel');
})

if(Meteor.isClient){
  Meteor.subscribe('users')
  Meteor.subscribe('channels')
  Meteor.subscribe('posts')
}

if(Meteor.isServer){
  Meteor.publish('users',function(){
    return Meteor.users.find({},{visiting_channel_id:1})
  })
  Meteor.publish('channels',function(){
    return Channels.find()
  })
  Meteor.publish('posts',function(){
    return Posts.find()
  })
}
