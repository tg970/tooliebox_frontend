
const app = angular.module('toolieBox_app', ['ngRoute', 'ngMaterial']);

let user = {};
const updateUser = (data) => {
  user = data;
  user.logged = true;
  return
}

app.controller('BodyController', ['$http', '$scope', '$location', '$mdDialog', function($http, $scope, $location, $mdDialog) {
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

  function FormController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.submit = function(newInfo) {
      if (!$scope.newForm.$invalid) {
        $mdDialog.hide(newInfo);
      }
    };

    $scope.newInfo = {};
  };

  this.openLogin = (ev) => {
    $mdDialog.show({
      controller: FormController,
      templateUrl: 'partials/login.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
    })
    .then((newInfo) => {
      console.log('login request:', newInfo);
      $http({
          method: 'PUT',
          url: '/sessions/post',
          data: newInfo
        }).then(response => {
          console.log('login succesful:', response.data);
          updateUser(response.data);
          this.user = user;
          this.userName = response.data.username;
          this.error = null;
          this.loginError = null;
          $scope.$broadcast('updateAuth', { data: this.user })
        }, (error) => {
          console.log('login error:', error);
          this.openLogin(ev)
        }).catch(err => console.error('Catch', err))
    }, function() {
      console.log('cancel dialog');;
    });
  }

  this.openRegister = (ev) => {
    $mdDialog.show({
      controller: FormController,
      templateUrl: 'partials/register.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
    })
    .then((newInfo) => {
      console.log('register request:', newInfo);
      $http({
          method: 'PUT',
          url: '/users/post',
          data: newInfo
        }).then(response => {
          console.log('register succesful:', response.data);
          updateUser(response.data);
          this.user = user;
          this.userName = response.data.username;
          this.error = null;
          $scope.$broadcast('updateAuth', { data: this.user })
        }, (error) => {
          console.log('login error:', error);
          this.openRegister(ev)
        }).catch(err => console.error('Catch', err))
    }, function() {
      console.log('cancel dialog');;
    });
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

  $routeProvider.when('/toolie', {
    templateUrl: 'partials/oneTool.html',
    controller: 'ToolController as ctrl',
    controllerAs: 'ctrl'
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('blue')
    .warnPalette('blue');

}]);
