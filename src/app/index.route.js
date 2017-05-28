/**
 * @author : Shoukath Mohammed
 */
(function() {

  'use strict';

  angular
    .module('AzaanApp')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('/', {
        url : "/",
        templateUrl : "app/home/home.html",
        controller: function($rootScope) {
            $rootScope.viewClass = 'dashboard-view';
        }
    })
    .state('azaan', {
        url : "/azaan-timings",
        templateUrl : "app/views/azaan-timings-view.html",
        controller: function($rootScope) {
            $rootScope.viewClass = 'azaan-timings-view';
        }
    })
    .state('edit', {
        url : "/edit-timings",
        templateUrl : "app/views/panels-view.html",
        controller: function($rootScope) {
            $rootScope.viewClass = 'edit-timings-view';
        }
    });
    $urlRouterProvider.otherwise('/');
  }

})();