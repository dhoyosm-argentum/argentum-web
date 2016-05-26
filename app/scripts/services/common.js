'use strict';

/**
 * @ngdoc function
 * @name argentumWebApp.service:commonService
 * @description
 * # commonService
 * Service to provide common functions on the app
 * @author Daniel Hoyos <dhoyosm@gmail.com>
 */

angular.module('argentumWebApp')

.factory('commonService', ['$rootScope', 'store', function($rootScope, store) {
    var common = {};

    common.setLocalStore = function(key, value) {
        store.set(key, value);
    };

    common.getLocalStore = function(key) {
        return store.get(key);
    };

    common.getBaseURL = function() {
        return $rootScope.serverURL;
    };

    common.getJwt = function() {
        return common.getLocalStore('jwt');
    };

    common.getToken = function() {
        return common.getLocalStore('jwt').id;
    };

    common.getUser = function() {
        return common.getLocalStore('jwt').user;
    };

    common.isLogged = function() {
        if (store.get('jwt')) {
            return true;
        }
        return false;
    };

    return common;
}])

;
