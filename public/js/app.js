
const app = angular.module('toolieBox_app', ['ngRoute', 'ngMaterial']);

let user = {};
const updateUser = (data) => {
  user = data;
  user.logged = true;
  return
}

app.controller('BodyController', ['$http', '$scope', '$location', function($http, $scope, $location) {
  // User States:
  this.lang = null
  this.hello = 'test test test'
  this.user = user;
  this.showLogin = false;
  if (user.logged) {
    this.userName = this.user.username;
  }

  // Check Server for Session
  // $http({
  //     method: 'get',
  //     url: '/sessions',
  //   }).then(response => {
  //     //console.log('sessionReq:', response.data.user);
  //     if (response.data.user) {
  //       user = response.data.user;
  //       user.logged = true;
  //       this.user = user
  //       this.userName = user.username
  //     }
  //     console.log('userInfo:', user);
  //   }, error => {
  //     console.log('error:', error);
  //   }).catch(err => console.error('Catch:', err))

  // Register
  this.registerUser = () => {
    //console.log('register: ', this.newUserForm);
    $http({
      url: '/users',
      method: 'post',
      data: this.newUserForm
    }).then(response => {
      updateUser(response.data);
      this.user = user;
      this.userName = response.data.username;
      this.newUserForm = {};
      this.error = null;
      this.showLogin = false;
      $scope.$broadcast('updateAuth', { data: this.user })
    }, ex => {
      console.log(ex.data.err, ex.statusText);
      this.registerError = 'Hmm, maybe try a different username...';
   })
   .catch(err => this.registerError = 'Something went wrong' );
   };

  // Login
  this.loginUser = () => {
    $http({
      url: '/sessions/login',
      method: 'post',
      data: this.loginForm
    }).then(response =>  {
      updateUser(response.data);
      this.user = user;
      this.userName = response.data.username;
      this.loginForm = {};
      this.error = null;
      this.showLogin = false;
      this.loginError = null;
      $scope.$broadcast('updateAuth', { data: this.user })
    }, ex => {
       this.loginError = `Hmm, we can't find a match...`;
    })
    .catch(err => this.loginError = `Hmm, we can't find a match...` );
  };

  // Logout
  this.logout = () => {
    $http({ url: '/sessions/logout', method: 'delete' })
    .then((response) => {
       user = {};
       this.user = null;
       this.userName = null;
       $scope.$broadcast('logout', { data: this.user })
       $location.path('/');
    }, ex => {
       console.log('ex', ex.data.err);
       this.loginError = ex.statusText;
    })
    .catch(err => this.loginError = 'Something went wrong' );
  }

  this.openLogin = () => {
    this.showLogin = true;
  }

  this.closeLogin = () => {
    this.showLogin = false;
  }

}]);

app.config(['$routeProvider','$locationProvider', '$mdThemingProvider', function($routeProvider,$locationProvider, $mdThemingProvider) {
  // Enables Push State
  $locationProvider.html5Mode({ enabled: true });

  $routeProvider.when('/', {
    templateUrl: 'partials/home.html',
    controller: 'HomeController as ctrl',
    controllerAs: 'ctrl'
  });

  $routeProvider.when('/language', {
    templateUrl: 'partials/oneLang.html',
    controller: 'LangController as ctrl',
    controllerAs: 'ctrl'
  });

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
