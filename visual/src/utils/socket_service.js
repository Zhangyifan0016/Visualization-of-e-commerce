export default class SocketService {
  // 单例模式
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  ws = null

  // 标识是否连接成功
  connected = false

  // 记录重试次数
  sendRetryCount = 0

  connectRetryCount = 0

  callBackMapping = {}
  connect() {
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebSocket')
    }
    this.ws = new WebSocket('ws://localhost:9998')

    // 连接成功
    this.ws.onopen = () => {
      console.log('连接服务器成功')
      this.connected = true
      // 成功重连
      this.connectRetryCount = 0
    }
    // 连接失败
    this.ws.onclose = (error) => {
      console.log(error)
      console.log('连接服务器失败')
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, this.connectRetryCount * 500)
    }
    this.ws.onmessage = (msg) => {
      console.log('从服务端获取到数据')
      console.log(msg.data)
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
        } else if (action === 'themeChange') {
          this.callBackMapping[socketType].call(this, recvData)
        }
      }
    }
  }

  // 注册回调函数
  registerCallback(socketType, callback) {
    this.callBackMapping[socketType] = callback
  }

  // 取消回调函数
  unregisterCallback(socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送数据
  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      setTimeout(() => {
        this.sendRetryCount++
        this.send(data)
      }, this.sendRetryCount * 500)
    }
  }
}
