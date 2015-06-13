angular.module('starter.controllers', [])

.controller('InitCtrl', function($scope, $state) {
    $scope.local_f = function() {
        $state.go('tab.locais');
    };

})

.controller('EventoDetailCtrl', function($scope, $stateParams, Data, $ionicNavBarDelegate, Favoritos) {
    $scope.evento = Data.evento($stateParams.eventId);
    $scope.local = Data.local_position($scope.evento.spaceId);
    console.log($scope.local);

    // Temos que esperar para carregar
    setTimeout(function() {
        try {
            var mapOptions = {
                zoom: 17,
                center: new google.maps.LatLng($scope.local.location.latitude, $scope.local.location.longitude)
            }

            var mapa = new google.maps.Map(document.getElementById('map_canvas_z' + $scope.evento.id), mapOptions);

            var marker = new google.maps.Marker({
                map: mapa,
                position: mapOptions.center,
                title: $scope.local.name
            });

            $scope.navigator = navigator;
        } catch (err) {
            console.log(err);
        }
    }, 250);


    $scope.favoritoadd = function(id) {
        Favoritos.add(id);
    };

})

.controller('EventosCtrl', function($scope, $stateParams, Data) {
    $scope.totalDisplayed = 5;

    Data.update(function() {
        $scope.eventos = Data.data_eventos();
    });

    $scope.loadMore = function() {
        $scope.totalDisplayed += 5;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        //console.log(1); 
    };

    $scope.eventos = Data.data_eventos();
    $scope.Refresh = function() {
        Data.update(function() {
            $scope.eventos = Data.data_eventos();
            console.log($scope.eventos);
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });

})

.controller('LocalDetailCtrl', function($scope, $stateParams, Data, $filter, $ionicNavBarDelegate, $ionicHistory) {
    $scope.local = Data.local_position($stateParams.id);

    $scope.totalDisplayed = 5;

    Data.update(function() {
        $scope.eventos = Data.data_eventos_local($stateParams.id);
    });

    $scope.loadMore = function() {
        $scope.totalDisplayed += 5;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        //console.log(1); 
    };

    $scope.eventos = Data.data_eventos();

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });

    $ionicNavBarDelegate.showBackButton(true);

})

.controller('LocaisCtrl', function($scope, $stateParams, Data, $ionicHistory) {
    $scope.totalDisplayed = 5;

    $scope.loadMore = function() {
        $scope.totalDisplayed += 5;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.locais = Data.data_locais();

    console.log($scope.locais);


    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });


    $ionicHistory.nextViewOptions({
        historyRoot: false
    });

})

.controller('FavoritosCtrl', function($scope, $stateParams, Favoritos) {
    $scope.favoritos = Favoritos.all();
    $scope.remove = function(id) {
        $scope.favoritos = Favoritos.remove(id);
    };

})

.controller('MapaCtrl', function($scope, $stateParams, Data, $ionicNavBarDelegate, $state) {
    var locais = Data.data_locais();

    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(-23.550717, -46.633574)
    }

    var mapDiv = document.getElementById("map_canvas7");

    const GOOGLE = new plugin.google.maps.LatLng(-23.550717, -46.633574);
    var map = plugin.google.maps.Map.getMap(mapDiv, {
        'camera': {
            'latLng': GOOGLE,
            'zoom': 13
        }
    });

    map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
        angular.forEach(locais, function(value, key) {
            map.addMarker({
                'position': new plugin.google.maps.LatLng(value.location.latitude, value.location.longitude),
                'title': value.name,
                'disableAutoPan': false,
                'snippet': "Veja os eventos.",
                'markerClick': function(marker) {
                    marker.showInfoWindow();
                },
                'infoClick': function(marker) {
                    console.log(value.id);
                    $state.go('tab.local-detail', {
                        id: value.id
                    });
                }
            });
        });


    });

    $scope.openInfoWindow = function(e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }

})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});