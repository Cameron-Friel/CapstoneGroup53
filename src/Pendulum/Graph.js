'use strict';

let Graph = (function() {
  let _graph = {};

  return {
    /**
      * Creates a new graph
      * @param {} reference - The reference to the html page
      * @param {} data - The graph data
    */

    createGraph: function(reference, data) {
      let tempData = JSON.parse(JSON.stringify(data));

      _graph = new Chart(reference, {
      type: 'line',
      data: {
        datasets: tempData.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        showLines: true,
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom',
            scaleLabel: {
              labelString: 'Time (ms)',
              display: true
            }
          }],
        }
      }
    });
  },

  /**
    * Adds points to the graph
    * @param {} data - The graph data
  */

  addGraphData: function(data, dataset) {
    _graph.data.datasets[dataset].data.push(data);

    _graph.update();
  },

  /**
    * Resets the chart data back to an empty state
    * @param {} newData - The graph data
  */

  resetGraphData: function(data) {
    let tempData = JSON.parse(JSON.stringify(data));

    _graph.config.data = tempData;
    _graph.update();
  },
};
})();

module.exports = Graph;
