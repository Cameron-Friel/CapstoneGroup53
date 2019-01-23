'use strict';

let State = (function() {
  return {
    isPausedFlag: false,

    /*
      * Updates the value of isPausedFlag
      * @param {boolean} bool - the current value of the isPausedFlag variable
    */

    setIsPausedFlag: function(bool) {
      this.isPausedFlag = !bool;
    },

    /*
      * Returns whether the world is paused or not
      * @returns {State} isPausedFlag
    */

    getIsPausedFlag: function() {
      return this.isPausedFlag;
    },
  };
})();

module.exports = State;
