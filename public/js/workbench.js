app.controller('WorkBenchController', [ '$http', '$route', '$scope', '$location', function($http, $route, $scope, $location) {
  console.log('WorkbenchController');
  this.selectLang = $scope.$parent.ctrl.langs
  this.repl = true

  $http({
      method: 'GET',
      url: `http://localhost:3000/users/${user.id}`,
      headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) }
    }).then(response => {
      console.log('User GET Response:', response.data);
      // $scope.$parent.ctrl.tool = response.data.id
      // $location.path('/toolie')
    }, error => {
      console.error(error.message);
  }).catch(err => console.error('Catch', err));

  this.submit = (newInfo) => {
    newInfo.user_id = user.id
    console.log('submit create form:', newInfo);
    $http({
        method: 'POST',
        url: `http://localhost:3000/languages/${newInfo.language}/tools`,
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

}]);
