import workerInjector from 'jsstore/dist/worker_injector'
import { Connection } from 'jsstore'

const connection = new Connection()
export const dbName2email = 'name2email'
export const tableData = 'data'

function getDBInitData() {
  let tblData = {
    name: tableData,
    columns: {
      id: { primaryKey: true, autoIncrement: true },
      name: { notNull: true, dataType: 'string' },
      email: { notNull: true, unique: true, dataType: 'string' },
    },
  }
  return {
    name: dbName2email,
    tables: [tblData],
  }
}

connection.addPlugin(workerInjector)

const conn = connection.initDb(getDBInitData()).then((isDbCreated) => {
  if (isDbCreated === true) {
    console.log('db created')
    // here you can prefill database with some data
  } else {
    console.log('db opened')
  }

  return connection
})

export default conn
