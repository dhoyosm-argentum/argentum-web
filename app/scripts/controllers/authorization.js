'use strict';

angular.module('argentumWebApp')

.controller('LoginCtrl', function LoginController($rootScope, $scope, $http, store, $location) {

    $scope.user = {};

    $scope.login = function() {
        var loginUrl = $rootScope.serverURL + 'Clients/login?include=user';
        $http({
            url: loginUrl,
            method: 'POST',
            data: $scope.user
        }).then(function(response) {
            store.set('jwt', response.data);
            $location.path('/');
        }, function(error) {
            console.log('error: ' + JSON.stringify(error.data));
            alert(error.data);
        });
    };

});
