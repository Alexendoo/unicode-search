const worker = new Worker("/js/worker.js");

worker.onmessage = console.log;
