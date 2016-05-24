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
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'angular-storage'
    ])

.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main',
            requiresLogin: true
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'login'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'SignupCtrl',
            controllerAs: 'signup'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'about'
        })
        .otherwise({
            redirectTo: '/'
        });
})

.run(function($rootScope, $http, store, $location, $route) {
    //store.remove('jwt');
    //$rootScope.serverURL = 'https://argentum-server.mybluemix.net/api/';
    $rootScope.serverURL = 'http://localhost:3000/api/';
    /*
    $rootScope.$on('$stateChangeStart', function(e, to) {
        if (to.data && to.data.requiresLogin) {
            //if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
            if (!store.get('jwt')) {
                e.preventDefault();
                $state.go('/login');
            }
        }
    });
*/
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.requiresLogin) {
            if (!store.get('jwt')) {
                //if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        }
    });
})

;
