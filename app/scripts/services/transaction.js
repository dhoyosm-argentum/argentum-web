'use strict';

/**
 * @ngdoc function
 * @name argentumWebApp.service:transactionService
 * @description
 * # transactionService
 * Service that gets Transaction info from the Api
 * @requires commonService
 * @author Daniel Hoyos <dhoyosm@gmail.com>
 */

angular.module('argentumWebApp')

.service('transactionService', ['$resource', 'commonService', function($resource, commonService) {

    this.getTransactions = function() {
        return $resource(commonService.getBaseURL() + "/Accounts/:id/transactions",
            null, {
                'get': { method: 'GET' },
                'query': { method: 'GET', isArray: true },
                'save': { method: 'POST' }
            });
    };

    this.composeTransaction = function() {
        return $resource(commonService.getBaseURL() + "/TransactionComposers/compose",
            null, {
                'save': { method: 'POST' }
            });
    };
}])

;
