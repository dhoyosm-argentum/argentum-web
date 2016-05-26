'use strict';

/**
 * @ngdoc function
 * @name argentumWebApp.service:AuthCtrl
 * @description
 * # AuthCtrl
 * Controler for the authentication
 * @requires commonService
 * @author Daniel Hoyos <dhoyosm@gmail.com>
 */

angular.module('argentumWebApp')

.controller('AuthCtrl', function LoginController(commonService, $rootScope, $scope, $http, store, $state) {

    $scope.user = {};

    $scope.login = function() {
        var loginUrl = $rootScope.serverURL + '/Clients/login?include=user';
        $http({
            url: loginUrl,
            method: 'POST',
            data: $scope.user
        }).then(function(response) {
            store.set('jwt', response.data);
            $scope.user = response.data.user;
            $state.go('app');
        }, function(error) {
            console.log('error: ' + JSON.stringify(error.data));
        });
    };

    $scope.signup = function() {
        //$location.path('/signup');
    };

    $scope.logout = function() {
        var logoutUrl = $rootScope.serverURL + '/Clients/logout?access_token=' + commonService.getJwt().id;
        store.remove('jwt');
        $http({
            url: logoutUrl,
            method: 'POST'
        }).then(function(response) {
            $state.go('app.login');
        }, function(error) {
            console.log('error: ' + JSON.stringify(error.data));
        });
    };

    $scope.isLogged = function() {
        return commonService.isLogged();
    };

    $scope.name = function() {
        if (commonService.isLogged()) {
            return commonService.getUser().firstName;
        }
    };

})

.controller('SignupCtrl', function SignupController($rootScope, $scope, $http, store, $state) {

    $scope.user = {};

    $scope.createUser = function() {
        var signupUrl = $rootScope.serverURL + '/Clients';
        var loginUrl = $rootScope.serverURL + '/Clients/login?include=user';
        $http({
            url: signupUrl,
            method: 'POST',
            data: $scope.user
        }).then(function() {
            $http({
                url: loginUrl,
                method: 'POST',
                data: $scope.user
            }).then(function(response) {
                store.set('jwt', response.data);
                $state.go('app');
            }, function(error) {
                console.log('error: ' + JSON.stringify(error.data));
            });
        }, function(error) {
            console.log('error: ' + JSON.stringify(error.data));
            alert('error: ' + JSON.stringify(error.data));
        });
    };

    $scope.login = function() {
        $state.go('app.login');
    };

})

;
