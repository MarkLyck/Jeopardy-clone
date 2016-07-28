import Session from './models/Session'
import Game from './models/Game'

let store = {
  session: new Session(),
  game: {
    fetching: false,
    model: new Game()
  },
  settings: {
    appKey: 'kid_BJXvpPIu',
    appSecret: '7b43f80a2472447c8133579a204c282a',
    basicAuth: btoa('kid_BJXvpPIu:7b43f80a2472447c8133579a204c282a')
  }
}

export default store
