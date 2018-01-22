app.controller('WorkBenchController', [ '$http', '$scope', '$location', '$mdDialog', function($http, $scope, $location, $mdDialog) {
  let CtrlUrl = $location.url();
  console.log('WorkBenchController:', CtrlUrl);
  this.selectLang = $scope.$parent.ctrl.langs;
  this.repl = true;
  this.showIcons = false;
  this.user = user

  this.select = (tool) => {
    $scope.$parent.ctrl.tool = tool
    for (let lang of $scope.$parent.ctrl.langs) {
      if (lang.id == tool.id) {
        $scope.$parent.ctrl.lang = lang;
        break
      }
    }
    $location.path('/toolie')
  }

  this.selectTag=(id) => {
    $scope.$parent.ctrl.tag = id
  }

  if (CtrlUrl == '/toolie/edit') {
    this.repl = false
    $scope.newInfo = angular.copy($scope.$parent.ctrl.tool)
    let arr = ['comments', 'created_at', 'tags', 'updated_at']
    arr.forEach(i => delete $scope.newInfo[i])
    if ($scope.newInfo.repl_url) {
      this.repl = true
      $scope.newInfo.repl = "true"
    } else {
      $scope.newInfo.repl = "false"
    }
    console.log('newInfo:', $scope.newInfo);
  };

  this.workBenchList = () => {
    $http({
        method: 'GET',
        url: `${api}/users/${user.id}`,
        headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) }
      }).then(response => {
        console.log('User GET Response:', response.data);
        this.tools = response.data.tools
        this.numTools = this.tools.length
        if (this.numTools == 0) {
          this.showIcons = true
          console.log('this.showIcons', this.showIcons);
        }
        for (let tool of this.tools) {
          if (user.arrTool.includes(tool.id)) {
            tool.belted = true;
          } else {
            tool.belted = false;
          }
        }
        console.log(this.tools);
      }, error => {
        console.error(error.message);
    }).catch(err => console.error('Catch', err));
  }

  if (CtrlUrl == '/workbench') {
    this.workBenchList()
  }

  this.submit = (newInfo) => {
    newInfo.user_id = user.id
    newInfo.created_by = user.username
    for (let lang of this.selectLang) {
      if (lang.id == newInfo.language) {
        newInfo.lang_url = lang.img_url;
        break
      };
    }
    console.log('submit create form:', newInfo);
    $http({
        method: 'POST',
        url: `${api}/languages/${newInfo.language}/tools`,
        data: newInfo
      }).then(response => {
        console.log('Post New Tool Response:',response.data);
        $scope.$parent.ctrl.tool = response.data
        $location.path('/toolie')
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

  this.openDelete = (ev) => {
    $mdDialog.show({
      controller: DeleteController,
      templateUrl: 'partials/delete.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
    })
    .then((newInfo) => {
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
    }, function() {
      console.log('cancel dialog');;
    });
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
            this.workBenchList();
          }
        }, error => {
          console.error(error.message);
      }).catch(err => console.error('Catch', err));
    }
  }

}]);
