'use strict';

/* App Module */

angular.module('tipOutput', ['firebase', 'filters'])
  .controller('Tips', ['$scope', 'angularFire', '$routeParams',  
  function ($scope, angularFire, $routeParams) {
    var ref = new Firebase('dev-cabletipster.firebaseio.com/tips/geoFire/dataById');
    
    var promise = angularFire(ref, $scope, "tips");
    promise.then(function() {
    // You can safely access $scope.tips[#];
    console.log($scope.tips)
    $scope.selectedItem = $routeParams.tipId;
    console.log($scope.selectedItem);
    console.log($scope.tips[$scope.selectedItem]);
    $scope.tip = $scope.tips[$scope.selectedItem];
    $scope.getTip = function() {
     return $scope.tip;
    }
    });
}])
  .config(['$routeProvider', function($routeProvider) {
/*  $locationProvider.html5Mode(true);*/
  $routeProvider.
      when('/tips', {templateUrl: 'partials/tip-list.html'}).
      when('/tips/:tipId', {templateUrl: 'partials/tip-detail.html'}).
      otherwise({redirectTo: '/tips'});
  }])
//controller for social voting goes here
  .filter('toArray', function () {
    'use strict';

    return function (obj) {
        if (!(obj instanceof Object)) {
            return obj;
        }

        return Object.keys(obj).map(function (key) {
            return Object.defineProperty(obj[key], '$key', {__proto__: null, value: key});
        });
    }
  })

  .controller('MainCtrl', function($scope, $timeout) {

  $timeout(function() {
      // sets filter to user's plan type as soon as received from server
      var planTypeRef = new Firebase('https://dev-cabletipster.firebaseio.com/tips/'+window.tipID); 
      planTypeRef.on('value', function(snap) {
        var planType = snap.val().servicesReceived;
        for (var i = 0; i < $scope.filterOptions.plans.length; i++) {
          if (planType === $scope.filterOptions.plans[i].type) {
          $scope.filterItem.plan = $scope.filterOptions.plans[i];          
          }
        }
      })
  }, 1000);

  //Contains the filter options
  $scope.filterOptions = {
    plans: [
      {id : 2, name : 'All Plan Types', type: 'all' },
      {id : 3, name : 'TV & Internet Bundle', type: 'tv-internet' },
      {id : 4, name : 'TV Only', type: 'tv' },
      {id : 5, name : 'Internet Only', type: 'internet' },
      {id : 6, name : 'TV, Internet & Phone Bundle', type: 'tv-internet-phone' },
      {id : 7, name : 'Internet & Phone Bundle', type: 'internet-phone' },
      {id : 8, name : 'TV & Phone Bundle', type: 'tv-phone' }  
    ]
  };

  $scope.filterItem = {
    plan: $scope.filterOptions.plans[0]
  }   

  //Custom filter - filter based on the rating selected
  $scope.customFilter = function (tip) {
    if (tip.servicesReceived === $scope.filterItem.plan.type) {
      return true;
    } else if ($scope.filterItem.plan.type === 'all') {
      return true;
    } else {
      return false;
    }
  };  
})

angular.module('utils', [])
  .factory('utils', function(){
    return{
      compareStr: function(stra, strb){
        stra = ("" + stra).toLowerCase();
        strb = ("" + strb).toLowerCase();
        return stra.indexOf(strb) !== -1;
      }
    };
  });

angular.module('filters',['utils'])
  .filter('packageFilter', function(utils){
    
    return function(input, query){
      if(!query) return input;
      var result = [];
      
      angular.forEach(input, function(tip){
        if(utils.compareStr(tip.providerName, query) ||
           utils.compareStr(tip.TVPackage, query) ||
           utils.compareStr(tip.internetPackage, query) ||
           utils.compareStr(tip.addOns, query))
          result.push(tip);          
      });
      return result;
    };
  })
  .filter('zipFilter', function(utils){
    
    return function(input, zipQuery){
      if(!zipQuery) return input;
      var result = [];
      
      angular.forEach(input, function(tip){
        if(utils.compareStr(tip.zipCode, zipQuery))
          result.push(tip);          
      });
      return result;
    };
  });
