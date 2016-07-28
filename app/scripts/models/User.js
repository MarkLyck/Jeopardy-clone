import Backbone from 'backbone'

const User = Backbone.Model.extend({
  urlRoot: `https://baas.kinvey.com/user/kid_BJXvpPIu/login`,
  idAttribute: '_id',
  defaults: {
    username: '',
    highScore: 0
  },
})

export default User
