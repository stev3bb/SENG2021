(function () {
    var app = angular.module("main", []);

    var MainController = function($scope) {
        $scope.message = "Campsite Search";
    };

    app.controller("MainController", MainController);
}());
