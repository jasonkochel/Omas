'use strict';

/* Controllers */

var omasControllers = angular.module('OmasControllers', []);

omasControllers.controller('CatalogController', ['$scope', 'CatalogService',
    function ($scope, CatalogService) {
        CatalogService
            .getAll()
            .then(function(data) { 
                $scope.items = data; 
            });

        $scope.select = function(catalogId) {
            var idx = $scope.idxFromCatalogId(catalogId);

            $scope.selIndex = idx;
            $scope.selMode = "Edit";
            $scope.selected = angular.copy($scope.items[idx]);
        }

        $scope.prepareAdd = function(catalogId) {
            var idx = $scope.idxFromCatalogId(catalogId);

            $scope.selIndex = idx;      // this will be the index to add the new one after
            $scope.selMode = "Add";
            $scope.selected = {
                BatchID: $scope.items[idx].BatchID,
                Multiplier: 1.0,
                Sequence: ($scope.items[idx].Sequence + $scope.items[idx + 1].Sequence) / 2
            };
        }

        $scope.add = function() {
            CatalogService
                .add($scope.selected)
                .then(function(data) {
                    $scope.selected.CatalogID = data.data.CatalogID;
                    $scope.items.splice($scope.selIndex + 1, 0, $scope.selected);
                });
        }

        $scope.save = function() {
            CatalogService
                .save($scope.selected)
                .then(function(data) {
                    $scope.items[$scope.selIndex] = $scope.selected;
                });
        }

        $scope.delete = function() {
            CatalogService
                .delete($scope.selected)
                .then(function(data) {
                    $scope.items.splice($scope.selIndex,1);
                });
        }

        $scope.resequence = function(dragEl, dropEl) {
            var drag = angular.element(dragEl);
            var drop = angular.element(dropEl);
            
            var next = drop.next(".catalog-row");
            var nextSequence;

            if (next && next.length > 0) {
                nextSequence = next.scope().item.Sequence;
                console.log("The element " + drag.scope().item.Sequence + 
                            " has been dropped between " + drop.scope().item.Sequence +
                            " and " + nextSequence);
            }
            else {
                nextSequence = drop.scope().item.Sequence + 1;
                console.log("The element " + drag.scope().item.Sequence + 
                            " has been dropped at the end of the list after " +
                            drop.scope().item.Sequence);
            }
 

            var dragModel = drag.scope().item;

            dragModel.Sequence = (drop.scope().item.Sequence + nextSequence) / 2.0;
            console.log("New sequence = " + dragModel.Sequence);

            CatalogService.save(dragModel);
        }

        $scope.idxFromCatalogId = function(catalogId) {
            for (var i = 0; i < $scope.items.length; i++) {
                if ($scope.items[i].CatalogID === catalogId) {
                    return i;
                }
            }
            return -1;
        }
    }
]);
