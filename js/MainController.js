(function () {
    var mainApp = angular.module("main", []);

    var MainController = function($scope) {
        $scope.campsiteSearch = function(location) {
            console.log(location);
            if (location != undefined) {
                document.location.href = "campsearch.html";
            }
        }

        $scope.message = "Campsite Search";
    };

    var NavController = function($scope) {
        $scope.navs = [
            {
                title: "Home",
                link: "home.html"
            }, {
                title: "Campsite Search",
                link: "campsearch.html"
            }, {
                title: "Popular Campsites",
                link: "popularcampsite.html"
            }, {
                title: "Guides",
                link: "guides.html"
            },
        ]
    }

    mainApp.controller("MainController", MainController);
    mainApp.controller("NavController", NavController);
}());
