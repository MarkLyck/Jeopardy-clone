import Backbone from 'backbone'

import Clue from '../models/Clue'

const Clues = Backbone.Collection.extend({
  url: `https://baas.kinvey.com/appdata/kid_BJXvpPIu/clues`,
  model: Clue
})

export default Clues
