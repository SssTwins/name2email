import conn, { tableData } from '../db/conn.js'

console.log('background is running')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', message?.count)
  }
  if (message.type === 'GET_DATA') {
    query(message.key).then((res) => {
      console.log(res)
      sendResponse(res)
    })
    return true
  }
})

async function query(name) {
  return await conn.then((conn) => {
    return conn.select({
      from: tableData,
      where: {
        name: {
          like: name + '%',
          limit: 10,
        },
      },
    })
  })
}
