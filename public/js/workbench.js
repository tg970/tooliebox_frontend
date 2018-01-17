app.controller('WorkBenchController', [ '$http', '$route', '$scope', '$location', function($http, $route, $scope, $location) {
  let CtrlUrl = $location.url();
  console.log('WorkBenchController:', CtrlUrl);
  this.selectLang = $scope.$parent.ctrl.langs;
  this.repl = null;

  if (CtrlUrl == '/toolie/edit') {
    $scope.newInfo = angular.copy($scope.$parent.ctrl.tool)
    let arr = ['comments', 'created_at', 'tags', 'updated_at']
    arr.forEach(i => delete $scope.newInfo[i])
    if ($scope.newInfo.repl_url) {
      this.repl = true
      $scope.newInfo.repl = "true"
    }
    console.log('newInfo:', $scope.newInfo);
  };

  if (CtrlUrl == 'workbench') {
    this.repl = true
    $http({
        method: 'GET',
        url: `${api}/users/${user.id}`,
        headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) }
      }).then(response => {
        console.log('User GET Response:', response.data);
        this.tools = response.data.tools
        console.log(this.tools);
      }, error => {
        console.error(error.message);
    }).catch(err => console.error('Catch', err));
  }

  this.submit = (newInfo) => {
    newInfo.user_id = user.id
    console.log('submit create form:', newInfo);
    $http({
        method: 'POST',
        url: `${api}/languages/${newInfo.language}/tools`,
        data: newInfo
      }).then(response => {
        console.log('Post New Tool Response:',response.data);
        // $scope.$parent.ctrl.tool = response.data.id
        // $location.path('/toolie')
      }, error => {
        console.error(error.message);
    }).catch(err => console.error('Catch', err));
  };

  this.toggleRepl = () => {
    this.repl = !this.repl
    delete $scope.newInfo.repl_url
    delete $scope.newInfo.link_url
  }

  this.submitEdit = (newInfo) => {
    newInfo.user_id = user.id
    console.log('submit create form:', newInfo);
    $http({
        method: 'PUT',
        url: `${api}/tools/${newInfo.id}`,
        data: newInfo
      }).then(response => {
        console.log('Post New Tool Response:',response.data);
        $scope.$parent.ctrl.tool = response.data
        $location.path('/toolie')
      }, error => {
        console.error(error.message);
    }).catch(err => console.error('Catch', err));
  };

  this.deleteTool = () => {
    console.log('deleteTool:', $scope.$parent.ctrl.tool);
    $http({
        method: 'DELETE',
        url: `${api}/tools/${$scope.$parent.ctrl.tool.id}`
      }).then(response => {
        console.log('Delete Response:', response);
        $location.path('/')
      }, error => {
        console.error(error.message);
    }).catch(err => console.error('Catch', err));
  };

}]);
