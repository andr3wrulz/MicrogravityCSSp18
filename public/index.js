angular.module('myApp', [])

.controller('myCtrl', function($scope, $http, $timeout) {
	$scope.run_id = '';
	$scope.updateDelay = 2500;
	$scope.showErrors = false;
	$scope.errors = [];
			
	$scope.getSensors = function () {
		console.log("Trying to get sensors for run " + $scope.run_id);
		$http.get("api/reading/getsensorsinrun/" + $scope.run_id)
		.then(function mySuccess(response) {
			$scope.sensors = response.data;
			console.log("Refreshed sensors list");
			console.log(JSON.stringify($scope.sensors));
			$scope.createCharts();
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
		$http.post("api/run/startrun")
		.then(function mySuccess(response) {
			console.log("Started new test");
			$timeout(function () {
				if ($scope.updateDelay == 0) {// Allow updates since we just started a test
					$scope.updateDelay = 2500;
				}
				$scope.displayTest();
			},2000);
		}, function myFailure (response) {
			console.error("Could not start new run");
		});
	};

	$scope.stopTest = function () {
		console.log("Sending stop command");
		$http.post("api/run/stoprun")
		.then(function mySuccess(response) {
			console.log("Sent stop command successfully");
			$timeout(function () {
				$scope.displayTest();
			},2000);
		}, function myFailure (response) {
			console.error("Could not send stop command!");
		});
	};

	$scope.createCharts = function () {
		$scope.chartsToShow = [];
		$scope.charts = [];
		angular.forEach ($scope.sensors, function (obj, index) {
			var sensorInfo = obj;
			sensorInfo.index = index;
			$scope.chartsToShow.push(sensorInfo);
		});
		$timeout(function () {
			if ($scope.timer) {// If timer exists, clear it
				clearInterval($scope.timer);
				$scope.timer = null;
			}
			$scope.updateCharts();// Kick off updates (else we would have to wait for first timer callback)
			if ($scope.updateDelay != 0) {
				$scope.timer = setInterval(function() {
					$scope.updateCharts();
					$scope.getErrors();
				}, $scope.updateDelay);// Create timer
			}
		}, 250);
	};

	$scope.getErrors = function () {
		console.log("Getting errors associated with selected runs");
		$http.get('/api/runerror/runwithdetails/' + $scope.run_id)
		.then(function success (response) {
			console.log(JSON.stringify(response.data.data[0]));
			if ($scope.errors.length != response.data.data[0].length) {
				$scope.errors = response.data.data[0];
				$scope.showErrors = $scope.errors.length != 0;
			}
		}, function failure (response) {
			console.error("Unable to retrieve errors for run " + $scope.run_id);
		});
	};

	$scope.updateCharts = function () {
		// If we are loading an old test, don't bother trying to update next time
		if (new Date() - new Date($scope.start_time) >= 1000*60 && $scope.updateDelay != 0) {
			$scope.updateDelay = 0;
			$scope.changedUpdateDelay();
		}
		angular.forEach ($scope.chartsToShow, function (obj, index) {
			console.log("Updating chart" + index);
			$http.get('/api/reading/run/' + $scope.run_id + '/sensor/' + obj.sensor_id)
			.then (function success (response) {
				//console.log(JSON.stringify(response.data[0]));
				console.log("Got data for chart" + index);
				if ($scope.charts[index]) {
					$scope.charts[index].destroy();
				}
				var ctx = document.getElementById("chart" + index);
				var chart = new Chart (ctx, {
					type: 'line',
					data: {
						datasets: [{
							label: $scope.chartsToShow[index].units,
							borderColor: "rgba(51, 153, 255, 1)",
							backgroundColor: "rgba(153, 204, 255, 1)",
							data: response.data[0]
						}]
					},
					options: {
						scales: {
							xAxes: [{
								type: 'linear',
								position: 'bottom',
								scaleLabel: {
									display: true,
									labelString: 'Time'
								}
							}],
							yAxes: [{
								scaleLabel: {
									display: true,
									labelString: 'Reading'
								}
							}]
						},
						animation: {
							duration: 0
						}
					}
				});
				chart.update();
			}, function failure (response) {
				console.error("Failed to get readings for sensor " + obj.sensor_id + " in run " + $scope.run_id);
				console.error(JSON.stringify(response));
			});
		});
	};
	
	$scope.changedUpdateDelay = function () {
		if ($scope.run_id != '') {// If we are currently displaying results
			if ($scope.timer) {// If the timer exists, clear it
				clearInterval($scope.timer);
				$scope.timer = null;
			}
			$scope.updateCharts();// kick off updates
			if ($scope.updateDelay != 0) {
				$scope.timer = setInterval(function() {
					$scope.updateCharts();
					$scope.getErrors();
				}, $scope.updateDelay);// Create timer
			}
		}
	};
});
