app.filter('trustUrl', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);

app.controller('ToolController', ['$http', '$scope', '$mdDialog', function($http, $scope, $mdDialog) {
  this.tool = {};
  this.lang = $scope.$parent.ctrl.lang;
  this.id = $scope.$parent.ctrl.tool;

  $http({
    method: 'GET',
    url: `http://localhost:3000/languages/${this.lang}/tools/${this.id}`
  }).then(response => {
    console.log('oneTool:',response.data);
    this.temp = response.data;
    this.temp.repl_url += "?lite=true";
    this.tool = this.temp;
  }, error => {
    console.error(error.message);
  }).catch(err => console.error('Catch', err));


}]);
