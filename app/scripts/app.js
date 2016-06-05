'use strict';

/**
 * @ngdoc overview
 * @name argentumWebApp
 * @description
 * # argentumWebApp
 *
 * Main module of the application.
 */
angular
    .module('argentumWebApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute', // TODO delete?
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'angular-storage'
    ])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider

    // route for the home page
        .state('app', {
        url: '/',
        views: {
            'content': {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            }
        },
        requiresLogin: true
    })

    // route for the login page
    .state('app.login', {
        url: 'login',
        views: {
            'content@': {
                templateUrl: 'views/login.html',
                controller: 'AuthCtrl',
            }
        }
    })

    // route for the signup page
    .state('app.signup', {
        url: 'signup',
        views: {
            'content@': {
                templateUrl: 'views/signup.html',
                controller: 'SignupCtrl',
            }
        }
    })

    // route for the account page
    .state('app.account', {
        url: 'account/:id',
        views: {
            'content@': {
                templateUrl: 'views/account.html',
                controller: 'AccountCtrl',
            }
        },
        requiresLogin: true
    });

    $urlRouterProvider.otherwise('/');

    //$locationProvider.html5Mode(true);
})

.run(function($rootScope, store, $state) {
    //store.remove('jwt');
    $rootScope.serverURL = 'https://argentum-server.mybluemix.net/api';
    //$rootScope.serverURL = 'http://localhost:3000/api';


    //$('#loader').on('show.bs.modal', function(e) {
        //$('#loader').modal({ backdrop: 'static', keyboard: false });
    //});

    $rootScope.$on('$stateChangeStart', function(e, to) {
        if (to.requiresLogin) {
            //if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
            if (!store.get('jwt')) {
                e.preventDefault();
                $state.go('app.login');
            }
        }
    });
})

;
