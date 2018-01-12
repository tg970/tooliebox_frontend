console.log('yep');
const app = angular.module('toolieBox_app', ['ngRoute', 'ngMaterial']);

app.controller('MainController', [
  '$http', '$route', '$scope', '$location', '$mdDialog',
  function($http, $route, $scope, $location, $mdDialog) {
    let CtrlUrl = $location.url();
    console.log('MainController:', CtrlUrl);
    this.test = "hello"
}]);

app.config(['$routeProvider','$locationProvider', '$mdThemingProvider', function($routeProvider,$locationProvider, $mdThemingProvider) {
  // Enables Push State
  $locationProvider.html5Mode({ enabled: true });

  $routeProvider.when('/', {
    templateUrl: 'partials/home.html',
    controller: 'MainController as ctrl',
    controllerAs: 'ctrl'
  });

  // $routeProvider.when('/viewSystems', {
  //   templateUrl: 'partials/system.html',
  //   controller: 'SystemController as ctrl',
  //   controllerAs: 'ctrl'
  // });

  $routeProvider.when('/about', {
    templateUrl: 'partials/about.html',
  });

  // $routeProvider.when('/instructions', {
  //   templateUrl: 'partials/instructions.html',
  //   controller: 'MainController as ctrl',
  //   controllerAs: 'ctrl'
  // });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('blue')
    .warnPalette('blue');

}]);
