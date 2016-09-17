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

    mainApp.controller("MainController", MainController);
}());

<div class="input-group input-group-xlg">
    <input type="text" required class="form-control input-xlg" placeholder="Address" ng-model="location">
    <span class="input-group-btn">
            <button class="btn btn-default btn-xlg" type="button" ng-click="campsiteSearch(location)"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>
    </span>
</div>
