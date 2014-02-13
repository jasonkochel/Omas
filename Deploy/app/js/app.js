'use strict';

// Declare app level module which depends on filters, and services
angular.module('Omas', [
    'ngRoute',
    'Omas.filters',
    'OmasServices',
    'OmasDirectives',
    'OmasControllers'
]);

jQuery.event.props.push('dataTransfer');
