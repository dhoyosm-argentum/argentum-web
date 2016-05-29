'use strict';

/**
* @ngdoc function
* @name argentumWebApp.service:accountService
* @description
* # accountService
* Service that gets Account info from the Api
* @requires commonService
* @author Daniel Hoyos <dhoyosm@gmail.com>
*/

angular.module('argentumWebApp')

.service('accountService', ['$resource', 'commonService', function($resource, commonService) {
    
    this.getSubaccount = function() {
        return $resource(commonService.getBaseURL() + "/Accounts/:id/subaccounts",
            null, {
                'get': { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                'save': { method: 'POST' }
            });
    };
}])
