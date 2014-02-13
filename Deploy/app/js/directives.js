'use strict';

var module = angular.module('OmasDirectives', ['OmasServices']);

/* See http://jasonturim.wordpress.com/2013/09/01/angularjs-drag-and-drop */

module.directive('ooDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
    return {
        restrict: 'A',

        link: function(scope, el, attrs, controller) {
			angular.element(el).attr("draggable", "true");

			var id = angular.element(el).attr("id");
			if (!id) {
				id = uuid.new()
				angular.element(el).attr("id", id);
			}

            el.bind("dragstart", function(e) {
                e.dataTransfer.setData('text', id);
                $rootScope.$emit("OO-DRAG-START");
            });
            
            el.bind("dragend", function(e) {
                $rootScope.$emit("OO-DRAG-END");
            });
        }
	}
}]);

module.directive('ooDroppable', ['$rootScope', 'uuid', function($rootScope, uuid) {
    return {
        restrict: 'A',

        scope: {
            onDrop: '&'
        },

        link: function(scope, el, attrs, controller) {
			var id = angular.element(el).attr("id");
            if (!id) {
                id = uuid.new()
                angular.element(el).attr("id", id);
            }

	        function findDroppable(e) {
				var el = angular.element(e.target);
				if (!el.attr('oo-droppable')) {
					el = el.parent("[oo-droppable]");
				}
				return el;
	        }

			el.bind("dragover", function(e) {
				if (e.preventDefault) {
					e.preventDefault(); // Necessary. Allows us to drop.
				}

				e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
				return false;
			});

			el.bind("dragenter", function(e) {
				findDroppable(e).addClass('drag-over');
			});

			el.bind("dragleave", function(e) {
				findDroppable(e).removeClass('drag-over');
			});

			el.bind("drop", function(e) {
				if (e.preventDefault) {
					e.preventDefault();
				}

				if (e.stopPropogation) {
					e.stopPropogation();
				}
			
				findDroppable(e).removeClass('drag-over');

				var data = e.dataTransfer.getData("text");
				var src = document.getElementById(data);

				var dest = document.getElementById(id);

				scope.onDrop({dragEl: src, dropEl: dest});
			});

			$rootScope.$on("OO-DRAG-START", function() {
				var el = document.getElementById(id);
				//angular.element(el).addClass("drag-target");
			});

			$rootScope.$on("OO-DRAG-END", function() {
				var el = document.getElementById(id);
				//angular.element(el).removeClass("drag-target");
				//angular.element(el).removeClass("drag-over");
			});
        }
	}
}]);