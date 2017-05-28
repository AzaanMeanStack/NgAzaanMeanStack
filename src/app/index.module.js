/**
 * @author : Shoukath Mohammed
 */
(function() {

  'use strict';

  var app = angular
    .module('AzaanApp', [
    	, 'ngSanitize'
    	, 'ngAria'
    	, 'ngResource'
    	, 'ui.router'
    	, 'mgcrea.ngStrap'
    	, 'toastr'
    ]);

    /**
 * Directives declaration
 */
app.directive('addEvent', addEvent);
app.directive('addPrayer', addPrayer);
app.directive('editEvent', editEvent);
app.directive('editPrayer', editPrayer);
app.directive('panelDropdown', panelDropdown);
app.directive('addOrganization', addOrganization);
app.directive('addAnnouncement', addAnnouncement);
app.directive('editOrganization', editOrganization);
app.directive('editAnnouncement', editAnnouncement);
app.directive('manageOrganization', manageOrganization);


function addAnnouncement() {
    return {
        restrict: 'E',
        templateUrl: 'app/announcements/add-announcement-panel.html'
    };
}

function editAnnouncement() {
    return {
        restrict: 'E',
        templateUrl: 'app/announcements/edit-announcement-panel.html'
    };
}

function addEvent() {
    return {
        restrict: 'E',
        templateUrl: 'app/events/add-event-panel.html'
    };
}

function editEvent() {
    return {
        restrict: 'E',
        templateUrl: 'app/events/edit-event-panel.html'
    };
}

function addOrganization() {
    return {
        restrict: 'E',
        templateUrl: 'app/organizations/add-organization-panel.html'
    };
}

function editOrganization() {
    return {
        restrict: 'E',
        templateUrl: 'app/organizations/edit-organization-panel.html'
    };
}

function manageOrganization() {
    return {
        restrict: 'E',
        templateUrl: 'app/organizations/manage-organization-panel.html'
    };
}

function addPrayer() {
    return {
        restrict: 'E',
        templateUrl: 'app/prayers/add-prayer-panel.html'
    };
}

function editPrayer() {
    return {
        restrict: 'E',
        templateUrl: 'app/prayers/edit-prayer-panel.html'
    };
}

function panelDropdown() {
    return {
        restrict: 'E',
        templateUrl: 'app/panel-dropdown.html'
    };
}

/**
 * Configuration declaration
 */
app.config(httpProvider);
httpProvider.$inject = ['$httpProvider'];

function httpProvider($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = "*";
    $httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = "GET, POST", "PUT", "DELETE", "OPTIONS";

    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
})();
