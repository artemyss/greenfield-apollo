angular.module('app.dashboard', ['ngMaterial'])

.controller('DashboardController', ['$rootScope', '$scope', '$location', 'Habits', 'Events',
  function($rootScope, $scope, $location, Habits, Events) {
    $rootScope.showNav = true;
    $rootScope.create = false;

    $scope.toggleCreate = function(){
      $rootScope.create = !$rootScope.create;
    };

    $scope.editHabit = function(habit) {
      Habits.setEdit(habit);
      $scope.habit = Habits.getEdit();
      console.log($scope.habit);
      $scope.habit.show = true;
    };

    $scope.updateHabit = function() {
      Habits.updateHabit($scope.habit)
        .then(function() {
          $scope.habit.show = false;
          $rootScope.$broadcast('habitChange');
          // $scope.getHabits();
        })
        .catch(function(err) {
          console.error(err);
        });
    };

    $scope.deactivateHabit = function() {
      $scope.habit.active = false;
      Habits.updateHabit($scope.habit)
        .then(function() {
          $rootScope.$broadcast('habitChange');
          $location.path('/dashboard');
        })
        .catch(function(err) {
          console.error(err);
        });
    };


    // $scope.testHabits = [
    //   {habitName: 'Submit a Pull Request', streak: 5, checkinCount: 25, failedCount: 3, reminderTime: '2:30 PM', dueTime: '4:30 PM', streakRecord: 15, active:true},
    //   {habitName: 'Complete a Pomodoro', streak: 10, checkinCount: 20, failedCount: 4, reminderTime: '2:30 PM', dueTime: '4:30 PM', streakRecord: 20, active:true},
    //   {habitName: 'Workout', streak: 8, checkinCount: 15, failedCount: 2, reminderTime: '2:30 PM', dueTime: '4:30 PM', streakRecord: 8, active:true}
    // ];

    // $scope.colors = ["#1f77b4", "#ff7f0e", "#2ca02c"];

    $scope.buttonState = function (habit, state) {
      if (state === 'pending') {
        return habit.status === 'pending'
          || habit.status === 'remind'
          || habit.status === 'reminded'
      }
      if (state === 'completed') {
        return habit.status === 'completed';
      }
      if (state === 'failed') {
        return habit.status === 'failed' ||
          habit.status === 'missed';
      }
    }

    $scope.getHabits = function () {
      Habits.getHabits()
        .then(function(habits) {
          // original
          // $scope.habits = habits
          // code for testing
          $scope.habits = $rootScope.sample ? $scope.testHabits : habits;

          // change var name if you want to use deactivated habits on the frontend
          $scope.habits = $scope.habits.filter(function(habit) {
            return habit.active;
          });
          // Stuff for Habit Streaks chart
          $scope.habitStreaks = $scope.habits.filter(function (habit) {
            return habit.streak > 0;
          });
          // Stuff for Habit Score chart
          $scope.totalFailed = $scope.habits.reduce(function (res, habit) {
            console.log('failedCount:', habit.failedCount);
            return res + habit.failedCount;
          }, 0);
          $scope.totalCompleted = 0;
          $scope.habitsCompleted = $scope.habits.map(function (habit) {
            $scope.totalCompleted += habit.checkinCount;
            return habit.completed;
          });
          $scope.score = Math.round($scope.totalCompleted / ($scope.totalCompleted + $scope.totalFailed) * 100);
          console.log('completed:', $scope.totalCompleted);
          console.log('failed:', $scope.totalFailed);
          console.log('score:', $scope.score);
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    $scope.getHabits();  // Invoke to render active habits on dashboard

    // $scope.toggleSampleData = function () {
    //   $rootScope.sample = !$rootScope.sample;
    //   $location.path('/');
    // };


    $scope.color = function(habit) {
      // return "opacity: " + habit.streak / 7;
      return "background-color: hsla(132, 100%, 34%," + habit.streak / 14 + ")";
    };

    $scope.checkinHabit = function(habit) {
      Habits.checkinHabit(habit)
        .then(function() {
          $scope.getHabits();
          $location.path('/');
        })
        .catch(function(error) {
          console.error(error);
        });
    };

  }
]);
