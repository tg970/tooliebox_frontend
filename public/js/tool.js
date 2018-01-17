app.filter('trustUrl', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);

app.controller('ToolController', ['$http', '$scope', '$location', function($http, $scope, $location) {
  let CtrlUrl = $location.url();
  console.log('ToolController:', CtrlUrl);
  this.user = user;
  console.log('this.user:', this.user);
  this.tool = {};
  this.comments = [];
  this.lang = $scope.$parent.ctrl.lang;
  this.tool = $scope.$parent.ctrl.tool;
  this.id = $scope.$parent.ctrl.tool.id;
  this.getTool = () => {
    $http({
      method: 'GET',
      url: `${api}/languages/${this.lang.id}/tools/${this.id}`
    }).then(response => {
      console.log('oneTool:',response.data);
      this.temp = response.data;
      if (this.temp.repl==true) {
        this.temp.repl_url += "?lite=true";
      }
      this.tool = this.temp;
      this.tags = response.data.tags;
      this.comments = response.data.comments;
      if (this.user.username == this.tool.created_by) {
        this.edit = true;
      }
    }, error => {
      console.error(error.message);
    }).catch(err => console.error('Catch', err));
  };
  this.getTool();

  this.submit = (newInfo) => {
    if (user.logged) {
      newInfo.tool_id = this.id
      newInfo.user_id = user.id
      newInfo.name = user.username
      newInfo.img = user.img
      console.log('submit create form:', newInfo);
      $http({
          method: 'POST',
          url: `${api}/comments`,
          data: newInfo
        }).then(response => {
          console.log('Post New COMMENT Response:',response.data);
          this.comments.push(response.data)
        }, error => {
          console.error(error.message);
      }).catch(err => console.error('Catch', err));
    }
  };

  this.selectTag = (id) => {
    console.log("Tag ID: "+id);
    $scope.$parent.ctrl.tag = id
  }

  this.editToolie = () => {
    $scope.$parent.ctrl.tool = this.tool
    $location.path('/toolie/edit')
  }

  //Listen for login
  $scope.$on('updateAuth', (data) => {
    // console.log('listener');
    this.user = user;
    this.user.logged = true;
  })

}]);
