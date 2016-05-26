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
}]);