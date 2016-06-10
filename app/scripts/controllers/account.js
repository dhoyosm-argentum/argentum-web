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

.controller('AccountCtrl', ['$rootScope', '$scope', '$stateParams', 'commonService', 'mainService', 'accountService', 'transactionService',
    function($rootScope, $scope, $stateParams, commonService, mainService, accountService, transactionService) {

        $('#loader').modal('hide');
        $rootScope.loaderMessage = "Loading subaccounts...";
        $('#loader').modal({ show: true, backdrop: 'static', keyboard: false });

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
                    $('#loader').modal('hide');
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                    $scope.alertClass = "alert-danger";
                    $('#loader').modal('hide');
                }
            );

        $scope.saveSubaccount = function() {
            $rootScope.loaderMessage = "Saving subaccount...";
            $('#loader').modal({ show: true, backdrop: 'static', keyboard: false });
            $scope.subaccount.accountId = $stateParams.id;

            accountService.getSubaccount()
                .save(params, $scope.subaccount)
                .$promise.then(
                    function() {
                        $('#newSubaccountModal').modal('hide');
                        $scope.message = "Subaccount Created!";
                        $scope.alertClass = "alert-success";
                        $scope.subaccountForm.$setPristine();
                        $scope.subaccount = {};
                        $scope.subaccounts = accountService.getSubaccount().query(params)
                            .$promise.then(function(response) {
                                $scope.subaccounts = response;
                                getDistribution();
                                $('#loader').modal('hide');
                            });
                    },
                    function(response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                        $scope.alertClass = "alert-danger";
                        $('#loader').modal('hide');
                    }
                );
        };

        var getDistribution = function() {
            var dist = [];
            for (var i = 0; i < $scope.subaccounts.length; i++) {
                dist.push({
                    subaccount: $scope.subaccounts[i],
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
            }
            return total;
        };

        $scope.saveTransaction = function() {
            $rootScope.loaderMessage = "Saving transaction...";
            $('#loader').modal({ show: true, backdrop: 'static', keyboard: false });

            var transactionComposer = {};
            var subtransactions = [];
            var subaccounts = [];
            transactionComposer.transaction = $scope.transaction;
            transactionComposer.account = $scope.account;
            if ($scope.transaction.type === 'Income') {
                transactionComposer.account.balance += $scope.transaction.amount;
            } else {
                transactionComposer.account.balance -= $scope.transaction.amount;
            }

            for (var i = 0; i < $scope.distribution.length; i++) {
                var dist = $scope.distribution[i];
                if (dist.percentage > 0) {
                    var subamount = ($scope.transaction.amount * dist.percentage / 100);
                    subtransactions.push({
                        date: $scope.transaction.date,
                        description: $scope.transaction.description,
                        type: $scope.transaction.type,
                        percentage: dist.percentage,
                        amount: subamount,
                        subaccountId: dist.subaccount.id
                    });

                    if ($scope.transaction.type === 'Income') {
                        dist.subaccount.balance += subamount;
                    } else {
                        dist.subaccount.balance -= subamount;
                    };
                    subaccounts.push(dist.subaccount);
                }
            }
            transactionComposer.subtransactions = subtransactions;
            transactionComposer.subaccounts = subaccounts;

            transactionService.composeTransaction()
                .save(params, transactionComposer)
                .$promise.then(
                    function() {
                        $('#transactionModal').modal('hide');
                        $scope.message = "Transaction Added!";
                        $scope.alertClass = "alert-success";
                        $scope.transactionForm.$setPristine();
                        $scope.transaction = {};
                        mainService.getAccount().get({
                                id: jwt.user.id,
                                fk: $stateParams.id,
                                access_token: jwt.id
                            })
                            .$promise.then(
                                function(response) {
                                    $scope.account = response;
                                    accountService.getSubaccount().query(params)
                                        .$promise.then(
                                            function(response) {
                                                $scope.subaccounts = response;
                                                getDistribution();
                                                $('#loader').modal('hide');
                                            },
                                            function(response) {
                                                $scope.message = "Error: " + response.status + " " + response.statusText;
                                                $scope.alertClass = "alert-danger";
                                                $('#loader').modal('hide');
                                            }
                                        );
                                },
                                function(response) {
                                    $scope.message = "Error: " + response.status + " " + response.statusText;
                                    $scope.alertClass = "alert-danger";
                                    $('#loader').modal('hide');
                                }
                            );
                    },
                    function(response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                        $scope.alertClass = "alert-danger";
                        $('#loader').modal('hide');
                    }
                );
        };
    }
])

;
