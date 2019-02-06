'use strict';

let Graph = (function() {
  let _graph = null;

  return {
    /**
      * Creates a new graph
      * @param {} reference - The reference to the html page
      * @param {} data - The graph data
    */

    createGraph: function(reference, data) {
      _graph = new Chart(reference, {
      type: 'line',
      data: {
        datasets: data.datasets,
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

  addGraphData: function(data) {
    _graph.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });

    _graph.update();
  },

  /**
    * Resets the chart data back to an empty state
    * @param {} data - The graph data
  */

  resetGraphData: function(data) {
    _graph.config.data = data;
    _graph.update();
  },
};
})();

module.exports = Graph;
