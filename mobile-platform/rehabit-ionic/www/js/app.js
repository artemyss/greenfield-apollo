angular.module('app', [
  'app.directives',
  'app.services',
  'app.create',
  'app.edit',
  'app.dashboard',
  'app.auth',
  'ngRoute',
  'ngSanitize',
  'gridshore.c3js.chart',
  'satellizer',
  'cgNotify'
])

.config(['$routeProvider', '$httpProvider', '$authProvider',
  function ($routeProvider, $httpProvider, $authProvider) {
    $routeProvider
      .when('/signin', {
        templateUrl: 'js/auth/signin.html',
        controller: 'AuthController',
      })
      .when('/signup', {
        templateUrl: 'js/auth/signup.html',
        controller: 'AuthController',
      })
      .when('/signout', {
        template: '',
        controller: 'AuthController',
      })
      .when('/dashboard', {
        templateUrl: 'js/dashboard/dashboard.html',
        controller: 'DashboardController',
        // authenticate: true
      })
      .when('/create', {
        templateUrl: 'js/create/create.html',
        controller: 'CreateController',
        // authenticate: true
      })
      .when('/edit', {
        templateUrl: 'js/edit/edit.html',
        controller: 'EditController',
        // authenticate: true
      })
      .otherwise({
        redirectTo: '/dashboard'
      });

    $authProvider.loginUrl = '/signin';
    $authProvider.signupUrl = '/signup';
    $authProvider.tokenPrefix = 'habit';

    $authProvider.google({
      clientId: '416143587162-phs72qq27pfvqua6buqb5lf4okum9krq.apps.googleusercontent.com',
      url: 'http://localhost:8080/authenticate/google'
    });

    $httpProvider.interceptors.push('AttachTokens');
  }
])

.factory('AttachTokens', ['$window',
  function ($window) {
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('habit_token');
        if (jwt) {
          object.headers.Authorization = 'Bearer ' + jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  }
])

.run(['$rootScope', '$location', '$interval', 'Auth', 'Events', 'Habits',
  function ($rootScope, $location, $interval, Auth, Events, Habits) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
        $location.path('/signin');
      }
    });
    var timer;
    var eventScheduler = function() {
      console.log('eventScheduler start');
      Habits.getHabits()
        .then(function (habits) {
          events = Events.getEventQueue(habits);
          timer = $interval(function() {
            if (events.length) {
              Events.triggerEvents(events);
            }
          }, 1000);
        });
    };
    eventScheduler();
    $rootScope.$on('habitChange', eventScheduler);
  }
]);
