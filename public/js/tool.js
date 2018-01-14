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
      url: `http://localhost:3000/languages/${this.lang}/tools/${this.id}`
    }).then(response => {
      console.log('oneTool:',response.data);
      this.temp = response.data;
      this.temp.repl_url += "?lite=true";
      this.tool = this.temp;
    }, error => {
      console.error(error.message);
    }).catch(err => console.error('Catch', err));
  };
  this.getTool();

  // this.getLang = () => {
  //   $http({
  //     method: "GET",
  //     url: "http://localhost:3000/languages/" + this.lang_id
  //   })
  //   .then((response) => {
  //     this.lang = response.data;
  //     console.log("Tool Language: ", this.lang);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   })
  // }
  // this.getLang();

  this.getComments = () => {
    // temp will get from a database
    this.comments = [
      {
        text:"I love loops",
        user:{
          username:"Gary",
          img:"https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg"
        }
      },
      {
        text:"I hate loops they make me feel bad about being human. It's really quite depressing.",
        user:{
          username:"Gary",
          img:"https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg"
        }
      },
      {
        text:"I am indifferent about loops",
        user:{
          username:"Gary",
          img:"https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg"
        }
      }
    ]
    // end of getcomments
  };
  // this.getComments();
  this.postComment = () => {
    this.comment.user = this.user;
    console.log(this.comment);
  }
  //console.log(this.comments);


}]);
