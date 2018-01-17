

app.controller("TagController", [ '$http', '$route', '$scope', '$location', function($http, $route, $scope, $location) {
  this.hello="ello";
  this.tools=[];
  // this.search={
  //   text:""
  // };
  this.searchText="";
  this.tags=[];
  this.allTags = [];
  this.id = $scope.$parent.ctrl.tag;

  this.findTag = (element) => {
    return this.oneTag.id==element.id;
  }
  this.activeTag = (tagpos) => {
    this.allTags.splice((tagpos),1);
  }
  this.tagdex = (arr) => {
    return arr.findIndex(this.findTag);
  }
  this.passiveTag = (tag) => {
    this.oneTag = tag;
    console.log(this.oneTag);
    console.log(" is current onetag");
    this.allTags.push(tag);
    this.tags.splice(this.tagdex(this.tags),1);
    console.log(this.tools);
    this.toolids = [];
    for (tool of this.tools) {
      if (this.toolids.indexOf(tool.id)==-1) {
        this.toolids.push(tool.id)
      }
    }
    let hits = [];
    for (tool of this.oneTag.tools) {
      for (let i = 0; i < this.tools.length; i++) {

        if(this.tools[i].id == tool.id) {

          if ((hits.indexOf(this.tools[i].id))==(-1)) {
            hits.push(this.tools[i].id);
            this.tools.splice(i,1);
          }
        }
      }
    }


    // passivetag
  };



  this.getTag = (id) => {
    $http({
      method:"GET",
      url:"http://localhost:3000/tags/"+id
    })
    .then((response) => {
      json = response.data;
      this.oneTag = json;
      return json;
    }).then((json) => {
      for (tool of this.oneTag.tools) {
        this.tools.push(tool);
      }
      this.tags.push(this.oneTag)
      tagpos = this.tagdex(this.allTags)
      return tagpos
    }).then((tagpos) => {
      this.activeTag(tagpos);
    })
    .catch((error) => {
      console.error(error);
    })
    // get tag function
  };

  this.getAllTags = () => {
    $http({
      method:"GET",
      url:"http://localhost:3000/tags/"
    }).then((response) => {
      console.log('get all tags response:', response.data);
      this.allTags = response.data;
    }).then(() => {
      this.getTag(this.id);
    }).catch((error) => {
      console.error(error);
    })
    // get All Tags End
  };
  this.getAllTags();





  // end controller
}]);
