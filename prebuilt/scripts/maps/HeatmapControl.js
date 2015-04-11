'use strict'
var heatmapInstance;

function HeatmapController($scope) 
{
	$scope.calInit = {
		calWeek: 1
	}
	
	$scope.calWeeks = [
		{value: '1', displayName: '1'},{value: '2', displayName: '2'},
		{value: '3', displayName: '3'},{value: '4', displayName: '4'},
		{value: '5', displayName: '5'},{value: '6', displayName: '6'},
		{value: '7', displayName: '7'},{value: '8', displayName: '8'},
		{value: '9', displayName: '9'},{value: '10', displayName: '10'},
		{value: '11', displayName: '11'},{value: '12', displayName: '12'},
		{value: '13', displayName: '13'},{value: '14', displayName: '14'},
		{value: '15', displayName: '15'},{value: '16', displayName: '16'},
		{value: '17', displayName: '17'},{value: '18', displayName: '18'},
		{value: '19', displayName: '19'},{value: '20', displayName: '20'},
		{value: '21', displayName: '21'},{value: '22', displayName: '22'},
		{value: '23', displayName: '23'},{value: '24', displayName: '24'},
		{value: '25', displayName: '25'},{value: '26', displayName: '26'},
		{value: '27', displayName: '27'},{value: '28', displayName: '28'},
		{value: '29', displayName: '29'},{value: '30', displayName: '30'},
		{value: '31', displayName: '31'},{value: '32', displayName: '32'},
		{value: '33', displayName: '33'},{value: '34', displayName: '34'},
		{value: '35', displayName: '35'},{value: '36', displayName: '36'},
		{value: '37', displayName: '37'},{value: '38', displayName: '38'},
		{value: '39', displayName: '39'},{value: '40', displayName: '40'},
		{value: '41', displayName: '41'},{value: '42', displayName: '42'},
		{value: '43', displayName: '43'},{value: '44', displayName: '44'},
		{value: '45', displayName: '45'},{value: '46', displayName: '46'},
		{value: '47', displayName: '47'},{value: '48', displayName: '48'},
		{value: '49', displayName: '49'},{value: '50', displayName: '50'},
		{value: '51', displayName: '51'},{value: '52', displayName: '52'}
	]
	
	$scope.calInit.calWeek = $scope.calWeeks[0].value;
	
	$scope.updateHeatmap = function(id) {
		
		var updatedPoints = getPoints(id.value);
		var data = {
			max: 4,
			data: updatedPoints
		};
		
		heatmapInstance.setData(data);
		heatmapInstance.repaint();
	}
	
	angular.element(document).ready(function () {
		initializeHeatmap();
	});
}

/**
 * Initializes the heatmap
 */
function initializeHeatmap()
{
	// create configuration object
	var config = {
  		container: document.getElementById('map-canvas'),
        radius: 50
	};

	// create heatmap with configuration
	heatmapInstance = h337.create(config);

    // generate dummy values
	var points = getPoints(1);
	
	// heatmap data format
	var data = { 
  		max: 4, 
  		data: points
	};
	heatmapInstance.setData(data);
}

/**
 * Gets the required data to render heatmap from JSON-URL
 *
 * @param weekNumber Number of the week in relation to the timestamp of the points
 */
function getPoints(weekNumber)
{
    var points = [];
    var heatmapAPI = "http://demo.storeanalytics.org/api/heatmap/";
    
    $.ajax(
    {
        url: heatmapAPI,
        async: false,
        dataType: "json",
        success: function(data) 
        {
            for(var i = 0; i < data.length; i++) 
            {
				var weekNr = getWeekNumber(data[i].timestamp);
				
				if(weekNr[1] == weekNumber)
				{
                	var point = 
                	{
    		        	x: parseInt(data[i].x_coordinate*(data[i].x_coordinate%50)),
    		        	y: parseInt(data[i].y_coordinate*(data[i].x_coordinate%50)),
    		        	value: i%5
	            	};
                	points.push(point);
				}
            }
        }
    });    
    return points;
}

/**
 * Calculates current week and year from given date
 *
 * @param d Date to convert
 * @return Year of date, week in year of date
 */
function getWeekNumber(d) 
{
    d = new Date(+d);
    d.setHours(0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    
    var yearStart = new Date(d.getFullYear(), 0, 1);
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    
    return [d.getFullYear(), weekNo];
}