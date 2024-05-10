import { execSync } from 'node:child_process'
import { Worker } from 'node:worker_threads'

function getCurrentThreadCount(){
    //obtém qtd de threads do processo e conta
    return parseInt(execSync(`tasklist /FI "PID eq ${process.pid}" | find /c /v ""`).toString())
}

function createThread(data){
    const worker = new Worker('./thread.mjs')
    const p = new Promise((resolve, reject)=>{
        worker.once('message', (message)=>{
            return resolve(message)
        })
        worker.once('error', reject)
    })
    worker.postMessage(data)
    return p
}

const nodeDefaultThreadNumber = getCurrentThreadCount()

console.log(`Im running`, process.pid,`default threads: ${nodeDefaultThreadNumber}`)

let nodeThreadCount = 0
const intervalId = setInterval(()=>{
    // console.log(`running at every sec: ${new Date().toISOString()}`)

    //Dessa forma aparece apenas as threads criadas manualmente no console.log
    const currentThreads = getCurrentThreadCount() - nodeDefaultThreadNumber
    if(currentThreads == nodeThreadCount) return

    nodeThreadCount = currentThreads
    console.log('threads', nodeThreadCount)
})

await Promise.all([
    ////////////////
    createThread({////
        to: 1e9,    ///
        from: 0     /////
    }),             ////// Paralelismo
    createThread({  /////
        to: 1e9,    ///
        from: 0     ///
    }),          ////
    //////////////
    createThread({
        to: 1e8,
        from: 0
    }),
    createThread({
        to: 1e10,
        from: 0
    }),
    createThread({
        to: 1e3,
        from: 0
    }),
]).then(results => console.log(results))

clearInterval(intervalId)