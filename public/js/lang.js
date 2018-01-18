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
            }
          }
        }
        this.numTools = this.tools.length
      }, error => {
        console.error(error.message);
    }).catch(err => console.error('Catch', err));
  }
  this.getLang()

  this.select = (id) => {
    $scope.$parent.ctrl.tool.id = id
    $scope.$parent.ctrl.lang = this.lang
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
        console.log('toolBelt response:',response.data);
      }, error => {
        console.error(error.message);
    }).catch(err => console.error('Catch', err));
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
        console.log('toolBelt response:',response.data);
      }, error => {
        console.error(error.message);
    }).catch(err => console.error('Catch', err));
  }

  //Listen for login
  $scope.$on('updateAuth', (data) => {
    // console.log('listener');
    this.user = user;
    this.user.logged = true;
    this.getLang();
  })

}]);
