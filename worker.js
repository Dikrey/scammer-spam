// worker.js
const axios = require('axios');
const { workerData, parentPort } = require('worker_threads');

const urls = workerData.urls;
const id = workerData.id;

let totalSent = 0;
let totalOK = 0;
let totalErr = 0;
let totalDown = 0;
let latencySum = 0;

const http = axios.create({
  timeout: 4000,
  validateStatus: () => true
});

async function hit(url) {
  const start = Date.now();

  try {
    const res = await http.get(url + encodeURIComponent("ForensicTestCLI"));
    const ms = Date.now() - start;

    latencySum += ms;
    totalSent++;

    if (res.status === 200) {
      totalOK++;
    } else {
      totalErr++;
    }

  } catch (err) {
    const ms = Date.now() - start;
    latencySum += ms;
    totalSent++;

    if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
      totalDown++;
      parentPort.postMessage({
        type: 'log',
        text: `Worker ${id}: API DOWN (${err.code})`
      });

    } else {
      // FAILED SEND = tidak mencapai server karena mslh jaringan
      totalErr++;
      parentPort.postMessage({
        type: 'log',
        text: `Worker ${id}: FAILED SEND (${err.message})`
      });
    }
  }
}

async function loop() {
  while (true) {
    const promises = urls.map(u => hit(u));
    await Promise.allSettled(promises);

    parentPort.postMessage({
      type: 'stats',
      data: {
        sentDelta: urls.length,
        okDelta: totalOK,
        errDelta: totalErr,
        downDelta: totalDown,
        latencyAvg: totalSent ? latencySum / totalSent : 0
      }
    });

    // reset delta
    totalOK = 0;
    totalErr = 0;
    totalDown = 0;
    latencySum = 0;

    parentPort.postMessage({
      type: 'log',
      text: `Worker ${id}: batch done (${urls.length} req)`
    });
  }
}

loop();
