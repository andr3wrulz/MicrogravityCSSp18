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
			$scope.updateCharts();
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

	$scope.updateCharts = function () {
		angular.forEach ($scope.sensors, function (value, key) {
			//console.log(value);
			console.log("Updating chart" + value.sensor_id);
			var svg = d3.select("#chart" + value.sensor_id);

			var chart = nv.models.lineChart()
				.margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
				.useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
				.transitionDuration(350)  //how fast do you want the lines to transition?
				.showLegend(true)       //Show the legend, allowing users to turn on/off line series.
				.showYAxis(true)        //Show the y-axis
				.showXAxis(true)        //Show the x-axis
			;

			chart.xAxis     //Chart x-axis settings
				.axisLabel('Time (ms)')
				.tickFormat(d3.format(',r'));
			
			chart.yAxis     //Chart y-axis settings
				.axisLabel('Voltage (v)')
				.tickFormat(d3.format('.02f'));
		});
	};
});
