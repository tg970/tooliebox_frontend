app.controller('ToolController', [ '$http', '$route', '$scope', '$location', '$mdDialog', function($http, $route, $scope, $location, $mdDialog) {
  this.lang = $scope.$parent.ctrl.lang
  this.id = $scope.$parent.ctrl.tool
  $http({
    method: 'GET',
    url: `http://localhost:3000/languages/${this.lang}/tools/${this.id}`
  }).then(response => {
    console.log('oneTool:',response.data);
    this.tool = response.data.tools
  }, error => {
    console.error(error.message);
  }).catch(err => console.error('Catch', err));

  
}]);
