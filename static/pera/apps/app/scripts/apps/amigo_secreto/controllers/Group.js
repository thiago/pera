/**
 * Created with PyCharm.
 * User: thiago.rodrigues
 * Date: 12/03/13
 * Time: 11:11
 * To change this template use File | Settings | File Templates.
 */

define(['apps/amigo_secreto/app'], function(app){
	return function(){
	  var self                = this;
	  var Obj                 = {};
	  var searchSorts         = [
	      {key:'-date_last_edited', name:'atividades mais recentes'},
	      {key:'-date_raffle', name:'data do sorteio'},
	      {key:'-date_delivery', name:'data da troca de presentes'}
	  ];
	  var searchQuery         = '';
	  var publicScope         = function($scope){
	      return angular.extend($scope, {
	          searchSorts: searchSorts,
	          searchSort : searchSorts[0].key
	      });
	  };

	  Obj.List              = function ($scope, $filter, $location, $routeParams, $rootScope, localResource) {
      $scope.groups                   = [];
      $scope.routeParams              = $routeParams;
      $scope.searchQuery              = $routeParams.q || "";
      $scope.searchStatus             = 'loading';
      $scope.hasResult                = function(){
          return $filter('filter')($scope.groups, $scope.searchQuery).length !== 0;
      };
      $rootScope.$on('groupSentRequest', function(e, args){
          var oldGroups = $scope.groups;
          $scope.groups = [];
          angular.forEach(oldGroups, function(group) {
              if (args.grupo != group.id) $scope.groups.push(group);
          });
      });
      $rootScope.$on('groupDeleted', function(e, args){
          var oldGroups = $scope.groups;
          $scope.groups = [];
          angular.forEach(oldGroups, function(group) {
              if (args.id != group.id) $scope.groups.push(group);
          });
      });
      $scope.$watch('routeParams', function(newVal, oldVal) {
          if(newVal.q != $scope.searchQuery){
              $scope.searchQuery      = newVal.q;
          }
      }, true);

      $scope.$watch('searchQuery', function (key) {
          var params = {
              class: 'group'
          };
          if (key){
              params.q                        = key;
              $location.search({q: key});
          }else{
              params["members__membro"]      =  $rootScope.Auth.get('id');
              $location.search("");
          }

          $scope.searchStatus             = 'loading';
          $scope.loading();
          localResource.query(params, function(data){
              $scope.groups = data;
              $scope.searchStatus             = 'ready';
              $scope.ready();
          });
      });
      publicScope($scope);
	  };
	  Obj.Edit               = function ($scope, $location, $rootScope, $routeParams,localResource, pageTitle) {
	      var self                = this;
	      var isNew               = $routeParams.groupId ? false : true;
	      $scope.isNew            = isNew;
	      $scope.optsDateRaffle   = {
	          defaultDate: "0",
	          minDate: 0,
	          onClose: function( selectedDate ) {
	              if(selectedDate){
	                  $scope.optsDateDelivery.minDate       = selectedDate;
	                  $scope.$apply();
	              }
	          }
	      };
	      $scope.optsDateDelivery   = {
	          defaultDate: "0",
	          minDate: 0,
	          onClose: function( selectedDate ) {
	              if(selectedDate){
	                  $scope.optsDateRaffle.maxDate       = selectedDate;
	                  $scope.$apply();
	              }
	          }
	      };
		    /*
	      $scope.values           = localStorageService.isSupported() && localStorageService.get('valuesList') ? JSON.parse(localStorageService.get('valuesList')) : localResource.query({class: 'value'}, function(data){
	          localStorageService.add('valuesList', JSON.stringify(data));
	          return data;
	      });
	      */
	      $scope.values           = localResource.query({class: 'value'}, function(data){
	          return data;
	      });
	      $scope.previewPicture       = "";
	      $scope.setFile = function(element) {
	          $scope.$apply(function($scope) {
	              var reader 			= new FileReader();
	              reader.onload 		= function (e) {
	                  try{
	                      var data        = e.currentTarget.result;
	                      console.log(data);
	                      var format      = data.split(';', 1)[0];
	                      var type        = format.split(':')[1];
	                      var b64         = data.slice(format.length + 8);
	                      $scope.item.picture         = {
	                          file        :{
	                              name        : element.value,
	                              file        : b64,
	                              content_type: type
	                          }
	                      };
	                      $scope.previewPicture       = data;
	                  }catch(e){
	                      console.log("Deu merda no envio", e);
	                  }
	              };
	              reader.readAsDataURL(element.files[0]);
	              $scope.item.picture = element.files[0];
	          });
	      };

	      if (isNew){
	          $scope.item     = {};
	          $scope.ready();
	      }else{
	          $scope.item             = localResource.get({class: 'group', id: $routeParams.groupId}, function (item) {
	              pageTitle.prepend(item.title, true);
	              self.original                   = item;
	              self.original.date_raffle       = new Date(self.original.date_raffle);
	              self.original.date_delivery     = new Date(self.original.date_delivery);
	              var hours                       = self.original.date_delivery.getHours();
	              var minutes                     = self.original.date_delivery.getMinutes();
	              var time                        = hours + "" + minutes;
	              self.original.date_delivery_time    = time;
	              $scope.item                     = new localResource(self.original);

	              setTimeout($scope.ready, 300);
	          });
	      }

	      $scope.isClean = function() {
	          return angular.equals(self.original, $scope.item);
	      };

	      $scope.destroy = function() {
	          self.original.destroy(function() {
	              $location.path('/grupos');
	          });
	      };

	      $scope.isValueActive       = function(value){
	          if(isNew){
	              if($scope.item.value == value.id) return true;
	          }else{
	              if($scppe.item.value == value.resource_uri) return true;
	          }
	          return false;
	      };
	      $scope.ValueClick       = function(value){
	          if(isNew){
	              $scope.item.value       = value.id;
	          }else{
	              $scope.item.value       = value.resource_uri;
	          }
	      };
	      $scope.save = function() {
	          var time        = $scope.item.date_delivery_time;
	          var hour        = time.toString().substr(0,2);
	          var minute      = time.toString().substr(2,3);
	          if(angular.isDate($scope.item.date_delivery)){
	              $scope.item.date_delivery.setHours(hour, minute);
	          }
	          if (isNew){
	              var item            = new localResource($scope.item);
	              item.class          = 'group';
	              item.$save({}, function(item) {
	                  $location.path('/grupo/' + item.id);
	              });
	          }else{
	              $scope.item.class   = 'group';
	              $scope.item.update(function(a) {
	                  console.log('update', a);
	                  $location.path('/grupo/' + a.id);
	              });
	          }
	      };
	      publicScope($scope);
	  };

	  Obj.Single = function ($scope, $routeParams, $rootScope, $http, localResource) {
	      var current_tab_html    = null;
	      switch($routeParams.tab){
	          case "presentes":
	              current_tab_html    = "list";
	              break;

	          case "membros":
	              current_tab_html    = "members";
	              break;

	          default:
	              current_tab_html    = "messages";
	              break;
	      }
	      $scope.name             = "Single Group";
	      $scope.params           = $routeParams;
	      $scope.currentTabHtml   = null;
	      $scope.item             = localResource.get({class: 'group', id: $routeParams.groupId, type: "complete"}, function (item) {
	          $scope.item             = item;
	          $scope.currentTabHtml   = '/direct/amigo_secreto/views/group/single_' + current_tab_html + '.html'
	      });
	      $scope.getMe         = function(){
	          var me          = null;
	          angular.forEach($scope.item.members, function(member){
	              if(member.membro.id == $rootScope.Auth.get('id')){
	                  me          = member;
	              }
	          });
	          return me;
	      };
	      publicScope($scope);
	  };
	  Obj.SingleMessages = function ($scope, $routeParams, localResource) {
	      console.log("Entrou messages");
	      $scope.name         = "Single Messages";
	      $scope.params       = $routeParams;
	      publicScope($scope);
	  };
	  Obj.SingleMembers = function ($scope, $routeParams, $rootScope, localResource) {
	      $scope.parent                   = $scope.$parent.$parent;
	      $scope.item                     = $scope.parent.item;
	      $scope.parent.$watch("item", function(item){
	          $scope.membersWithOutMe         = [];
	          angular.forEach(item.members, function(member){
	              if(member.membro.id != $rootScope.Auth.get('id')) $scope.membersWithOutMe.push(member)
	          });
	          $scope.item         = item;
	      });
	      publicScope($scope);
	  };
	  Obj.SingleList = function ($scope, $routeParams, localResource) {
	      $scope.name         = "Single List";
	      $scope.params       = $routeParams;
	      $scope.item         = localResource.get({class: 'group', id: $routeParams.groupId}, function (item) {
	          $scope.item         = item;
	          $scope.ready();
	      });
	      publicScope($scope);
	  };

	  Obj.SingleSidebar = function ($scope, $route, $routeParams, $location) {
	      $scope.name             = "Single Grou Sidebar";
	      $scope.params           = $routeParams;
	      publicScope($scope);
	      $scope.ready();
	  };

	  return Obj;
	}();
});