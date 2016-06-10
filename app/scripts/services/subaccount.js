'use strict';

/**
* @ngdoc function
* @name argentumWebApp.service:subaccountService
* @description
* # subaccountService
* Service that gets Subaccount info from the Api
* @requires commonService
* @author Daniel Hoyos <dhoyosm@gmail.com>
*/

angular.module('argentumWebApp')

.service('subaccountService', ['$resource', 'commonService', function($resource, commonService) {
    
    this.subaccount = function() {
        return $resource(commonService.getBaseURL() + "/Subaccounts/:id",
            null, {
                'get': { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                'save': { method: 'POST' }
            });
    };

    this.subtransactions = function() {
        return $resource(commonService.getBaseURL() + "/Subaccounts/:id/transactions",
            null, {
                'get': { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                'save': { method: 'POST' }
            });
    };
}])

;