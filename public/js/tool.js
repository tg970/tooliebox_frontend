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
      if (user.logged) {
        if (user.arrTool.includes(this.tool.id)) {
          this.belted = true;
        } else {
          this.belted = false
        }
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
          $scope.newInfo.text = ' '
        }, error => {
          console.error(error.message);
      }).catch(err => console.error('Catch', err));
    } else {
      console.log($scope.$parent.ctrl);
      $scope.$parent.ctrl.openLogin();
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

  this.addToBelt = (id) => {
    console.log('Add tool id:',id);
    console.log('Add to user id', user.id);
    let newInfo = { tool_id: id, user_id: user.id }
    console.log('newInfo:', newInfo);
    $http({
        method: 'POST',
        url: `${api}/toolbelts`,
        data: newInfo
      }).then(response => {
        console.log('toolBelt response:',response);
        if (response.status == 201) {
          user.arrTool.push(response.data.tool_id);
          user.toolBelts.push(response.data)
          this.getTool();
        }
      }, error => {
        console.error(error.message);
    }).catch(err => console.error('Catch', err));
  }

  this.removeBelt = (id) => {
    let beltId = null
    let removeToolBelt = null
    let removeArrTool = null
    for (let belt of user.toolBelts) {
      if (user.id == belt.user_id && id == belt.tool_id) {
        removeToolBelt = user.toolBelts.indexOf(belt)
        removeArrTool = user.arrTool.indexOf(belt.tool_id)
        beltId = belt.id
        break
      }
    }
    if (beltId) {
      $http({
          method: 'DELETE',
          url: `${api}/toolbelts/${beltId}`
        }).then(response => {
          console.log('toolBelt response:',response);
          if (response.status == 204) {
            user.arrTool.splice(removeArrTool, 1)
            user.toolBelts.splice(removeToolBelt, 1)
            this.getTool();
          }
        }, error => {
          console.error(error.message);
      }).catch(err => console.error('Catch', err));
    }
  }

  //Listen for login
  $scope.$on('updateAuth', (data) => {
    // console.log('listener');
    this.user = user;
    this.user.logged = true;
  })

}]);
