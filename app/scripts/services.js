/*
    author: Daniel Hoyos
*/

'use strict';

angular.module('argentumWebApp')

.service('mainService', ['$resource', 'commonService', function($resource, commonService) {
    var jwt = commonService.getJwt();

    this.getClient = function() {
        return $resource(commonService.getBaseURL() + "Clients/:id", null, {'get':{method:'GET' }});
    }

    this.getAccount = function() {
        return $resource(commonService.getBaseURL() + "Clients/:id/accounts",
            null,
            {
                'get':{method:'GET' },
                'query': {method:'GET', isArray:true},
                'save': {method:'POST'}
            });
    };
    /*
        this.getDishes = function() {
            return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});

        };

        this.getPromotion = function() {
            return $resource(baseURL+"promotions/:id",null,  {'get':{method:'GET' }});
        };
        */
}])

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
    }

    return common;
}])

;