angular.module('starter.services', [])

.factory('Favoritos', function(Data) {
    var favoritos = JSON.parse(LZString.decompress(window.localStorage['favoritos2']) || '[]');
    return {
        all: function() {

            angular.forEach(favoritos, function(value, key) {
                if (value != null)
                    value.eid = Data.achafav(value.id, value.startsAt);
            });
            console.log(favoritos);
            return favoritos;
        },
        add: function(id) {
            var fav = Data.evento(id);
            favoritos.push({
                id: fav.eventId,
                startsOn: fav.startsOn,
                startsAt: fav.startsAt,
                name: fav.name
            });
            window.localStorage['favoritos2'] = LZString.compress(JSON.stringify(favoritos));
            console.log(favoritos);
        },
        remove: function(favorito) {
            angular.forEach(favoritos, function(value, key) {
                if (value == favorito)
                    favoritos.splice(key, 1);
            });
            window.localStorage['favoritos2'] = LZString.compress(JSON.stringify(favoritos));
            return favoritos;
        }
    };
})


.factory('Data', function($http, $ionicLoading) {
    var locais = [];
    var eventos_mini = [];
    var eventos = [];

    return {
        load: function(callback) {
            $http.get('json/spaces.json').then(function(resp) {
                locais = resp.data;
                $http.get('json/events.json').then(function(resp) {
                    eventos = resp.data;

                    eventos_mini = [];
                    angular.forEach(eventos, function(value, key) {
                        eventos_mini.push({
                            defaultImageThumb: value.defaultImageThumb,
                            name: value.name,
                            shortDescription: value.shortDescription,
                            startsOn: value.startsOn,
                            startsAt: value.startsAt,
                            eventId: value.eventId,
                            id: key
                        });
                        eventos[key].id = key;
                    });

                    callback();
                });
            });

        },
        update:  function(ok, error){
            update(ok, error);
        },
        data_locais: function() {
            return locais;
        },
        data_eventos: function() {
            return eventos_mini;
        },
        data_eventos_local: function(localid) {
            var eventos_mini2 = [];
            angular.forEach(eventos, function(value, key) {
                if (localid == value.spaceId) {
                    eventos_mini2.push({
                        defaultImageThumb: value.defaultImageThumb,
                        name: value.name,
                        shortDescription: value.shortDescription,
                        startsOn: value.startsOn,
                        startsAt: value.startsAt,
                        eventId: value.eventId,
                        id: key
                    });
                }
            });
            return eventos_mini2;
        },
        evento: function(id) {
            var ev = [];
            angular.forEach(eventos, function(value, key) {
                if (value.id == id) {
                    ev = value;
                }
            });
            return ev;
        },
        achafav: function(eventId, startsAt) {
            var ev;
            angular.forEach(eventos, function(value, key) {
                if (value.eventId == eventId && value.startsAt == startsAt) {
                    ev = value.id;
                }
            });
            return ev;
        },
        local_position: function(id) {
            var ev = [];
            angular.forEach(locais, function(value, key) {
                if (value.id == id) {
                    ev = value;
                }
            });
            return ev;
        }
    };
});

