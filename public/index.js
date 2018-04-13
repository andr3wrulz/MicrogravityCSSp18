angular.module('myApp', [])

.controller('myCtrl', function($scope, $http) {
	$scope.run_id = '';
			
	$scope.getSensors = function () {
		console.log("Trying to get sensors for run " + $scope.run_id);
		$http.get("api/reading/getsensorsinrun/" + $scope.run_id)
		.then(function mySuccess(response) {
			$scope.sensors = response.data;
			console.log("Refreshed sensors list");
			console.log(JSON.stringify($scope.sensors));
		}, function myFailure (response) {
			console.log("Could not get sensors for run");
		})
	};
		
	$scope.displayTest = function () {
		$http.get("api/run/latest")
		.then(function mySuccess (response) {
			//console.log(JSON.stringify(response.data));
			console.log("Got latest run " + response.data.run_id + " started: " + response.data.start);
			$scope.run_id = response.data.run_id;
			$scope.start_time = response.data.start;
			$scope.getSensors();
		}, function myFailure (response) {
			console.log("Could not get latest test run");
		})
	};
	
	$scope.startTest = function () {
		$http.get("api/run/startrun")
		.then(function mySuccess(response) {
			console.log("Started new test");
			$scope.refreshTest();
		}, function myFailure (response) {
			console.log("Could not start new run");
		});
	};
})

.directive('chart', function () {
	return {
		restrict: 'E',
		scope: {
			sensor: '='
		},
		template: '<canvas id="chart{{sensor.sensor_id}}" width="800" height="600"></canvas>',
		link: function (scope, element, attrs) {
			console.log(element.firstChild);
			var ctx = element.firstChild.getContext('2d');
			console.log(ctx);
			var chart = new Chart (ctx, {
				type: 'line',
				data: {}
			});
		}
	};
});