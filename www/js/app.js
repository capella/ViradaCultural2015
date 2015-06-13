// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionicLazyLoad'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: "/tab",
        abstract: true,
        controller: "InitCtrl",
        templateUrl: "templates/tabs.html"
    })

    .state('tab.eventos', {
        url: '/eventos',
        views: {
            'tab-eventos': {
                templateUrl: 'templates/tab-eventos.html',
                controller: 'EventosCtrl'
            }
        }
    })

    .state('tab.evento-detail', {
        url: '/eventos/:eventId',
        views: {
            'tab-eventos': {
                templateUrl: 'templates/evento-detail.html',
                controller: 'EventoDetailCtrl'
            }
        }
    })

    .state('tab.evento-detail2', {
        url: '/eventos2/:eventId',
        views: {
            'tab-locais': {
                templateUrl: 'templates/evento-detail.html',
                controller: 'EventoDetailCtrl'
            }
        }
    })

    .state('tab.locais', {
        url: '/locais',
        views: {
            'tab-locais': {
                templateUrl: 'templates/tab-locais.html',
                controller: 'LocaisCtrl'
            }
        }
    })

    .state('tab.local-detail', {
        url: '/locais/:id',
        views: {
            'tab-locais': {
                templateUrl: 'templates/local-detail.html',
                controller: 'LocalDetailCtrl'
            }
        }
    })

    .state('tab.mapa', {
        url: '/mapa',
        views: {
            'tab-mapa': {
                templateUrl: 'templates/mapa.html',
                controller: 'MapaCtrl'
            }
        }
    })


    .state('tab.favoritos', {
        url: '/favoritos',
        views: {
            'tab-favoritos': {
                templateUrl: 'templates/tab-favoritos.html',
                controller: 'FavoritosCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/eventos');

    // Manter a mesma aparencia para qualquer dispositivo
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.tabs.style("standard");
    $ionicConfigProvider.navBar.alignTitle("center");

});