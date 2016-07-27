import Session from './models/Session'

let store = {
  session: new Session(),
  settings: {
    appKey: 'kid_BJXvpPIu',
    appSecret: '7b43f80a2472447c8133579a204c282a',
    basicAuth: btoa('kid_BJXvpPIu:7b43f80a2472447c8133579a204c282a')
  }
}

export default store
