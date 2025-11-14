
const fs = require('fs');
const { Worker } = require('worker_threads');
const blessed = require('blessed');
const contrib = require('blessed-contrib');

const urls = fs.readFileSync('urls.txt', 'utf8').trim().split('\n');
const THREADS = 4;
const TEXT = "ERROR";

const screen = blessed.screen();
const grid = new contrib.grid({ rows: 12, cols: 12, screen });


const statsBox = grid.set(0, 0, 4, 6, blessed.box, {
  label: 'Status',
  border: 'line',
  style: { border: { fg: 'cyan' } }
});


const rpsChart = grid.set(0, 6, 4, 6, contrib.line, {
  label: 'RPS Chart',
  style: { line: 'green', text: 'white' },
  wholeNumbersOnly: true,
  maxY: 300
});


const workerTable = grid.set(4, 0, 4, 12, contrib.table, {
  keys: true,
  label: 'Workers',
  border: { type: 'line', fg: 'cyan' },
  columnSpacing: 4,
  columnWidth: [10, 12, 12, 12, 12, 14]
});


const logBox = grid.set(8, 0, 4, 12, blessed.log, {
  label: 'Logs',
  border: 'line',
  style: { fg: 'white', border: { fg: 'cyan' } }
});

screen.render();

// === GLOBAL STATS ===
let globalStats = {
  totalSent: 0,
  totalOK: 0,
  totalErr: 0,
  totalDown: 0,       
  avgLatency: 0,
  historyRPS: []
};

let workers = [];

for (let i = 1; i <= THREADS; i++) {
  const w = new Worker('./worker.js', { workerData: { id: i, urls, text: TEXT } });

  w.on('message', msg => {
    if (msg.type === 'stats') {
      const s = msg.data;

      globalStats.totalSent += s.sentDelta;
      globalStats.totalOK += s.okDelta;
      globalStats.totalErr += s.errDelta;
      globalStats.totalDown += s.downDelta; 
      globalStats.avgLatency = s.latencyAvg;

      updateDashboard();
    }

    if (msg.type === 'log') {
      logBox.add(msg.text);
    }
  });

  workers.push(w);
}

function updateDashboard() {

  statsBox.setContent(
  ` Creator        : Raihan_official0307\n` +
  ` Powered By     : Visualcodepo\n` +
  ` Total Requests : ${globalStats.totalSent}\n` +
  ` OK Responses   : ${globalStats.totalOK}\n` +
  ` Errors         : ${globalStats.totalErr}\n` +
  ` API DOWN       : ${globalStats.totalDown}\n` +
  ` Avg Latency    : ${globalStats.avgLatency.toFixed(1)} ms`
);

  


  const last = globalStats.historyRPS.slice(-1)[0] || 0;
  const rps = globalStats.totalSent - last;

  globalStats.historyRPS.push(globalStats.totalSent);
  if (globalStats.historyRPS.length > 40) globalStats.historyRPS.shift();

  rpsChart.setData([{
    title: 'RPS',
    x: globalStats.historyRPS.map((_, i) => i.toString()),
    y: globalStats.historyRPS.map((v, i, arr) =>
      i === 0 ? 0 : arr[i] - arr[i - 1])
  }]);

 
  workerTable.setData({
    headers: ['ID', 'Sent', 'OK', 'Err', 'Down', 'Latency(ms)'],
    data: workers.map((_, i) => [
      `Worker ${i+1}`,
      globalStats.totalSent,
      globalStats.totalOK,
      globalStats.totalErr,
      globalStats.totalDown,
      globalStats.avgLatency.toFixed(1)
    ])
  });

  screen.render();
}


screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
