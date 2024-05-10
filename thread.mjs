import { parentPort, threadId } from 'node:worker_threads'

parentPort.once('message', ({from, to})=>{
    console.log({from, to, threadId})
    console.time(`benchmarck-${threadId}`)
    let count = 0
    for(let i = from; i < to; i++){
        count++
    }
    console.timeEnd(`benchmarck-${threadId}`)
    parentPort.postMessage(`Im ${threadId} done! With ${count} items`)
})