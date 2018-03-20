(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("js/charts.js", function(exports, require, module) {
'use strict';

var $ = require('jquery');
var Chart = require('chart.js');

var ctx = document.getElementById('chart1').getContext('2d');
ctx.height = 180;
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    },

    // Configuration options go here
    options: {
        maintainAspectRatio: false,
    }
});
});

require.register("js/map.js", function(exports, require, module) {
'use strict';

var $ = require('jquery');
require('js-info-bubble');

var Map = {
    map: null,
    markers: [],
    bounds: null
};

// Injection du code html de la map après le chargement du fichier JS
Map.init = function () {
    var s = document.createElement("script");
    s.type = "text/javascript";

    // Après le chargement de la map la fonction "window.initMap" sera executer
    s.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAzoU2yKc6Wuh4F-P6I6WQ4204SgEyJVZM&callback=initMap";
    $("head").append(s);
};

// Ajout du marqueur dans la map
Map.setMarker = function ({ icon, position, title, content, index, type }) {

    // Ajout du marqueur sur la map
    let marker = new google.maps.Marker({
        position,
        icon,
        map: this.map,
        title,
        infowindow: new window.InfoBubble({
            content,
            shadowStyle: 0,
            padding: 0,
            backgroundColor: 'transparent',
            borderRadius: 0,
            arrowSize: 0,
            borderWidth: 0,
            borderColor: '#cccccc',
            disableAutoPan: false,
            hideCloseButton: true,
            arrowPosition: 50,
            arrowStyle: 0,
            maxWidth: 268,
            maxHeight: 198,
            minWidth: 268,
            minHeight: 198
        }),
        // On lui affect un index qui servera de connexion 
        // avec le map module en DOM
        index,
        type
    });

    marker.addListener('click', function () {
        // Affichage du marqueur séléctionné
        Map.selectMarker(this);
    });

    this.markers.push(marker);

    // Changement de l'affichage de la map pour afficher tout les
    // marqueur ajouter
    this.bounds.extend(position);
    this.map.fitBounds(this.bounds);
};

Map.selectMarker = function (marker) {
    // Avant d'afficher le marqueur il faut tout d'abord désactiver
    // les marqueur afficher
    this.resetSelectedMarkers();

    // Changement de la couleur du marqueur
    // TODO: utiliser la fonction getIcon(image)
    marker.setIcon(this.icons.skyblue);

    // Affichage de l'info window
    marker.infowindow.open(this.map, marker);

    setTimeout(function() {
        $('.map-infowindow .close').on('click', function (e) {
            Map.resetSelectedMarkers();
            Map.resetSelectedModules();
        });
    },200);

    // On séléctionne le module associé
    this.selectModule(marker.index);
};

Map.highlightMarker = function (marker) {
    // change la couleur de l'icon en bleu claire
    marker.setIcon(this.icons.skyblue);
};

Map.unHighlightMarkers = function () {
    // On remet les marqueur bleu sauf pour celle sélétionnée
    for (let marker of this.markers) {
        if (marker.infowindow.isOpen()) {
            marker.setIcon(this.icons.skyblue);
        } else {
            marker.setIcon(this.icons.blue);
        }
    }
};

Map.resetSelectedMarkers = function () {
    // Fermeture des info window pour tout les marqueur
    this.markers.forEach(function (marker) {
        marker.infowindow.close(map, marker);
        marker.setIcon(this.icons.blue);
    }, this);
};


Map.selectModule = function (index) {
    
    this.resetSelectedModules();

    let $mapModules = $('.map-modules');
    let $mapModule = $('.map-module[data-index="' + index + '"]');

    // On active le module souhaité
    $mapModule.addClass('active');

    // Scroll vers le module
    $mapModules.scrollTop(
        $mapModules.scrollTop() +
        $mapModule.position().top
    );
};

// Rendre tout les marqueurs déjà séléctionnées 
// dans leur etat initial
Map.resetSelectedModules = function () {
    $('.map-module').removeClass('active');
};

Map.init();

window.initMap = function () {
    // Initialisation des icons
    Map.icons = {
        blue: {
            url: '/images/icons/marker-blue.svg',
            scaledSize: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0)
        }, // anchor'/images/icons/marker-blue.svg',
        skyblue: {
            url: '/images/icons/marker-skyblue.svg',
            scaledSize: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0)

        }
    };

    let paris = {
        lat: 48.858,
        lng: 2.325
    };

    // Initialisation de la map
    Map.map = new google.maps.Map(document.getElementById('map'), {
        center: paris,
        zoom: 12,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        styles: [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f5f5f5"
                }
              ]
            },
            {
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#f5f5f5"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#bdbdbd"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#eeeeee"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e5e5e5"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dadada"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e5e5e5"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#eeeeee"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#c9c9c9"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#2d6cb2"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            }
          ]
    });

    // Initialisation des limites
    Map.bounds = new google.maps.LatLngBounds();


    $('.map-module').each(function (index) {
        let position = {
            lat: parseFloat($(this).attr('data-lat')),
            lng: parseFloat($(this).attr('data-lng'))
        };
        let title = $('.title', this).text();

        let content = '<div class="module map-infowindow" data-index="' + index + '">' +
                '<span class="close"></span>' +
            $(this).html() +
            '</div>';

        let icon = Map.icons.blue;

        let type = null;

        if ($('.type', this).length) {
            type = $('.type', this).attr('class')
                                        .split(' ')
                                        .find(function (className) {
                                            return className && className != 'type' 
                                        });
            $(this).attr('data-type', type);
        }

        $(this).attr('data-index', index)

        // Pour chaque module on crée un marqueur
        Map.setMarker({ icon, position, title, content, index, type });

        // Gérer l'effet de hover sur les modules
        $(this).mouseenter(function () {
            $(this).addClass('hover');
            let index = parseInt($(this).attr('data-index'));
            // Trouvé le marqueur lié au module séléctionné
            let markers = Map.markers.filter(function (item) {
                return item.index === index;
            });
            if (markers) {
                Map.highlightMarker(markers[0])
            }
        })
        .mouseleave(function () {
            $(this).removeClass('hover');
            Map.unHighlightMarkers();
        }).click(function () {
            let markers = Map.markers.filter(function (item) {
                return item.index === index;
            });
            if (markers) {
                Map.selectMarker(markers[0])
            }
        });
    });

    $('.type-changer').on('change', function () {
        switch ($(this).val()) {
            case 'devis':
            case 'rdv':
            case 'commande':
                let type = $(this).val();

                $('.map-module').hide();
                $('.map-module[data-type=' + type + ']').show();

                Map.resetSelectedMarkers();

                Map.markers.forEach(function (marker) {
                    if (marker.type && marker.type !== type) {
                        marker.setMap(null);
                    } else {
                        marker.setMap(Map.map);
                    }
                });
                break;
            default:
                $('.map-module').show();
                Map.markers.forEach(function (marker) {
                    marker.setMap(Map.map);
                });
        }
    });
};

});

