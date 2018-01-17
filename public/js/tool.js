app.filter('trustUrl', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);

app.controller('ToolController', ['$http', '$scope', '$mdDialog', function($http, $scope, $mdDialog) {
  this.tool = {};
  this.comments = [];
  this.comment= {
    text: ""
  }
  this.user = {
    username:"Default",
    img:"https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg"
  }
  this.lang = $scope.$parent.ctrl.lang;
  this.id = $scope.$parent.ctrl.tool;
  this.getTool = () => {
    $http({
      method: 'GET',
      url: `${api}/languages/${this.lang.id}/tools/${this.id}`
    }).then(response => {
      console.log('oneTool:',response.data);
      this.temp = response.data;
      this.temp.repl_url += "?lite=true";
      this.tool = this.temp;
      this.tags = response.data.tags;
      this.comments = response.data.comments;
    }, error => {
      console.error(error.message);
    }).catch(err => console.error('Catch', err));
  };
  this.getTool();

  this.submit = (newInfo) => {
    newInfo.tool_id = this.id
    newInfo.user_id = user.id
    console.log('submit create form:', newInfo);
    $http({
        method: 'POST',
        url: `${api}/comments`,
        data: newInfo
      }).then(response => {
        console.log('Post New Tool Response:',response.data);
        this.comments.push(response.data)
      }, error => {
        console.error(error.message);
    }).catch(err => console.error('Catch', err));
  };

  this.selectTag=(id) => {
    console.log("Tag ID: "+id);
    $scope.$parent.ctrl.tag = id
  }

}]);
