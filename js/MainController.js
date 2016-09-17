(function () {
    var app = angular.module("main", []);

    var MainController = function($scope) {
        $scope.campsiteSearch = function(location) {
            console.log(location);
            if (location != undefined) {
                document.location.href = "campsearch.html";
            }
        }

        $scope.message = "Campsite Search";
    };

    app.controller("MainController", MainController);
}());