require.register("js/script.js", function(exports, require, module) {
'use strict';

var $ = require('jquery');

var colorify = function () {

};

/////js a optimiser 
$('.bloc-strawberry button.add').click(function () {
    var colorReference = $(this).parent('div').attr('class').substr(5);
    $('.modal-body').removeClass('turquois orange blue purple').addClass(colorReference);
    $('.modal-body .custom-select').removeClass('turquois orange blue purple').addClass(colorReference);
});
$('.bloc-turquois button.add').click(function () {
    var colorReference = $(this).parent('div').attr('class').substr(5);
    $('.modal-body').removeClass('strawberry orange blue purple').addClass(colorReference);
    $('.modal-body .custom-select').removeClass('strawberry orange blue purple').addClass(colorReference);
});
$('.bloc-orange button.add').click(function () {
    var colorReference = $(this).parent('div').attr('class').substr(5);
    $('.modal-body').removeClass('strawberry turquois blue purple').addClass(colorReference);
    $('.modal-body .custom-select').removeClass('strawberry turquois blue purple').addClass(colorReference);
});
$('.bloc-blue button.add').click(function () {
    var colorReference = $(this).parent('div').attr('class').substr(5);
    $('.modal-body').removeClass('strawberry turquois orange purple').addClass(colorReference);
    $('.modal-body .custom-select').removeClass('strawberry turquois orange purple').addClass(colorReference);
});
$('.bloc-purple button.add').click(function () {
    var colorReference = $(this).parent('div').attr('class').substr(5);
    $('.modal-body').removeClass('strawberry turquois orange blue').addClass(colorReference);
    $('.modal-body .custom-select').removeClass('strawberry turquois orange blue').addClass(colorReference);
});

$(document).on('click', '.close', function () {
    $('select').click(function (event) {
        event.stopPropagation();
    });
});

//criteres


$('.criteria button.chevron').click(function (event) {
    event.preventDefault();

    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $('.criteria-toggle').addClass('hidden');

    } else {
        $(this).addClass('active');
        $('.criteria-toggle').removeClass('hidden');
    }

});

//sous criteres
$('.custom-list-checkbox-select').click(function () {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).siblings().addClass('hidden');
    } else {
        $(this).addClass('active');
        $(this).siblings().removeClass('hidden');
    }

});
//map

$('button.line-view-push').click(function () {
    if ($('.map-modules').hasClass('line-view')) {
    } else {
        $('.map-modules').removeClass('grid-view');
        $('.map-modules').addClass('line-view');
    }
});

$('button.grid-view-push').click(function () {
    if ($('.map-modules').hasClass('grid-view')) {
    } else {
        $('.map-modules').removeClass('line-view');
        $('.map-modules').addClass('grid-view');
    }
});
});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map