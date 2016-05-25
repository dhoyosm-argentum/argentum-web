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

.controller('MainCtrl', ['$scope', 'commonService', 'mainService', function($scope, commonService, mainService) {
    var jwt = commonService.getJwt();
    var params = {
        id: jwt.user.id,
        access_token: jwt.id
    };

    $scope.message = "";
    $scope.alertClass = "";

    $scope.types = ['Savings', 'Checking', 'Cash'];
    //$scope.account = {};

    mainService.getAccount().query(params)
        .$promise.then(
            function(response) {
                $scope.accounts = response;
                $scope.message = "";
            },
            function(response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
                console.log("Error: " + response.status + " " + response.statusText);
            }
        );

    $scope.saveAccount = function() {
        $scope.account.clientId = jwt.user.id;
        console.log("Account: " + angular.toJson($scope.account));

        mainService.getAccount()
            .save(params, $scope.account)
            .$promise.then(
                function(response) {
                    console.log("Account Saved");
                    console.log("Response: " + angular.toJson(response));
                    $('#newAccountModal').modal('hide');
                    $scope.message = "Account Created!";
                    $scope.alertClass = "alert-success";
                    $scope.accountForm.$setPristine();
                    $scope.account = {};
                    $scope.accounts = mainService.getAccount().query(params);
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
    };
}])

.controller('AboutCtrl', function() {
    this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
    ];
})

;
