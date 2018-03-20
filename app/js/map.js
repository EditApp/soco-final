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
