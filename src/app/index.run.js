/**
 * @author : Shoukath Mohammed
 */
(function() {

  'use strict';

  angular
    .module('AzaanApp')
    .run(run);

  /** @ngInject */
  function run($log) {
    $log.debug('Run block ends!');
  }
})();
