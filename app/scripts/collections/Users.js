import Backbone from 'backbone'

import User from '../models/User'

const Users = Backbone.Collection.extend({
  url: `https://baas.kinvey.com/user/kid_BJXvpPIu/`,
  model: User
})

export default Users
