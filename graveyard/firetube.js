angular.module("master", ["firebase"])
  .controller(
    "loginCtrl", ["$scope", "angularFireAuth",
    function($scope, angularFireAuth) {
      var url = "https://cabletipster.firebaseio.com/";
      angularFireAuth.initialize(new Firebase(url), {
        scope: $scope, name: "user"      
      });
      $scope.login = function() {
        angularFireAuth.login("facebook");
      }
      $scope.logout = function() {
        angularFireAuth.logout();
      }
    }
  ]);