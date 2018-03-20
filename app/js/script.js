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