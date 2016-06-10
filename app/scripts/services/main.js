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

.service('mainService', ['$resource', 'commonService', function($resource, commonService) {
    
    this.getClient = function() {
        return $resource(commonService.getBaseURL() + "/Clients/:id", null, {'get':{method:'GET' }});
    };

    this.getAccount = function() {
        return $resource(commonService.getBaseURL() + "/Clients/:id/accounts/:fk",
            null,
            {
                'get':{method:'GET' },
                'query': {method:'GET', isArray:true},
                'save': {method:'POST'}
            });
    };
}])
;