const { PerformanceObserver, performance } = require('perf_hooks');
const length = 100000

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries());
  performance.clearMarks();
});
const ar = Array(length).fill(Math.random())
const set = new Set(ar)

obs.observe({ entryTypes: ['measure'] });

performance.mark('A')

ar.slice(0, length/2).concat([Math.random()]).concat(ar.slice(length/2))

performance.mark('B')
performance.measure('slice.concat', 'A', 'B');

performance.mark('C')

let ar2 = ar.slice(0, length/2)
ar2.push.apply(ar2, [Math.random()])
ar2.push.apply(ar2, ar.slice(length/2))

performance.mark('D')
performance.measure('slice.push', 'C', 'D');


performance.mark('E')



performance.mark('F')
performance.measure('creating new set', 'E', 'F');