var ctx = document.getElementById("skill-horizontalBar").getContext('2d');
// var myLineChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: ["January", "February", "March", "April", "May", "June", "July"],
//         datasets: [
//         {
//             label: "My First dataset",
//             data: [0, 65, 45, 65, 35, 65, 0],
//             backgroundColor: '#AD35BA',
//             borderColor: [
//             '#AD35BA',
//             ],
//             borderWidth: 2,
//             pointBorderColor: "#fff",
//             pointBackgroundColor: "rgba(173, 53, 186, 0.1)",
//         }
//         ]
//     },
//     options: {
//         responsive: true
//     }
//     });

var myChart = new Chart(ctx, {
        "type": "horizontalBar",
        "data": {
        "labels": ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Grey"],
        "datasets": [{  
        "label": "My First Dataset",
        "data": [22, 33, 55, 12, 86, 23, 14],
        "fill": false,
        "backgroundColor": ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)"
        ],
        "borderColor": ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)",
        "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)"
        ],
        "borderWidth": 1
        }]
        },
        "options": {
        "scales": {
        "xAxes": [{
        "ticks": {
        "beginAtZero": true
        }
        }]
        }
        }
        });