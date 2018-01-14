app.controller('LangController', [ '$http', '$route', '$scope', '$location', function($http, $route, $scope, $location) {
  this.id = $scope.$parent.ctrl.lang.id
  this.searchterm = "";
  $http({
      method: 'GET',
      url: `http://localhost:3000/languages/${this.id}`
    }).then(response => {
      console.log('oneLang:',response.data);
      this.lang = response.data;
      this.tools = response.data.tools
      this.numTools = this.tools.length
    }, error => {
      console.error(error.message);
  }).catch(err => console.error('Catch', err));

  this.select = (id) => {
    $scope.$parent.ctrl.tool = id
    $scope.$parent.ctrl.lang = this.lang
  }

}]);
