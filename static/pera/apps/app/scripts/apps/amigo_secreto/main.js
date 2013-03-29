define(['../../../config'], function(){
	require([
		'jquery',
		'apps/amigo_secreto/app',
		'apps/amigo_secreto/controllers/Group',
		'moment',
		'angular.ui.filters.highlight',
		'angular.ui.directives.date',
		'angular.ui.directives.mask',
		'angular.ui.directives.keypress',
		'angular.ui.directives.reset',
		'angular.ui.directives.route',
		'angular.ui.directives.if',
		'bootstrap.affix',
		'bootstrap.modal',
		'bootstrap.tooltip',
		'bootstrap.popover',
		'bootstrap.alert',
		'bootstrap.button',
		'bootstrap.dropdown'
	], function($, app, GroupControllers, moment){
		app.config(['$httpProvider','$routeProvider', function ($http, $routes) {
		  //$http.defaults.headers.put['X-CSRFToken']       = $('input[name=csrfmiddlewaretoken]').val();
		  //$http.defaults.headers.post['X-CSRFToken']      = $('input[name=csrfmiddlewaretoken]').val();
		  $routes
	      .when('/', {
	          templateUrl: '/direct/amigo_secreto/views/home.html',
	          controller: 'Main'
	      })
	      .when('/grupos', {
	          templateUrl: '/direct/amigo_secreto/views/group/list.html',
	          controller: GroupControllers.List,
	          reloadOnSearch: false
	      })
	      .when('/grupo/novo', {
	          templateUrl: '/direct/amigo_secreto/views/group/edit.html',
	          controller: GroupControllers.Edit,
	          reloadOnPath: false
	      })
	      .when('/grupo/:groupId', {
	          templateUrl: '/direct/amigo_secreto/views/group/single.html',
	          controller: GroupControllers.Single
	      })
	      .when('/grupo/:groupId/editar', {
	          templateUrl: '/direct/amigo_secreto/views/group/edit.html',
	          controller: GroupControllers.Edit
	      })
	      .when('/grupo/:groupId/:tab', {
	          templateUrl: '/direct/amigo_secreto/views/group/single.html',
	          controller: GroupControllers.Single
	      })
	      .when('/medialibrary', {
	          templateUrl: '/direct/amigo_secreto/views/gallery.html',
	          controller: MediaLibrary
	      })
	      .when('/404', {
	          templateUrl: '/direct/amigo_secreto/views/404.html'
	      })
	      .otherwise({
	          redirectTo: '/404'
	      });
		}]);

		app.controller('Root', function ($scope, $location, pageTitle) {
		  $scope.includeTemplate  = 'views/partial/info.html';
		  pageTitle.reset();
		  $scope.navClass         = function (page) {
		      var currentRoute = $location.path().substring(1) || 'home';
		      return page === currentRoute;
		  };
		});

		app.controller('Navbar', function ($scope, $route, $routeParams, $location) {
	    $scope.name             = "NavBarCtrl";
	    $scope.params           = $routeParams;
	    $scope.ready();
	  });

		app.controller('Subhead', function ($scope, $route, $location) {
	    $scope.$route               = $route;
	    $scope.$location            = $route;
	    $scope.doSearch             = function(value){
	        if(value) $location.path('/grupos').search({q: value})
	    };
	    $scope.ready();
	  });

		app.controller('Main', function ($scope, $routeParams, pageTitle) {
		  pageTitle.reset();
		  $scope.name = "MainCtrl";
		  $scope.params = $routeParams;
		  $scope.ready();
		});

		app.controller('GroupList', GroupControllers.List);
		app.controller('GroupEdit', GroupControllers.Edit);
		app.controller('GroupSingle', GroupControllers.Single);
		app.controller('GroupSingleMessages', GroupControllers.SingleMessages);
		app.controller('GroupSingleMembers', GroupControllers.SingleMembers);
		app.controller('GroupSingleList', GroupControllers.SingleList);
		app.controller('GroupSingleSidebar', GroupControllers.SingleSidebar);

	  app.run(function ($http, $rootScope, $location, User, localResource) {
		  var _getTopScope    = function() {
		      return $rootScope;
		  };
		  var redirectToHome                  = false;
		  var triedLogin                      = true;
		  $rootScope.pending                  = {};
		  $rootScope.pending.request          = [];
		  $rootScope.pending.invite           = [];
		  $rootScope.$location                = $location;
		  $rootScope.Auth                     = User;
		  $rootScope.currentGroup             = {};
		  $rootScope.deleteCurrentGroup       = function () {
		      $("#modalDoRemoveGroup").modal('hide');
		      var current             = $rootScope.currentGroup;
		      if($rootScope.isAdmin(current)){
		          $rootScope.$emit('groupDeleting', current);
		          localResource.remove({id: current.id, class: 'group'}, function(data){
		              $("#modalThanksRemoveGroup").modal('show');
		              $rootScope.$emit('groupDeleted', current);
		          });
		      }
		  };
		  $rootScope.deleteGroup              = function (group, button) {
		      $rootScope.currentGroup         = group;
		      $("#modalDoRemoveGroup").modal('show');
		  };

		  $rootScope.doRemoveUserGroup       = function () {
		      $("#modalDoRemoveUserGroup").modal('hide');
		      var currentUser                 = $rootScope.currentUser;
		      $rootScope.$emit('userGroupRemoving', currentUser);
		      localResource.remove({id: currentUser.id, class: 'member'}, function(r){
		          $("#modalThanksRemoveUserGroup").modal('show');
		          $rootScope.$emit('userGroupRemoved', currentUser);
		      });
		  };
		  $rootScope.removeUserGroup         = function (member, button) {
		      $rootScope.currentUser          = member;
		      $("#modalDoRemoveUserGroup").modal('show');
		  };

		  $rootScope.requestCurrentGroup       = function () {
		      $("#modalDoRequestGroup").modal('hide');
		      $rootScope.$emit('groupSendingRequest', $rootScope.currentGroup);
		      var request                 = new localResource({grupo: $rootScope.currentGroup.id});
		      request.$save({class: 'request'}, function(data){
		          $("#modalThanksRequestGroup").modal('show');
		          $rootScope.pending.request.push(data);
		          $rootScope.$emit('groupSentRequest', data);
		      });
		  };
		  $rootScope.requestGroup              = function (group, button) {
		      $rootScope.currentGroup         = group;
		      $("#modalDoRequestGroup").modal('show');
		  };

		  $rootScope.isPending                  = function (group) {
		      var is_pending             = false;
		      angular.forEach($rootScope.pending.request, function(request) {
		          var uri         = request.grupo.split('/');
		          if(request.grupo == group.id || uri[uri.length - 1] == group.id) is_pending = true;
		      });
		      return is_pending;
		  };
		  $rootScope.isAdmin                  = function (group) {
		      var is_admin             = false;
		      if(angular.isArray(group.members)){
		          angular.forEach(group.members, function(member) {
		              if(member.administrador && member.membro.id == $rootScope.Auth.get('id')) is_admin = true;
		          });
		      }
		      return is_admin;
		  };
		  $rootScope.getAdmins                  = function (group) {
		      var admins             = [];
		      if(angular.isArray(group.members)){
		          angular.forEach(group.members, function(member) {
		              if(member.administrador) admins.push(member);
		          });
		      }
		      return admins;
		  };
		  $rootScope.isMember                  = function (group) {
		      var is_member             = false;
		      if(angular.isArray(group.members)){
		          angular.forEach(group.members, function(member) {
		              if(member.membro.id == $rootScope.Auth.get('id')) is_member = true;
		          });
		      }
		      return is_member;
		  };

		  $rootScope.doRaffle         = function(id, force){
			  var params      = {};
			  if(force) params['force'] = true;
			  return $http.get('/api/v2/amigo_secreto/group/' + id + '/raffle', params).success(function(a,b,c){
				  console.log('success', a,b,c);
			  }).error(function(a,b,c){
					console.log('error', a,b,c)
			  });
      };

		  $rootScope.ready    = function () {
		      var $scope          = _getTopScope();
		      $scope.status       = 'ready';
		      if(!$scope.$$phase) $scope.$apply();
		  };
		  $rootScope.loading  = function () {
		      var $scope          = _getTopScope();
		      $scope.status = 'loading';
		      if(!$scope.$$phase) $scope.$apply();
		  };
		  $rootScope.$on('$routeChangeStart', function () {
		      if(redirectToHome) $location.path("/");
		      _getTopScope().loading();
		  });
		  $rootScope.$watch("Auth.get('id')", function (id) {
		      if(triedLogin){
		          if(!id) {
		              $location.path("/");
		              redirectToHome      = true;
		          }else{
		              redirectToHome      = false;
		          }
		      }
		  });
		  User.login().success(function(data){
		      triedLogin           = true;
		  });
	  });

		app.factory('pageTitle', function($window) {
		  return {
	      origin: $window.document.title,
	      separator: ' < ',
	      set: function(title){
	        if(angular.isArray(title)){
	          this.reset();
	          for(var i in title){
	            this.append(title[i]);
	          }
	        }else{
	          this.reset(title);
	        }
	      },
	      reset: function(title){
	          $window.document.title = title || this.origin;
	      },
	      append: function(title, resetBefore){
	          if(resetBefore) this.reset();
	          $window.document.title += this.separator + title;
	      },
	      prepend: function(title, resetBefore){
	          if(resetBefore) this.reset();
	          $window.document.title = title + this.separator + $window.document.title;
	      }
		  };
		});

		app.factory('User', function ($http, $rootScope) {
	    var self                = this;
	    this.is_authenticated   = false;
	    this.auth               = null;
	    this.me                 = {
        name: "Visitante",
        avatar: "/api/v1/user/picture"
	    };
	    return {
	      get: function (attr){
	        if(self.me[attr]) return self.me[attr];
	        return null;
	      },
	      is_authenticated    : function(){
	        return self.is_authenticated;
	      },
	      login: function (username, password) {
	        var url         = "/api/v1/user/signin";
	        if(username && password){
	            return $http.post(url, {username:username, password: password}).success(function(data){
	                if (data.id){
	                    self.is_authenticated   = true;
	                    self.me                 = data;
	                    return true;
	                }
	                return false;
	            });
	        }
	        return $http.jsonp(url,{params: {callback:"JSON_CALLBACK", format:"jsonp"}}).success(function(data){
	          if (data.id) {
	              self.is_authenticated   = true;
	              self.me                 = data;
	              return true;
	          }
	          return false;
	        });
	        /*
	        if(!self.auth){
	          FB.login(function (response) {
	            if (response.authResponse) {
	              console.log(response.authResponse);
	              self.auth = response.authResponse;
	              FB.api('me',function(a){
	                console.log(a);
	                self.me = a;
	              })
	            } else {
	              console.log('Facebook login failed', response);
	            }
	          });
	        }*/
	      },
	      logout: function () {
	        FB.logout(function (response) {
	          if (response) {
	            self.auth = null;
	          } else {
	            console.log('Facebook logout failed.', response);
	          }
	        })
	      }
	    }
	  });

		app.filter('startFrom', function () {
	    return function (input, start) {
	      start = +start; //parse to int
	      return input.slice(start);
	    }
	  });
		app.filter('fromNow', function() {
	    moment.lang('pt-br');
	    return function(dateString) {
		    return moment(new Date(dateString)).fromNow();
	    };
		});

		app.filter('comma', function() {
	    return function(list, end) {
	      if(!list) return "";
	      end                 = end || " e ";
	      if (list.length === 0) return "";
	      if (list.length == 1) return list[0];
		    return [list.slice(0, list.length - 2).join(' , '), list[list.length - 1]].join(end);
	    };
		});

		app.directive('trFade', function () {
			return function (scope, element, attrs) {
				element.css('display', 'none');
				scope.$watch(attrs.trFade, function (value) {
					if (value) {
						$(element).fadeIn(200);
					} else {
						$(element).fadeOut(100);
					}
				});
			}
		});
		app.directive('trModal', function () {
			return function (scope, element, attrs) {
				var getAttr             = function(ext){
					return scope[eval("attrs.trModal" + (ext || ""))];
				};
				var _default_config             = {};
				_default_config.padding         = (angular.isNumber(getAttr("Padding"))     ? getAttr("Padding")    : 0);
				_default_config.margin          = (angular.isNumber(getAttr("Margin"))      ? getAttr("Margin")     : 0);
				_default_config.minWidth        = (angular.isNumber(getAttr("MinWidth"))    ? getAttr("MinWidth")   : 580);
				_default_config.autoSize        = getAttr("AutoSize")   || false;
				_default_config.autoHeight      = getAttr("AutoHeight") || true;
				_default_config.closeBtn        = getAttr("CloseBtn")   || false;
				if(angular.isFunction(getAttr("OnCancel"))) _default_config.onCancel            = getAttr("OnCancel");
				if(angular.isFunction(getAttr("AfterLoad"))) _default_config.afterLoad          = getAttr("AfterLoad");
				if(angular.isFunction(getAttr("BeforeShow"))) _default_config.beforeShow        = getAttr("BeforeShow");
				if(angular.isFunction(getAttr("AfterShow"))) _default_config.afterShow          = getAttr("AfterShow");
				if(angular.isFunction(getAttr("BeforeClose"))) _default_config.beforeClose      = getAttr("BeforeClose");
				if(angular.isFunction(getAttr("AfterClose"))) _default_config.afterClose        = getAttr("AfterClose");
				if(angular.isFunction(getAttr("OnUpdate"))) _default_config.onUpdate            = getAttr("OnUpdate");
				if(angular.isFunction(getAttr("OnPlayStart"))) _default_config.onPlayStart      = getAttr("OnPlayStart");
				if(angular.isFunction(getAttr("OnPlayEnd"))) _default_config.onPlayEnd          = getAttr("OnPlayEnd");

				scope.$watch(attrs.trModal, function (value) {
					if (value) {
						$.jquery.fancybox(element, _default_config);
					}else{
						$.jquery.fancybox.close(true);
					}
				});
			}
		});

		app.directive('ngDsInlineTemplate',function(){
			return function(scope,element,attrs){
				var templateElement = $(element);
				var name= templateElement.attr("ng-ds-inline-template");
				$(element).hide();
				scope[name] = element;
			}
		});

		app.directive('ngDsInlineEdit',function(){
			return function(scope,element,attrs){
				scope.$watch(attrs.ngDsInlineEdit,function(value){
					if(!attrs.ngDsTemplateName)
						return;
					var template = $(scope[attrs.ngDsTemplateName]);
					if(value){
						setTimeout(function(){
							$(element).after(template);
							template.fadeIn(200);
						},10);
					}else{
						template.hide();
					}
				});
			}
		});

		app.directive('ngDsActive', function () {
			return function (scope, element, attrs) {
				scope.$watch(attrs.ngDsActive, function (value) {
					if (value) {
						element.addClass('active');
					} else {
						element.removeClass('active');
					}
				});
			}
		});

		function MediaLibrary($scope, $http) {
			var url             = 'http://fb.americanas.com.br/api/v1/mediafile/?limit=5000&format=jsonp&callback=' + CALLBACK_TOKEN;
			$scope.currentPage      = 0;
			$scope.pageSize         = 10;
			$scope.items            = [];
			$http.jsonp(url).success(function(data) {
				$scope.items            = data['objects'];
				$scope.numberOfPages    = function(){
					return Math.ceil($scope.items.length / $scope.pageSize);
				};
				$scope.ready();
			});
		}

		MediaLibrary.$inject = ['$scope', '$http'];
		app.init();
	});
});