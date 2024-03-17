let lastSelectedCountry = 'United Kingdom';

// Chart1
function updateLineChart1(countryName, selectedDate) {
    lastSelectedCountry = countryName;
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(d =>
                d.name === countryName && new Date(d.Date) >= new Date("2020-01-22") && new Date(d.Date) <= new Date(selectedDate)
            );
            const transformedData = filteredData.map(d => ({
                Date: d.Date,
                New_cases: d.New_cases,
                New_deaths: d.New_deaths,
                New_recovered: d.New_recovered
            }));
            var lineChartSpec = {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                description: 'A chart showing New_cases, New_deaths, and New_recovered over time.',
                width: 360,
                height: 270,
                data: { values: transformedData },
                transform: [
                    {
                        fold: ["New_cases", "New_deaths", "New_recovered"],
                        as: ["Category", "Amount"]
                    }
                ],
                mark: 'line',
                encoding: {
                    x: {field: 'Date', type: 'temporal', title: 'Date', axis: {labelFont: 'Times New Roman',labelFontSize: 12}},
                    y: {field: 'Amount', type: 'quantitative', title: 'Cases', axis: {labelFont: 'Times New Roman',labelFontSize: 12}},
                    color: {
                        field: 'Category',
                        type: 'nominal',
                        scale: {domain: ["New_cases", "New_recovered", "New_deaths"],
                        range: ["rgb(242, 165, 132)", "rgb(71, 146, 196)", "rgb(177, 24, 45)"]},
                        legend: {title: 'Category', labelFont: 'Times New Roman',labelFontSize: 12}}
                }
            };
            vegaEmbed('#chart1', lineChartSpec, {"actions": false}).then(function(result) {
                lineChartView = result.view;
            }).catch(console.error);
        })
        .catch(error => console.error('Failed to load data:', error));

}
// Chart2
function updateLineChart2(countryName, selectedDate) {
    lastSelectedCountry = countryName;
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(d =>
                d.name === countryName && new Date(d.Date) >= new Date("2020-01-22") && new Date(d.Date) <= new Date(selectedDate)
            );
            const transformedData = filteredData.map(d => ({
                Date: d.Date,
                Confirmed: d.Confirmed,
                Deaths: d.Deaths,
                Recovered: d.Recovered
            }));
            var lineChartSpec = {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                description: 'A line chart showing confirmed, recovered, and deaths over time.',
                width: 360,
                height: 270,
                data: { values: transformedData },
                transform: [
                    {
                        fold: ["Confirmed", "Deaths", "Recovered"],
                        as: ["Category", "Amount"]
                    }
                ],
                mark: 'line',
                encoding: {
                    x: {field: 'Date', type: 'temporal', title: 'Date', axis: {labelFont: 'Times New Roman',labelFontSize: 12}},
                    y: {field: 'Amount', type: 'quantitative', title: 'Cases', axis: {labelFont: 'Times New Roman',labelFontSize: 12}},
                    color: {
                    field: 'Category',
                    type: 'nominal',
                    scale: {domain: ["Confirmed", "Recovered", "Deaths"],
                    range: ["rgb(242, 165, 132)", "rgb(71, 146, 196)", "rgb(177, 24, 45)"]}, legend: {title: 'Category',labelFont: 'Times New Roman',labelFontSize: 12}}
                }
            };
            vegaEmbed('#chart2', lineChartSpec, {"actions": false}).then(function(result) {
                lineChartView = result.view;
            }).catch(console.error);
        })
        .catch(error => console.error('Failed to load data:', error));

}

