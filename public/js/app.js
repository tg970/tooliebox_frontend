
const app = angular.module('toolieBox_app', ['ngRoute', 'ngMaterial', 'ui']);

let user = {};
const api = 'https://tooliebox-api.herokuapp.com'
//https://tooliebox-api.herokuapp.com

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

function DeleteController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.submit = function() {
    $mdDialog.hide();
  };
};

app.controller('BodyController', ['$http', '$scope', '$location', '$mdDialog', function($http, $scope, $location, $mdDialog) {
  // User States:
  this.user = user;
  this.lang = {};
  this.tool = {};
  this.message = null;
  if (user.logged) {
    this.userName = this.user.username;
  }

  // Logout
  this.logout = () => {
    console.log('logout');
    localStorage.clear('token');
    location.reload();
  }

  this.openLogin = (ev) => {
    $mdDialog.show({
      controller: FormController,
      templateUrl: 'partials/login.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
    })
    .then((newInfo) => {
      $http({
          method: 'POST',
          url: `${api}/users/login`,
          data: { user: newInfo }
        }).then(response => {
          console.log('response:', response.data);
          if (response.data.status == 200) {
            console.log('succesful login');
            localStorage.setItem('token', JSON.stringify(response.data.token));
            user = response.data.user
            user.tools = response.data.tools
            user.toolBelts = response.data.toolbelts
            user.arrTool = []
            for (let tool of user.tools) {
              user.arrTool.push(tool.id)
            }
            user.logged = true
            console.log(user);
            this.user = user;
            this.error = false;
            $scope.$broadcast('updateAuth', { data: this.user })
          } else {
            this.error = true;
            this.message = response.data.message
            console.log(this);
            console.log($scope);
            console.log(response.data.message);
            return this.openLogin(ev)
          }
        }).catch((error) => {
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
          method: 'POST',
          url: `${api}/users`,
          data: { user: newInfo }
        }).then(response => {
          console.log('register succesful:', response.data);
          return this.openLogin(ev)
        }, (error) => {
          console.log('login error:', error);
          this.openRegister(ev)
        }).catch(err => console.error('Catch', err))
    }, function() {
      console.log('cancel dialog');;
    });
  }

  // this.add = () => {
  //   let newInfo = {}
  //   newInfo.name = 'Angular'
  //   newInfo.img_url = '/img/svg/angular.svg'
  //   newInfo.dox_url = 'https://angularjs.org/'
  //   $http({
  //       method: 'POST',
  //       url: `${api}/languages`,
  //       data: newInfo
  //     }).then(response => {
  //       console.log('response:', response);
  //     }, (error) => {
  //       console.log('error:', error);
  //     }).catch(err => console.error('Catch', err))
  // }

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

  $routeProvider.when('/toolie/create', {
    templateUrl: 'partials/createTool.html',
    controller: 'WorkBenchController as ctrl',
    controllerAs: 'ctrl'
  });

  $routeProvider.when('/toolie/edit', {
    templateUrl: 'partials/editTool.html',
    controller: 'WorkBenchController as ctrl',
    controllerAs: 'ctrl'
  });

  $routeProvider.when('/workbench', {
    templateUrl: 'partials/workbench.html',
    controller: 'WorkBenchController as ctrl',
    controllerAs: 'ctrl'
  });

  $routeProvider.when('/tag', {
    templateUrl: 'partials/tag.html',
    controller: 'TagController as ctrl',
    controllerAs: 'ctrl'
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange')
    .warnPalette('red');

}]);
