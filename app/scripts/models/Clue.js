import $ from 'jquery';
import Backbone from 'backbone';

import store from '../store'

const Clue = Backbone.Model.extend({
  urlRoot: `https://baas.kinvey.com/appdata/kid_BJXvpPIu/clues/`,
  defaults: {
    question: '',
    answer: '',
    value: 0,
    answered: false
  },
})

export default Clue
