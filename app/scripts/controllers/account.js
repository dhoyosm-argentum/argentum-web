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

.controller('AccountCtrl', ['$scope', '$stateParams', 'commonService', 'mainService', 'accountService', 'transactionService',
    function($scope, $stateParams, commonService, mainService, accountService,transactionService) {

        $('.input-group.date').datepicker({
            autoclose: true,
            todayBtn: true,
            todayHighlight: true
        });

        var jwt = commonService.getJwt();
        var params = {
            id: $stateParams.id,
            access_token: jwt.id
        };

        $scope.message = "";
        $scope.alertClass = "";

        //$scope.types = ['Savings', 'Checking', 'Cash'];

        mainService.getAccount().get({
                id: jwt.user.id,
                fk: $stateParams.id,
                access_token: jwt.id
            })
            .$promise.then(
                function(response) {
                    $scope.account = response;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                    $scope.alertClass = "alert-danger";
                }
            );

        accountService.getSubaccount().query(params)
            .$promise.then(
                function(response) {
                    $scope.subaccounts = response;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                    $scope.alertClass = "alert-danger";
                }
            );

        $scope.saveSubaccount = function() {
            $scope.subaccount.accountId = $stateParams.id;

            accountService.getSubaccount()
                .save(params, $scope.subaccount)
                .$promise.then(
                    function(response) {
                        $('#newSubaccountModal').modal('hide');
                        $scope.message = "Subaccount Created!";
                        $scope.alertClass = "alert-success";
                        $scope.subaccountForm.$setPristine();
                        $scope.subaccount = {};
                        $scope.subaccounts = accountService.getSubaccount().query(params);
                    },
                    function(response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                        $scope.alertClass = "alert-danger";
                    }
                );
        };

        $scope.saveTransaction = function() {
            $scope.transaction.accountId = $stateParams.id;
            transactionService.getTransactions()
                .save(params, $scope.transaction)
                .$promise.then(
                    function(response) {
                        $('#transactionModal').modal('hide');
                        $scope.message = "Transaction Added!";
                        $scope.alertClass = "alert-success";
                        $scope.transactionForm.$setPristine();
                        $scope.transaction = {};
                        // TODO Update Account and subaccounts info
                        //$scope.subaccounts = accountService.getSubaccount().query(params);
                    },
                    function(response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                        $scope.alertClass = "alert-danger";
                    }
                );
        };
    }
])

;
