
$(function(){
    var refVal = -1;
    var queryVals = [];
    var queryString = "";
    var resultFiles = [];
    var data = [];
    var alreadyFetched = {};
    var placeholder = $("#placeholder");
    var options = {
        legend: {
            show: true,
            container: $("#overviewLegend")
        },
        series: {
            lines: {
                show: false
            },
            points: {
                show: true
            },
            shadowSize: 0
        },
        grid: {
            hoverable: true,
            clickable: true
        },
        xaxis: {
            zoomRange: [0, 3000000],
            panRange: [0, 3000000]
        },
        yaxis: {
            zoomRange: [0, 3000000],
            panRange: [0, 3000000]
        },
        /*     selection: {
         mode: "xy"
         },*/
        zoom: {
            interactive: true
        },
        pan: {
            interactive: true
        }
    };
    
    var plot = $.plot(placeholder, data, options);
    
    /*        // setup overview
     var overview = $.plot($("#overview"), data, {
     legend: {
     show: true,
     container: $("#overviewLegend")
     },
     series: {
     lines: {
     show: true,
     lineWidth: 1
     },
     shadowSize: 0
     },
     xaxis: {
     ticks: 4
     },
     yaxis: {
     ticks: 3,
     min: -2,
     max: 2
     },
     grid: {
     color: "#999"
     },
     selection: {
     mode: "xy"
     }
     });
     
     $("#placeholder").bind("plotselected", function(event, ranges){
     // clamp the zooming to prevent eternal zoom
     if (ranges.xaxis.to - ranges.xaxis.from < 0.00001)
     ranges.xaxis.to = ranges.xaxis.from + 0.00001;
     if (ranges.yaxis.to - ranges.yaxis.from < 0.00001)
     ranges.yaxis.to = ranges.yaxis.from + 0.00001;
     
     // do the zooming
     plot = $.plot($("#placeholder"), getData(ranges.xaxis.from, ranges.xaxis.to), $.extend(true, {}, options, {
     xaxis: {
     min: ranges.xaxis.from,
     max: ranges.xaxis.to
     },
     yaxis: {
     min: ranges.yaxis.from,
     max: ranges.yaxis.to
     }
     }));
     
     // don't fire event on the overview to prevent eternal loop
     overview.setSelection(ranges, true);
     });
     $("#overview").bind("plotselected", function(event, ranges){
     plot.setSelection(ranges);
     });
     */
    $(document).ready(function(){
        $.ajax({
            url: 'http://localhost:9876/getOrg',
            dataType: "html",
            jsonpCallback: "_callback",
            cache: false,
            timeout: 5000,
            success: function(data){
                $('select').append(data);
                /*$("select").custSelectBox({
                 selectwidth: "auto"
                 });*/
                $("#referenceSelect").change(onReferenceChange);
                $("#querySelect").change(onQueryChange); //check asmselect do
                /*
                 a$.NO_SELECTION = 'No selection'; // TEXT for 'No selection' when nothing selected
                 a$.SELECTED = 'Options selected'; // TEXT for 'XX Options selected' when over 1 selected
                 a$.SELECT_ALL = 'Select All'; // TEXT for 'Select All' for checkboxes
                 a$.SelectAllMin = 6; // minimum number of options needed to show 'Select All'
                 a$.WhenToUse = 'class'; // class | multiple | all : for how to make selects become multiselects
                 a$.msSeparator = '|'; // separator for values (can be multiple characters)
                 */
                /*  $("select[multiple]").asmSelect({
                 addItemTarget: 'bottom',
                 animate: true,
                 highlight: true,
                 sortable: true
                 });*/
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
    });
    
    function onReferenceChange(){
        var selected = $("#referenceSelect option:selected");
        var output = "";
        
        /*
         $("#flag").append("hello");
         $('.asmListItemLabel').each(function(i, selected){
         $("#flag").append(selected.text);
         });
         */
        if (selected.val() != -1) {
            output = "You selected " + selected.val();
            refVal = selected.val();
            if (queryVals.length >= 1) //If there are query values selected already...
            {
                //Don't allow users to select the same values for reference/query.
                for (var i in queryVals) {
                    //$("#flag").text("Queryval: " + queryVals[i] + "::: Ref:" + refVal + '\n');                                
                    if (refVal == queryVals[i]) {
                        $('#querySelect :selected').each(function(i, selected){
                            var selectedVal = $(selected).val();
                            if (selectedVal == refVal) {
                                var selectedText = $(selected).text();
                                alert(selectedText + " selected as reference.  Removed from query set.");
                                $(selected).removeAttr("selected");
                                queryVals.splice(i, 1)
                            }
                        });
                    }
                }
                
                //In case the last query element is removed by the above code.
                if (queryVals.length >= 1) {
                
                
//                    fetchData();
					pollData();
                }
            }
        }
    }
    
    //Not currently using this.  Returns maximum value of the selected reference sequence.
    function getRefRange(){
        $.ajax({
            url: 'http://localhost:9876/getRefRange?reference=' + refVal,
            dataType: "html",
            jsonpCallback: "_callback",
            cache: false,
            timeout: 5000,
            success: function(data){
                //$("#flag").append(data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error ' + textStatus + " " + errorThrown);
            }
        });
    }
    
    function onQueryChange(){
        queryVals = [];
        $('#querySelect :selected').each(function(i, selected){
            var selectedVal = $(selected).val();
            if (selectedVal >= 1) //Only accept valid values.
            {
                if (selectedVal == refVal) {
                    var selectedText = $(selected).text();
                    alert(selectedText + " cannot be selected as both reference and query.");
                    $(selected).removeAttr("selected");
                }
                else {
                    queryVals[i] = selectedVal;
                    var val = queryVals[i];
                }
            }
            
        });
        if (refVal != -1 && queryVals.length >= 1) //If there is a valid reference selected already...
        {
//            fetchData();
			pollData();
        }
    }
    /*
     function onQueryChange(){
     queryVals = [];
     $("#flag").append("hello");
     $('#asmSelect0 > option :selected').each(function(i, selected){
     var selectedVal = $(selected).val();
     $("#flag").append(selectedVal);
     if (selectedVal >= 1) //Only accept valid values.
     {
     if (selectedVal == refVal) {
     var selectedText = $(selected).text();
     alert(selectedText + " cannot be selected as both reference and query.");
     $(selected).removeAttr("selected");
     }
     else {
     queryVals[i] = selectedVal;
     var val = queryVals[i];
     }
     }
     
     });
     if (refVal != -1 && queryVals.length >= 1) //If there is a valid reference selected already...
     {
     fetchData();
     }
     }
     */
    function buildQueryString(){
        //$("#flag").text("Running buildQueryString: ");
        //$("#flag").append('<br />');
        queryString = "?reference=" + refVal;
        
        for (var i in queryVals) {
            //$("#flag").append("loop " + i + "val: " + queryVals[i]);
            queryString = queryString + "&qry=" + queryVals[i];
        }
        //alert(queryString);
    }
    
    function pollData(reRun){
		buildQueryString();
		getRefRange();
		alert(queryString);
        $.ajax({
            url: 'http://localhost:9876/pollFetch' + queryString,
			data : {},
            cache: false,
            timeout: 5000,
            success: function(data){
   				//$("#flag").append("Loaded " + data + ".");
				receiveData();
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error ' + textStatus + " " + errorThrown);
            }
            
        });
    }
	
	function receiveData()
	{
		/*$.get('http://localhost:9876/returnVals', receiveData)
		$("#flag").append("Loaded " + data + ".");
		*/
		 $.ajax({
            url: 'http://localhost:9876/returnVals',
			data : {},
            cache: false,
            timeout: 5000,
            success: function(data){
   				$("#flag").append("Loaded " + data + ".");
				receiveData();
				return false;
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error ' + textStatus + " " + errorThrown);
            }
            
        });
	}
	
    function fetchData(){
        buildQueryString();
        getRefRange();
        $.ajax({
            url: 'http://localhost:9876/fetchData' + queryString,
            dataType: "html",
            jsonpCallback: "_callback",
            cache: false,
            timeout: 5000,
            success: function(data){
                var substring = data.substring(data.indexOf("'") + 1, data.lastIndexOf("'"));
                resultFiles = substring.split(",");
                clearPlot();
                for (var i in resultFiles) {
                    $.ajax({
                        url: "http://localhost:9876/getJSON?file=" + resultFiles[i],
                        method: 'GET',
                        dataType: 'json',
                        success: function(data){
                            //sleep(500);
                            onDataReceived(data);
                            //$("#flag").append("Loaded " + data.label + ".");
                            // $("#flag").append("<br />");
                            var x = 0;
                            /*while (x < 10) {
                             pollQuery();
                             x--;
                             }*/
                        }
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error ' + textStatus + " " + errorThrown);
            }
            
        });
    }
    
    function pollQuery(){
        /*
        
        
         $.ajax({
        
        
         url: 'http://localhost:9876/pollFetch',
        
        
         dataType: "text/html",
        
        
         cache: false,
        
        
         timeout: 5000,
        
        
         success: function(data){
        
        
         $("#flag").append(data);
        
        
         },
        
        
         error: function(jqXHR, textStatus, errorThrown){
        
        
         alert('error ' + textStatus + " " + errorThrown);
        
        
         }
        
        
         });
        
        
         */
        
        
    }
    
    
    function sleep(ms){
        var dt = new Date();
        dt.setTime(dt.getTime() + ms);
        while (new Date().getTime() < dt.getTime()) 
            ;
    }
    
    $("input").click(function(){
        var plot = $.plot(placeholder, data, options);
    });
    
    function clearPlot(){
        $("#flag").html("");
        $("#clickdata").html("");
        data = [];
        $.plot(placeholder, data, options);
    }
    
    function onDataReceived(series){
        //$("#flag").html("Loaded " + series.label + ".<br />");
        /*if(!alreadyFetched[series.label]){
         alreadyFetched[series.label] = true;
         data.push(series);
         }*/
        data.push(series);
        $.plot(placeholder, data, options);
    }
    
    function showTooltip(x, y, contents){
        $('<div id="tooltip">' + contents + '</div>').css({
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#fee',
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }
    
    var previousPoint = null;
    $("#placeholder").bind("plothover", function(event, pos, item){
        //$("#x").text(pos.x.toFixed(0));
        //$("#y").text(pos.y.toFixed(0));
        
        if (item) {
            if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;
                
                $("#tooltip").remove();
                var x = item.datapoint[0].toFixed(0), y = item.datapoint[1].toFixed(0);
                
                showTooltip(item.pageX, item.pageY, item.series.label + ": " + x + ", " + y);
            }
        }
        else {
            $("#tooltip").remove();
            previousPoint = null;
        }
        
    });
    
    $("#placeholder").bind("plotclick", function(event, pos, item){
        if (item) {
            $("#clickdata").append("<br />");
            $("#clickdata").append(item.series.label + ": " + item.datapoint[0] + "," + item.datapoint[1]);
            //plot.highlight(item.series, item.datapoint);  //Doesn't work with zoom right now. Fix this.
        }
    });
    
    
    // show pan/zoom messages to illustrate events 
    placeholder.bind('plotpan', function(event, plot){
        var axes = plot.getAxes();
        /* $(".message").html("Panning to x: " + axes.xaxis.min.toFixed(2) +
         " &ndash; " +
         axes.xaxis.max.toFixed(2) +
         " and y: " +
         axes.yaxis.min.toFixed(2) +
         " &ndash; " +
         axes.yaxis.max.toFixed(2));*/
    });
    
    placeholder.bind('plotzoom', function(event, plot){
        var axes = plot.getAxes();
        /*  $(".message").html("Zooming to x: " + axes.xaxis.min.toFixed(2) +
         " &ndash; " +
         axes.xaxis.max.toFixed(2) +
         " and y: " +
         axes.yaxis.min.toFixed(2) +
         " &ndash; " +
         axes.yaxis.max.toFixed(2));*/
    });
    
    
    // and add panning buttons
    
    // little helper for taking the repetitive work out of placing
    // panning arrows
    function addArrow(dir, right, top, offset){
        $('<img class="button" src="http://localhost:9876/getImg?include=arrow-' + dir + '.gif" style="right:' + right + 'px;top:' + top + 'px">').appendTo(placeholder).click(function(e){
            e.preventDefault();
            plot.pan(offset);
        });
    }
    /*     
     addArrow('left', 44, 231, {
     left: -100
     });
     addArrow('right', 16, 231, {
     left: 100
     });
     addArrow('up', 30, 215, {
     top: -100
     });
     addArrow('down', 30, 245, {
     top: 100
     });
     */
});
