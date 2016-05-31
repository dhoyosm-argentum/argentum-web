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
    function($scope, $stateParams, commonService, mainService, accountService, transactionService) {

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
        $scope.distribution = [];

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
                    getDistribution();
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
                        getDistribution();
                    },
                    function(response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                        $scope.alertClass = "alert-danger";
                    }
                );
        };

        var getDistribution = function() {
            var dist = [];
            for (var i = 0; i < $scope.subaccounts.length; i++) {
                dist.push({
                    id: $scope.subaccounts[i].id,
                    name: $scope.subaccounts[i].name,
                    percentage: 0
                });
            }
            $scope.distribution = dist;
        };

        $scope.distTotal = function() {
            var total = 0;
            var item = $scope.distribution;
            for (var i = 0; i < item.length; i++) {
                total += item[i].percentage;
            };
            return total;
        };

        $scope.saveTransaction = function() {
            $scope.transaction.accountId = $stateParams.id;
            $scope.transaction.distribution = $scope.distribution;
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
