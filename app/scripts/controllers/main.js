'use strict';

/**
 * @ngdoc function
 * @name argentumWebApp.controllers:MainCtrl
 * @description
 * # MainCtrl
 * Controller for the main page
 * @requires commonService, mainService
 * @author Daniel Hoyos <dhoyosm@gmail.com>
 */

angular.module('argentumWebApp')

.controller('MainCtrl', ['$rootScope', '$scope', 'commonService', 'mainService', function($rootScope, $scope, commonService, mainService) {
    var jwt = commonService.getJwt();
    var params = {
        id: jwt.user.id,
        access_token: jwt.id
    };

    $scope.message = "";
    $scope.alertClass = "";

    $scope.types = ['Savings', 'Checking', 'Cash'];

    $('#loader').modal('hide');
    $rootScope.loaderMessage = "Loading accounts...";
    $('#loader').modal({ show: true, backdrop: 'static', keyboard: false });

    mainService.getAccount().query(params)
        .$promise.then(
            function(response) {
                $scope.accounts = response;
                $('#loader').modal('hide');
            },
            function(response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
                $scope.alertClass = "alert-danger";
                $('#loader').modal('hide');
            }
        );

    $scope.saveAccount = function() {
        $scope.account.clientId = jwt.user.id;
        $rootScope.loaderMessage = "Saving account...";
        $('#loader').modal({ show: true, backdrop: 'static', keyboard: false });

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
                    $('#loader').modal('hide');
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                    $scope.alertClass = "alert-danger";
                    $('#loader').modal('hide');
                }
            );
    };
}]);
