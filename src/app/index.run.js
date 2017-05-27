(function() {
  'use strict';

  angular
    .module('ngAzaanMeanStack')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
