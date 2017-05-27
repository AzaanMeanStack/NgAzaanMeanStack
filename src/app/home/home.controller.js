/**
 * @author : Shoukath Mohammed
 */
(function() {

  'use strict';

  angular
    .module('AzaanApp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $http, $log, $stateParams, $state, utilService, $window) {
    
    var that = this;

    $scope.item = {
        events: [],
        prayer: [],
        announcements: []
    };

    $scope.eventObj = {};
    $scope.prayerObj = {};
    $scope.announcementObj = {};

    $scope.viewJSON = false;
    $scope.isEditTab = true;
    $scope.isUpdateTab = false;

    $scope.refresh = function() {
        $http.get('/contactlist').success(function(response) {
            $scope.contactlist = response;
            $scope.getDynamicOptions(response);
            $scope.contact = "";
        });
    };

    $scope.getDynamicOptions =  function(response) {
        $scope.options = [{_id: "DEFAULT", orgName:"Select an option"}];

        var arr = _.map(response, function(org) {
            return _.pick(org, '_id', 'orgName');
        });

        _.each(arr, function(arg) {
            $scope.options.push(arg);
        });
    };

    $scope.refresh();

    $scope.addOrganization = function(obj) {
        if ( !_.isEmpty(obj) ) {
            $http.post('/contactlist', obj).success(function(response) {
                $scope.refresh();
                utilService.showAlert('success','Masjid successfully added.');
                $scope.refresh();
            });
        } else {
            utilService.showAlert('danger', 'Fields cannot be empty.');
        }
    };

    $scope.deleteOrganization = function(id) {
        $http['delete']('/contactlist/' + id).success(function(response) {
            $scope.refresh();
            utilService.showAlert('success','Record successfully deleted.');
        });
    };

    $scope.edit = function(id) {
        $http.get('/contactlist/' + id).success(function(response) {
            if (response) {
                $scope.contact = response;
                $scope.setActiveTab("UPDATE");
            }
        });
    };

    $scope.loadData = function(id) {
        if ( id != "DEFAULT" ) {
            $http.get('/contactlist/' + id).success(function(response) {
                if (response) {
                    $scope.contact = response;
                    $scope.setActiveTab("EDIT");
                }
            });
        } else {
            $scope.contact = "";
        }
    };

    $scope.updatePrayer = function(id) {

        // updates the prayer array with the latest object
        var index =  _.findIndex($scope.contact.prayer, {'id': id });
        $scope.contact.prayer[index] = $scope.prayerToEdit;

        var obj = _.extend({operation: 'UPDATE_PRAYER'}, $scope.contact.prayer[index]);

        if ( !_.isEmpty($scope.contact) ) {
            $http.put('/contactlist/' + $scope.contact._id, obj).success(function(response) {
                utilService.showAlert('success', 'Successfully Updated.');
                $scope.setActiveTab("EDIT");
            });
            $scope.prayerToEdit = "";
        } else {
            utilService.showAlert('danger', 'Fields cannot be empty.');
        }
    };

    $scope.editPrayer = function(id) {
        $scope.prayerToEdit = _.findWhere($scope.contact.prayer, {'id': id });
        $scope.setActiveTab("UPDATE");
    }

    $scope.addPrayer = function(prayer) {
        prayer.id = Math.floor(1000 + Math.random() * 9000);
        var obj = _.extend({operation: 'ADD_PRAYER'}, prayer);

        if ( !_.isEmpty(prayer) ) {
            $http.put('/contactlist/' + $scope.contact._id, obj).success(function(response) {
                $scope.resetSelectedOrg();
                utilService.showAlert('success','Record successfully added.');
            });
        } else {
            utilService.showAlert('danger', 'Fields cannot be empty.');
        }
    };

    $scope.updateItem = function(id, operation, itemType) {
        var arr;
        // updates the prayer array with the latest object

        if(itemType == 'EVENT') {
            arr = $scope.contact.events;
        } else {
            arr = $scope.contact.announcements;
        }
        var index =  _.findIndex(arr, {'id': id });
        (itemType=="EVENT") ? ($scope.contact.events[index] = $scope.itemToEdit) : ($scope.contact.announcements[index] = $scope.itemToEdit);

        var obj = _.extend({operation: operation}, $scope.contact.prayer[index]);

        if ( !_.isEmpty($scope.contact) ) {
            $http.put('/contactlist/' + $scope.contact._id, obj).success(function(response) {
                utilService.showAlert('success', 'Successfully Updated.');
                $scope.setActiveTab("EDIT");
            });
            $scope.itemToEdit = "";
        } else {
            utilService.showAlert('danger', 'Fields cannot be empty.');
        }
    };

    $scope.deleteItem = function(id, itemType) {
        var _itemToDelete = _.findWhere($scope.contact.prayer, {'id': id });
        _itemToDelete = _.extend(_itemToDelete, {itemType: itemType});

        var config = {
                method: "DELETE",
                url: '/contactlist/' + $scope.contact._id,
                data: _itemToDelete,
                headers: {"Content-Type": "application/json;charset=utf-8"}
        };

        $http(config).success(function(response) {
            utilService.showAlert('success','Record successfully deleted.');
        });
        $scope.resetSelectedOrg();
    };

    $scope.editEvent = function(id) {
        $scope.itemToEdit = _.findWhere($scope.contact.events, {'id': id });
        $scope.setActiveTab("UPDATE");
    }

    /**
     * fetch latest data from the database
     * for selected organization
     */
    $scope.resetSelectedOrg = function() {
        $scope.loadData($scope.contact._id);
    };

    $scope.deselect = function() {
        $scope.setActiveTab("EDIT");
    };

    $scope.refreshTabs = function(obj) {
        for (var tab in obj) {
            if (obj.tab) {
                obj.tab = false;
            }
        }
    };

    $scope.setActiveTab = function(activeTab) {
        if (activeTab == "EDIT") {
            $scope.isEditTab = true;
            $scope.isUpdateTab = false;
        } else {
            $scope.isEditTab = false;
            $scope.isUpdateTab = true;
        }
    };

    $scope.clear = function(obj) {
        for (var key in obj){
            if (obj.hasOwnProperty(key)){
                delete obj[key];
            }
        }
    };

    $scope.add =  function(itemType) {
        var _id = Math.floor(1000 + Math.random() * 9000);
        var _date = new Date();

        if( !_.isEmpty($scope.prayerObj) || !_.isEmpty($scope.eventObj) || !_.isEmpty($scope.announcementObj) ) {
            if ( itemType == "PRAYER_TIME" ) {
                $scope.prayerObj.id = _id;
                $scope.prayerObj.lastUpdated = _date.toJSON();
                $scope.item.prayer.push($scope.prayerObj);
                $scope.prayerObj = {};
            } else if( itemType == "EVENT" ) {
                $scope.eventObj.id = _id;
                $scope.eventObj.lastUpdated = _date.toJSON();
                $scope.item.events.push($scope.eventObj);
                $scope.eventObj = {};
            } else if( itemType == "ANNOUNCEMENT" ) {
                $scope.announcementObj.id = _id;
                $scope.announcementObj.lastUpdated = _date.toJSON();
                $scope.item.announcements.push($scope.announcementObj);
                $scope.announcementObj = {};
            }
            $scope.item.dateCreated = _date.toJSON();
        }
    };

    $scope.reset =  function(itemType) {
        if( itemType == "ALL" ) {
            $scope.item = {};
            $scope.item.prayer = [];
            $scope.item.events = [];
            $scope.item.announcements = [];
        }

        if(itemType == "PRAYER_TIME") {
            $scope.item.prayer = [];
        }

        if( itemType == "EVENT" ) {
            $scope.item.events = [];
        }

        if( itemType == "ANNOUNCEMENT" ) {
            $scope.item.announcements = [];
        }
    };
  }
})();
