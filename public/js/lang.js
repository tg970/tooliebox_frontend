app.controller('LangController', [ '$http', '$route', '$scope', '$location', '$mdDialog', function($http, $route, $scope, $location, $mdDialog) {
  this.id = $scope.$parent.ctrl.lang
  $http({
    method: 'GET',
    url: `http://localhost:3000/languages/${this.id}`
  }).then(response => {
    console.log('oneLang:',response.data);
    this.lang = response.data;
    this.tools = response.data.tools
  }, error => {
    console.error(error.message);
  }).catch(err => console.error('Catch', err));

}]);
