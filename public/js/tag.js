app.controller("TagController", [ '$http', '$route', '$scope', '$location', function($http, $route, $scope, $location) {
  this.hello="ello";
  this.tools=[];
  this.tags=[];
  this.id = $scope.$parent.ctrl.tag;
  console.log(this.id);
  $http({
    method:"GET",
    url:"http://localhost:3000/tags/"+this.id
  })
  .then((response) => {
    console.log(response.data);
    for (tool of response.data.tools) {
      this.tools.push(tool);
    }

    this.tags.push(response.data)
  })
  .catch((error) => {
    console.error(error);
  })
}]);
