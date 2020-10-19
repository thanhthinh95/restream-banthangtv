
!function($) {
    "use strict";
  
    var FlotChart = function() {
        this.$body = $("body")
        this.$realData = []
    };
  
    //creates Pie Chart
    FlotChart.prototype.createPieGraph = function(selector, labels, datas, colors) {
        var data = [{
            label: labels[0],
            data: datas[0]
        }, {
            label: labels[1],
            data: datas[1]
        }, {
            label: labels[2],
            data: datas[2]
        }];
        var options = {
            series: {
                pie: {
                    show: true
                }
            },
            legend : {
        show : true
      },
      grid : {
        hoverable : true,
        clickable : true
      },
      colors : colors,
      tooltip : true,
      tooltipOpts : {
        content : "%s, %p.0%"
      }
        };
  
        $.plot($(selector), data, options);
    },
  
    
    //creates Pie Chart
    FlotChart.prototype.createDonutGraph = function(selector, labels, datas, colors) {
        var data = [{
            label: labels[0],
            data: datas[0]
        }, {
            label: labels[1],
            data: datas[1]
        }, {
            label: labels[2],
            data: datas[2]
        },
        {
            label: labels[3],
            data: datas[3]
        }, {
            label: labels[4],
            data: datas[4]
        }
        ];
        var options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.7
                }
            },
            legend : {
        show : true,
        labelFormatter : function(label, series) {
          return '<div style="font-size:14px;">&nbsp;' + label + '</div>'
        },
        labelBoxBorderColor : null,
        margin : 50,
        width : 20,
        padding : 1
      },
      grid : {
        hoverable : true,
        clickable : true
      },
      colors : colors,
      tooltip : true,
      tooltipOpts : {
        content : "%s, %p.0%"
      }
        };
  
        $.plot($(selector), data, options);
    },
  
        //initializing various charts and components
        FlotChart.prototype.init = function() {
          //Pie graph data
          var pielabels = ["Completed","Uncomplete","Error"];
          var colors = ['#28a745', '#4ac7ec', "#f1646c"];
          this.createPieGraph("#pie-chart #pie-chart-container", pielabels , datas, colors);
        },
    //init flotchart
    $.FlotChart = new FlotChart, $.FlotChart.Constructor = FlotChart
  
  }(window.jQuery),
  
  //initializing flotchart
  function($) {
    "use strict";
    if(datas) $.FlotChart.init()
  }(window.jQuery);