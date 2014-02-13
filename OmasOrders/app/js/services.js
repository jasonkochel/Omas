'use strict';

/* Services */

var omasService = angular.module('OmasServices', []);

// todo replace with $resource; make generic

omasService.factory('CatalogService', function($http) {
	return {
		getAll: function() {
			return $http
				.get('/api/catalog')
				.then(function(result) {
					return result.data;
				});
		},

		save: function(obj) {
			return $http
				.put('/api/catalog/' + obj.CatalogID, obj)
				.error(function(result) {
					console.log(result);
				});
		},

		delete: function(obj) {
			return $http
				.delete('/api/catalog/' + obj.CatalogID)
				.error(function(result) {
					console.log(result);
				});
		},

		add: function(obj) {
			return $http
				.post('/api/catalog', obj)
				.error(function(result) {
					console.log(result);
				});
		}
	}
});

/* See http://jasonturim.wordpress.com/2013/09/01/angularjs-drag-and-drop */

omasService.factory('uuid', function() {
    return {
        new: function() {
            function _p8(s) {
                var p = (Math.random().toString(16)+"000000000").substr(2,8);
                return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        },
        
        empty: function() {
          return '00000000-0000-0000-0000-000000000000';
        }
    };
});