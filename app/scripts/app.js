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
            controllerAs: 'main'
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

.run(function($rootScope) {
    $rootScope.serverURL = 'https://argentum-server.mybluemix.net/api/';
})

;
