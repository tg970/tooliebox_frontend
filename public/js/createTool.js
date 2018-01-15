app.controller('CreateController', [ '$http', '$route', '$scope', '$location', function($http, $route, $scope, $location) {
  console.log('CreateController');
  this.selectLang = $scope.$parent.ctrl.langs

  this.submit = (newInfo) => {
    console.log('submit create form:', newInfo);
    $http({
        method: 'POST',
        url: `http://localhost:3000/languages/${newInfo.language}/tools`,
        data: newInfo
      }).then(response => {
        console.log('Post New Tool Response:',response.data);
        $scope.$parent.ctrl.tool = response.data.id
        $location.path('/toolie')
      }, error => {
        console.error(error.message);
    }).catch(err => console.error('Catch', err));
  };

}]);
