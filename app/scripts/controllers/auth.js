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
    $scope.message = "";
    $('#loader').modal('hide');

    $scope.login = function() {
        $rootScope.loaderMessage = "Logging in...";
        $('#loader').modal({ show: true, backdrop: 'static', keyboard: false });
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
            $('#loader').modal('hide');
            console.log('error.status: ' + error.status);
            $scope.message = "An error has occurred. Please try again.";
            if (error.status === 401) {
                $scope.message = "Wrong email/password combination. Please try again.";
            }
            console.log('error: ' + angular.toJson(error.data));
        });
    };

    $scope.signup = function() {
        $state.go('app.signup');
    };

    $scope.logout = function() {
        var logoutUrl = $rootScope.serverURL + '/Clients/logout?access_token=' + commonService.getJwt().id;
        $rootScope.loaderMessage = "Loggin out...";
        $('#loader').modal({ show: true, backdrop: 'static', keyboard: false });
        $http({
            url: logoutUrl,
            method: 'POST'
        });
        store.remove('jwt');
        $state.go('app.login');
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

.controller('SignupCtrl', function SignupController(commonService, $rootScope, $scope, $http, store, $state) {

    $scope.user = {};
    $scope.message = "";

    $scope.createUser = function() {
        var signupUrl = $rootScope.serverURL + '/Clients';
        var loginUrl = $rootScope.serverURL + '/Clients/login?include=user';

        $rootScope.loaderMessage = "Signing up...";
        $('#loader').modal({ show: true, backdrop: 'static', keyboard: false });
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
                $('#loader').modal('hide');
            });
        }, function(error) {
            console.log('error.status: ' + error.status);
            $scope.message = "An error has occurred. Please try again.";
            if (error.status === 422) {
                $scope.message = "Email '" + $scope.user.email + "' already exists";
            }
            console.log('error: ' + angular.toJson(error.data));
            $('#loader').modal('hide');
        });
    };

    $scope.login = function() {
        $state.go('app.login');
    };
})

.directive('confirmPwd', function($interpolate, $parse) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ngModelCtrl) {
            var pwdToMatch = $parse(attr.confirmPwd);
            var pwdFn = $interpolate(attr.confirmPwd)(scope);
            scope.$watch(pwdFn, function(newVal) {
                ngModelCtrl.$setValidity('password', ngModelCtrl.$viewValue === newVal);
            });

            ngModelCtrl.$validators.password = function(modelValue, viewValue) {
                var value = modelValue || viewValue;
                return value === pwdToMatch(scope);
            };

        }
    };
})

;
