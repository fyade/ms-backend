import { genId } from './util/IdUtils';

interface msg {
  id?: string
  from_?: string
  to_?: string
  from?: string
  to?: string
  content: string
  count?: number
  time?: Date
  timestamp?: number
  type?: string
}

const ws = require("nodejs-websocket")
let count: number = 0
const types = {
  TYPE_ENTER: '0',
  TYPE_LEAVE: '1',
  TYPE_MSG: '2'
}
const server = ws.createServer(connect => {
  count++
  connect.username = `user_${genId()}`
  boardcost({
    type: types.TYPE_ENTER,
    content: `${connect.username}已上线`,
    from: 'sys',
    to: 'all'
  })

  connect.on('text', data => {
    const dataObj = JSON.parse(data)
    if (dataObj.to_ === 'all') {
      boardcost({
        ...dataObj,
        type: types.TYPE_MSG,
        from: connect.username,
        to: 'all'
      })
    }
  })

  connect.on('close', () => {
    count--
    boardcost({
      type: types.TYPE_LEAVE,
      content: `${connect.username}已下线`,
      from: 'sys',
      to: 'all'
    })
    console.info('连接关闭。')
  })

  connect.on('error', () => {
    console.info('连接异常。')
  })
})

function boardcost(msg) {
  server.connections.forEach(connect => {
    const time = new Date()
    connect.send(JSON.stringify({
      count: count,
      id: genId(),
      time: time,
      timestamp: time.getTime(),
      ...msg,
    }))
  })
}

server.listen(8061, () => {
  console.info('websocket running 8061')
})
