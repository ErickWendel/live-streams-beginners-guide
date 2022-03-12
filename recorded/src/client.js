import axios from 'axios'
import { Transform, Writable } from 'stream'
import { pipeline } from 'stream/promises'
const url = 'http://localhost:3000'

async function consume() {
  const response = await axios({ 
    url,
    method: 'get',
    responseType: 'stream'
  })

  return response.data
}

const stream = await consume()
stream  
  .pipe(
    new Transform({
      transform(chunk, enc, cb) {
        const item = JSON.parse(chunk)
        console.log({ item })
        const myNumber = /\d+/.exec(item.name)[0]
        let name = item.name
        
        if(myNumber % 2 === 0) name = name.concat(' é par')
        else name = name.concat(' é impar')
        item.name = name 

        cb(null, JSON.stringify(item))
      }
    })
  )
  .pipe(
    new Transform({
      transform(chunk, enc, cb) {
        cb(null, chunk.toString().toUpperCase())
      }
    })
  )
  .pipe(
    new Writable({
      write(chunk, enc, cb) {
        console.log('ja chegou o disco voadooor', chunk.toString())
        cb()
      }
    })
  )