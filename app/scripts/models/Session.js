import Backbone from 'backbone'
import {hashHistory} from 'react-router'

import store from '../store'

const Session = Backbone.Model.extend({
  urlRoot: `https://baas.kinvey.com/user/kid_BJXvpPIu/login`,
  idAttribute: '_id',
  defaults: {
    username: '',
    money: 0,
    topScore: 0
  },
  parse: function(response) {
    if (response) {
      return {
        authtoken: response._kmd.authtoken,
        username: response.username,
        cards: response.cards,
        userId: response._id
      }
    }
  },
  login: function(username, password) {
    this.save({username: username, password: password},
    {
      success: (model, response) => {
        localStorage.authtoken = response._kmd.authtoken
        this.unset('password')
        hashHistory.push('/play')
      },
      error: function(model, response) {
        console.log('ERROR: Login failed');
      }
    })
  },
  signup: function(username, password) {
    store.session.save({
      username: username,
      password: password
    },
    {
      url: `https://baas.kinvey.com/user/${store.settings.appKey}/`,
      success: function(model, response) {
        model.unset('password')
        localStorage.authtoken = response._kmd.authtoken
        hashHistory.push('/')
      },
      error: function(model, response) {
        console.log('ERROR: ', arguments);
      }
    })
  },
  retrieve: function() {
    this.fetch({
      url: `https://baas.kinvey.com/user/${store.settings.appKey}/_me`,
      error: function(response) {
        throw new Error('FETCHING USER FAILED!')
      }
    })
  },
  updateUser: function() {
    this.save(null, {
      type: 'PUT',
      url: `https://baas.kinvey.com/user/${store.settings.appKey}/${this.get('userId')}`,
    })
  }
})

export default Session
