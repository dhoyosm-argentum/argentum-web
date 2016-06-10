'use strict';

/**
 * @ngdoc function
 * @name argentumWebApp.service:subaccountService
 * @description
 * # subaccountService
 * Service that gets Subaccount info from the Api
 * @requires commonService
 * @author Daniel Hoyos <dhoyosm@gmail.com>
 */
angular.module('argentumWebApp')

.controller('SubaccountCtrl', ['$rootScope', '$scope', '$stateParams', '$filter', 'commonService', 'subaccountService',
    function($rootScope, $scope, $stateParams, $filter, commonService, subaccountService) {

        $('#loader').modal('hide');
        $rootScope.loaderMessage = "Loading subaccount info...";
        $('#loader').modal({ show: true, backdrop: 'static', keyboard: false });

        $('.input-group.input-daterange').datepicker({
            autoclose: true,
            todayBtn: true,
            todayHighlight: true
        });

        var jwt = commonService.getJwt();

        var today = new Date();
        var fDay = new Date(today.getFullYear(), today.getMonth(), 1);
        $scope.filter = {
            startDate: $filter('date')(fDay, 'shortDate'),
            endDate: $filter('date')(today, 'shortDate')
        };

        $scope.message = "";
        $scope.alertClass = "";
        $scope.distribution = [];

        subaccountService.subaccount().get({
                id: $stateParams.id,
                access_token: jwt.id
            })
            .$promise.then(
                function(response) {
                    $scope.subaccount = response;
                    subaccountService.subtransactions().query({
                            id: $stateParams.id,
                            access_token: jwt.id,
                            'filter[where][date][between][0]': $scope.filter.startDate,
                            'filter[where][date][between][1]': $scope.filter.endDate
                        })
                        .$promise.then(
                            function(response) {
                                $scope.transactions = response;
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

        $scope.filterTransactions = function() {
            if ($scope.filter.startDate && $scope.filter.endDate) {
                $rootScope.loaderMessage = "Searching transactions...";
                $('#loader').modal({ show: true, backdrop: 'static', keyboard: false });
                subaccountService.subtransactions().query({
                        id: $stateParams.id,
                        access_token: jwt.id,
                        'filter[where][date][between][0]': $scope.filter.startDate,
                        'filter[where][date][between][1]': $scope.filter.endDate
                    })
                    .$promise.then(
                        function(response) {
                            $scope.transactions = response;
                            $('#loader').modal('hide');
                        },
                        function(response) {
                            $scope.message = "Error: " + response.status + " " + response.statusText;
                            $scope.alertClass = "alert-danger";
                            $('#loader').modal('hide');
                        }
                    );
            }
        };
    }
])

;
