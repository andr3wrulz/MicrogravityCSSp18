angular.module('myApp', [])

.controller('myCtrl', function($scope, $http, $timeout) {
	$scope.run_ids = [];
	$scope.charts = [];
	$scope.showCharts = false;
	$scope.showErrors = false;

	$scope.getRuns = function () {
		console.log("Getting list of runs.");
		$http.get('/api/runwithtimes')
		.then(function success (response) {
			console.log("Got run list successfully.");
			console.log(JSON.stringify(response.data.data[0]));
			$scope.runs = response.data.data[0];
		}, function failure (response) {
			console.error("Failed to get run list.");
		});
	};

	$scope.getErrors = function () {
		console.log("Getting errors associated with selected runs");
		$scope.errors = [];
		angular.forEach($scope.run_ids, function (run, runIndex) {
			$http.get('/api/runerror/runwithdetails/' + run)
			.then(function success (response) {
				console.log(JSON.stringify(response.data.data[0]));
				angular.forEach(response.data.data[0], function (error, errorIndex) {
					$scope.errors.push(error);
				});
			}, function failure (response) {
				console.error("Unable to retrieve errors for run " + run);
			});
		});
		$timeout(function () {
			$scope.showErrors = $scope.errors.length != 0;
		}, 150);
	};
			
	$scope.getSensors = function () {
		$scope.sensors = [];
		angular.forEach($scope.run_ids, function (obj, index) {
			console.log("Trying to get sensors for run " + obj);
			$http.get("api/reading/getsensorsinrun/" + obj)
			.then(function mySuccess(response) {
				$scope.sensors[index] = response.data;
				//console.log("Refreshed sensors list");
				//console.log(JSON.stringify($scope.sensors[index]));
				$scope.updateSensorList();
			}, function myFailure (response) {
				console.log("Could not get sensors for run " + obj);
			})
		});
		$timeout(function () {
			// Hide charts if we have no sensors
			$scope.showCharts = $scope.sensors.length != 0;
		},150);
	};

	$scope.updateSensorList = function () {
		//console.log("Updating sensor list");
		$scope.sensorList = [];

		// Add missing sensors to list
		angular.forEach($scope.sensors, function (obj, index) {// For each run's sensors list
			angular.forEach(obj, function (obj2, index2) {// For each sensor in each sensor list
				if (!$scope.sensorList.some(sensor => sensor.sensor_id === obj2.sensor_id)) {
					$scope.sensorList.push(obj2);
				}
			});
		});

		// Give sensor in list indexes
		angular.forEach($scope.sensorList, function (obj, index) {
			obj.index = index;
		});

		console.log("Sensor list:");
		console.log(JSON.stringify($scope.sensorList));
		$scope.getData();
	};

	$scope.getData = function () {
		console.log("Building reading data");
		$scope.chartData = [];// [sensorList index][run_ids index]
		angular.forEach($scope.sensorList, function (sensor, sensorIndex) {
			$scope.chartData[sensorIndex] = [];
			angular.forEach($scope.run_ids, function (run, runIndex) {// run is just the run_id not an object
				$http.get('/api/reading/run/' + run + '/sensor/' + sensor.sensor_id)
				.then(function success (response) {
					//console.log(JSON.stringify(response.data[0]));
					$scope.chartData[sensorIndex][runIndex] = response.data[0];
				}, function failure (response) {
					console.error("Failed to get readings for run: " + run + " sensor: " + sensor.sensor_id);
				});
			});
		});
		$timeout(function () {// try and wait out the http requests
			$scope.updateCharts();
		}, 500);
	};
		
	$scope.selectRun = function (run_id) {
		console.log("Clicked on run_id " + run_id);
		if ($scope.run_ids.includes(run_id)) {// If it was selected, remove it
			var index = $scope.run_ids.indexOf(run_id);
			$scope.run_ids.splice(index, 1);// Remove 1 element at the index, ie, remove the element
		} else {// If it wasn't selected, add it
			$scope.run_ids.push(run_id);
		}
		$scope.getSensors();
		$scope.getErrors();
	}

	$scope.updateCharts = function () {
		angular.forEach ($scope.sensorList, function (sensor, sensorIndex) {
			console.log("Updating chart" + sensorIndex);

			if ($scope.charts[sensorIndex]) {// Destroy the existing chart if needed
				$scope.charts[sensorIndex].destroy();
			}

			// Generate new data array
			var newData = [];
			angular.forEach($scope.run_ids, function (run, runIndex) {
				//console.log("data["+sensorIndex+"]["+runIndex+"] = " + JSON.stringify($scope.chartData[sensorIndex][runIndex]));
				var r = Math.round(Math.random() * 150 + 50);// Min 50, max 200
				var g = Math.round(Math.random() * (200 - r) + 50);// min 50, max 200
				var b = Math.round(Math.random() * (200 - r) + 50);// min 50, max 200
				var color = "rgba(" + r + ", " + g + ", " + b + ", 1)";
				var color2 = "rgba(" + (r-50) + ", " + (g-50) + ", " + (b-50) + ", 0.4)";
				//console.log("color: " + color + " color2: " + color2);
				newData.push({
					label: 'Run ' + run,
					borderColor: color,
					backgroundColor: color2,
					data: $scope.chartData[sensorIndex][runIndex]
				});
			});

			var ctx = document.getElementById("chart" + sensorIndex);
			var chart = new Chart (ctx, {
				type: 'line',
				data: {
					datasets: newData
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
								labelString: 'Reading (' + sensor.units + ')'
							}
						}]
					},
					animation: {
						duration: 0
					}
				}
			});
			$scope.charts.push(chart);
		});
	};
});
