app.controller('HomeController', [ '$http', '$route', '$scope', '$location', '$mdDialog', function($http, $route, $scope, $location, $mdDialog) {
  let CtrlUrl = $location.url();
  console.log('HomeController:', CtrlUrl);
  this.test = "hello"
  this.delayTooltip = 500;

  $http({
      method: 'GET',
      url: `${api}/languages`
    }).then(response => {
      console.log('allLangs:',response.data);
      this.langs = response.data;
      $scope.$parent.ctrl.langs = response.data
    }, error => {
      console.error(error.message);
  }).catch(err => console.error('Catch', err));

  this.select = (lang) => {
    $scope.$parent.ctrl.lang = lang
  }
}]);
