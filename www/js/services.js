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


.factory('Data', function($http, $ionicLoading, $cordovaFile, $ionicPlatform, $cordovaFileTransfer) {
    var locais = [];
    var eventos_mini = [];
    var eventos = [];
    update = function(ok, error){
        this.download('spaces.json', function(){
            this.download('events.json', function(){
                $cordovaFile.copyFile(window.cordova.file.dataDirectory , 'tmp_spaces.json', window.cordova.file.dataDirectory , 'spaces.json')
                .then(function (success) {
                    $cordovaFile.copyFile(window.cordova.file.dataDirectory  , 'tmp_events.json', window.cordova.file.dataDirectory , 'events.json')
                    .then(function (success) {
                        ok();
                    }, error);
                }, error);
            }, error);               
        }, error);
    };
    download = function(file, ok, error){
        var url = "http://viradacultural.prefeitura.sp.gov.br/2015/wp-content/themes/viradacultural-2015/app/"+file;
        var targetPath = window.cordova.file.dataDirectory + "tmp_" + file;
        var trustHosts = true;
        var options = {};

        $ionicLoading.show({
            template: 'Atualizando a programação.',
            noBackdrop: true
        });

        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
          .then(function(result) {
            console.log(result);
            ok();
          }, function(err) {
                $ionicLoading.show({
                    template: 'Verifique a sua internet.',
                    duration: 1200,
                    noBackdrop: true
                });
                console.log(err);
                if(typeof error !== 'undefined') error(err);
          }, function (progress) {
        }); 
    };

    return {
        load: function(okD, errorD) {
            $ionicPlatform.ready(function() {
                function leitura(ok, error){
                    $cordovaFile.readAsText(window.cordova.file.dataDirectory, 'spaces.json')
                    .then(function (success_locais) {
                        $cordovaFile.readAsText(window.cordova.file.dataDirectory, 'events.json')
                        .then(function (success_eventos) {
                            locais = JSON.parse(success_locais);
                            eventos = JSON.parse(success_eventos);

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
                            $ionicLoading.hide();

                            // Atualiza o app em back.
                            //update(function(){},function(){});
                            okD();

                        }, errorD);
                    }, errorD);
                }

                update(function(ok, error){
                    leitura();
                }, function(){
                    $ionicLoading.show({
                        template: 'Verifique a sua internet.',
                        duration: 2000,
                        noBackdrop: true
                    });
                    leitura();
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

