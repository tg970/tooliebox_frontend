app.controller('LangController', [ '$http', '$route', '$scope', '$location', function($http, $route, $scope, $location) {
  this.user = user;
  this.id = $scope.$parent.ctrl.lang.id
  this.searchterm = "";
  this.getLang = () => {
    $http({
        method: 'GET',
        url: `${api}/languages/${this.id}`
      }).then(response => {
        console.log('oneLang:',response.data);
        this.lang = response.data;
        this.tools = response.data.tools
        console.log(this.tools);
        if (user.logged) {
          for (let tool of this.tools) {
            if (user.arrTool.includes(tool.id)) {
              tool.belted = true;
            } else {
              tool.belted = false;
            }
          }
        }
        this.numTools = this.tools.length
      }, error => {
        console.error(error.message);
    }).catch(err => console.error('Catch', err));
  }
  this.getLang()

  this.select = (tool) => {
    $scope.$parent.ctrl.tool = tool
    //$scope.$parent.ctrl.lang = this.lang
    $location.path('/toolie')
  }

  this.selectTag=(id) => {
    console.log("Tag ID: "+id);
    $scope.$parent.ctrl.tag = id
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
          this.getLang();
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
            this.getLang();
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
    this.getLang();
  })

}]);
