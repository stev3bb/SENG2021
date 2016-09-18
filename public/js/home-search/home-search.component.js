angular.
    module('homeSearch').
    component('homeSearch', {
        templateUrl: 'js/home-search/home-search.template.html',
        controller: function HomeSearchController() {
            this.campsiteSearch = function() {
                if (this.location != undefined) {
                    document.location.href = '/campsearch?location=' + this.location;
                }
            };
        }
    });
