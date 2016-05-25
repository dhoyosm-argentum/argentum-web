/*
    author: Daniel Hoyos
*/

'use strict';

angular.module('argentumWebApp')

.controller('HeaderCtrl', ['commonService', '$rootScope', '$scope', '$http', 'store', '$location', function(commonService, $rootScope, $scope, $http, store, $location) {

    $scope.jwt = "";
    $scope.user = "";
    if (commonService.getJwt()) {
        $scope.jwt = commonService.getJwt();
        $scope.user = commonService.getJwt().user;
    }

    

}])

.controller('LoginCtrl', function LoginController(commonService, $rootScope, $scope, $http, store, $location) {

    $scope.user = {};

    $scope.login = function() {
        var loginUrl = $rootScope.serverURL + 'Clients/login?include=user';
        $http({
            url: loginUrl,
            method: 'POST',
            data: $scope.user
        }).then(function(response) {
            store.set('jwt', response.data);
            $scope.user = response.data.user;
            $location.path('/');
        }, function(error) {
            console.log('error: ' + JSON.stringify(error.data));
        });
    };

    $scope.signup = function() {
        $location.path('/signup');
    };

    $scope.logout = function() {
        console.log("logging out!");
        var logoutUrl = $rootScope.serverURL + 'Clients/logout?access_token=' + commonService.getJwt().id;
        $http({
            url: logoutUrl,
            method: 'POST'
        }).then(function(response) {
            store.remove('jwt');
            $location.path('/login');
            console.log("logged out!");
        }, function(error) {
            console.log('error: ' + JSON.stringify(error.data));
        });
    };

    $scope.isLogged = function() {
        return commonService.isLogged();
    };

    $scope.name = function() {
        if (commonService.isLogged()){
            return commonService.getUser().firstName;
        }
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

    mainService.getAccount().query(params)
        .$promise.then(
            function(response) {
                $scope.accounts = response;
            },
            function(response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
                $scope.alertClass = "alert-danger";
            }
        );

    $scope.saveAccount = function() {
        $scope.account.clientId = jwt.user.id;

        mainService.getAccount()
            .save(params, $scope.account)
            .$promise.then(
                function(response) {
                    $('#newAccountModal').modal('hide');
                    $scope.message = "Account Created!";
                    $scope.alertClass = "alert-success";
                    $scope.accountForm.$setPristine();
                    $scope.account = {};
                    $scope.accounts = mainService.getAccount().query(params);
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                    $scope.alertClass = "alert-danger";
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
