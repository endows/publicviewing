Users = Meteor.users
Users.allow({
  update: function() {
    return true
  }
})




Channels = new Meteor.Collection('channels', {
  transform: function(doc) {
    doc.visitors = Users.find({
      visiting_channel_id: doc._id
    })
    return doc
  }
})

Posts = new Meteor.Collection('posts', {
  transform: function(doc) {
    doc.user = Users.findOne(doc.user)
    doc.channel = Channels.findOne(doc.channel)
    return doc
  }
})

Users._transform = function(doc) {
  doc.posts = Posts.find({
    user: doc._id
  }, {
    sort: {
      createAt: -1
    },
    limit:3
  })
  return doc
}

if (Meteor.isClient) {
  Tracker.autorun(function() {
    Meteor.subscribe('users')
    Meteor.subscribe('channels')
    Meteor.subscribe('posts', Session.get('channel_id'))
  })
}

if (Meteor.isServer) {
  Accounts.onCreateUser(function(options, user) {
    user.image = user.services.twitter.profile_image_url
    user.name = options.profile.name
    user._id = user.services.twitter.id
    return user;
  });

  Meteor.publish('users', function() {
    return Meteor.users.find({}, {
      visiting_channel_id: 1
    })
  })
  Meteor.publish('channels', function() {
    return Channels.find()
  })
  Meteor.publish('posts', function(channel_id) {
    return Posts.find({
      channel: channel_id
    })
  })
}
