/*
    author: Daniel Hoyos
*/

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
        });
    };

    $scope.signup = function() {
        $location.path('/signup');
    };

})

.controller('SignupCtrl', function SignupController($rootScope, $scope, $http, store, $location) {

    $scope.user = {};

    $scope.createUser = function() {
        var signupUrl = $rootScope.serverURL + 'Clients';
        var loginUrl = $rootScope.serverURL + 'Clients/login?include=user';
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
                $location.path('/');
            }, function(error) {
                console.log('error: ' + JSON.stringify(error.data));
            });
        }, function(error) {
            console.log('error: ' + JSON.stringify(error.data));
            alert('error: ' + JSON.stringify(error.data));
        });
    };

    $scope.login = function() {
        $location.path('/login');
    };

})

.controller('MainCtrl', ['mainService', function(mainService) {
    
}])

.controller('AboutCtrl', function() {
    this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
    ];
})

;
