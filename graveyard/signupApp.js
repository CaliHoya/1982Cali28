'use strict';

/* App Module */

angular.module('signupApp', [])
  .directive('match', function($parse) {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl) {
        scope.$watch(function() {        
          return $parse(attrs.match)(scope) === ctrl.$modelValue;
        }, function(currentValue) {
          ctrl.$setValidity('mismatch', currentValue);
        });
      }
    };
  })
  .controller('FormController', function ($scope) {
    $scope.input = {
      password: '',
      repeatPassword: ''
    };
  
})