// map
function updateMap(defaultDate) {
  var myChart = echarts.init(document.getElementById('map'));
  fetch('data.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (jsonData) {
        var filteredData = jsonData.filter(function (item) {
            return item.Date === defaultDate;
        }).map(function (item) {
            return {
              name: item.name,
              value: item.Confirmed,
              New_cases: item.New_cases,
              New_deaths: item.New_deaths,
              New_recovered: item.New_recovered
            };
        });

        var option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var toolTiphtml = params.name;
                    var newCases = params.data.New_cases ?? 'No data available';
                    var newDeaths = params.data.New_deaths ?? 'No data available';
                    var newRecovered = params.data.New_recovered ?? 'No data available';
                    toolTiphtml += '<br/>New cases: ' + newCases;
                    toolTiphtml += '<br/>New recovered: ' + newRecovered;
                    toolTiphtml += '<br/>New deaths: ' + newDeaths;
                    return toolTiphtml;
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            visualMap: {
                show: true,
                left: 'left',
                top: 'bottom',
                seriesIndex: [0],
                type: 'piecewise',
                pieces: [
                    {min: 1000000, color: 'rgb(143, 0, 0)'},
                    {min: 500000, max: 999999, color: 'rgb(187, 0, 0)'},
                    {min: 200000, max: 499999, color: 'rgb(227, 23, 13)'},
                    {min: 100000, max: 199999, color: 'rgb(252, 69, 69)'},
                    {min: 50000, max: 99999, color: 'rgb(252, 157, 154)'},
                    {min: 0, max: 49999, color: 'rgb(254, 224, 215)'}
                ],
                textStyle: {
                    color: '#000'
                }
            },
            geo: {
                show: true,
                map: 'world',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false,
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#F6F6F6',
                        borderColor: '#666666',
                    },
                    emphasis: {
                        areaColor: '#B1D0EC',
                    }
                }

            },
            series: [
                {
                    type: 'map',
                    map: 'world',
                    geoIndex: 0,
                    animation: false,
                    data: filteredData
                }
            ]
        };
        myChart.setOption(option);
        myChart.on('click', function (params) {
            if (params.componentType === 'series') {
                const selectedDate = document.getElementById('datePicker').value;
                updateLineChart1(params.name, selectedDate);
                updateLineChart2(params.name, selectedDate);
                updateNoSection(params.name, selectedDate);
                lastSelectedCountry = params.name;
            }
        });
        window.addEventListener('resize', function () {
            var mapContainer = document.getElementById('map');
            var mapHeight = mapContainer.offsetHeight;
            var viewportHeight = window.innerHeight;
            var verticalOffset = -(viewportHeight - mapHeight) / 3;
            mapContainer.style.top = verticalOffset + 'px';
            myChart.resize();
        });

    });
};

function updateNoSection(countryName, date) {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const countryData = data.find(item => item.name === countryName && item.Date === date);
      if (countryData) {
        document.querySelectorAll('.no-bd')[0].querySelector('ul li:nth-child(1)').textContent = countryData.New_cases;
        document.querySelectorAll('.no-bd')[0].querySelector('ul li:nth-child(2)').textContent = countryData.New_recovered;
        document.querySelectorAll('.no-bd')[0].querySelector('ul li:nth-child(3)').textContent = countryData.New_deaths;
        document.querySelectorAll('.no-bd')[1].querySelector('ul li:nth-child(1)').textContent = countryData.Confirmed;
        document.querySelectorAll('.no-bd')[1].querySelector('ul li:nth-child(2)').textContent = countryData.Recovered;
        document.querySelectorAll('.no-bd')[1].querySelector('ul li:nth-child(3)').textContent = countryData.Deaths;
      } else {
        console.log('No data found for', countryName, 'on', date);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}

// default
document.addEventListener('DOMContentLoaded', function() {
    const datePicker = document.getElementById('datePicker');
    const defaultDate = datePicker.value;
    updateLineChart1('United Kingdom',defaultDate);
    updateLineChart2('United Kingdom',defaultDate);
    updateNoSection('United Kingdom',defaultDate);
    updateMap(defaultDate);

    datePicker.addEventListener('change', function(e) {
        const selectedDate = e.target.value;
        updateMap(selectedDate);
        updateLineChart1(lastSelectedCountry, selectedDate);
        updateLineChart2(lastSelectedCountry, selectedDate);
        updateNoSection(lastSelectedCountry, selectedDate);
    });
});
