angular.
    module('googleMap').
    component('googleMap', {
        templateUrl: 'js/google-map/google-map.template.html',
        controller: function NavController() {
            this.navs = [
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
                    title: "Equipment",
                    link: "equipment.html"
                }, {
                    title: "Guides",
                    link: "guides.html"
                }
            ];
        }
    });
