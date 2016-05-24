/*
    author: Daniel Hoyos
*/

'use strict';

angular.module('argentumWebApp')

.service('mainService', ['$resource', 'commonService', function($resource, commonService) {
    
    this.getAccounts = function() {
    };
}])

.factory('commonService', ['$rootScope', 'store', function($rootScope, store) {
    var common = {};

    common.getBaseURL = function() {
        return $rootScope.serverURL;
    };

    common.getToken = function() {
        var jwt = store.get('jwt');
        return jwt.id;
    };

    return common;
}])

;