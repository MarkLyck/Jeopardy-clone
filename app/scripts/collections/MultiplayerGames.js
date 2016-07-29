import Backbone from 'backbone'

import MultiplayerGame from '../models/MultiplayerGame'

const MultiplayerGames = Backbone.Collection.extend({
  url: `https://baas.kinvey.com/appdata/kid_BJXvpPIu/gameboards`,
  model: MultiplayerGame
})

export default MultiplayerGames
