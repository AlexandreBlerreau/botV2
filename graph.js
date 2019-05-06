module.exports = class Graph {


	constructor(lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche,label){
		// ce sont obligatoirement des entiers
		// penser a les alimenter depuis la base 
		this.lundi = lundi;
		this.mardi = mardi;
		this.mercredi = mercredi;
		this.jeudi = jeudi;
		this.vendredi = vendredi;
		this.samedi = samedi;
		this.dimanche = dimanche;

		// label est juste la description du graph (nbArret,MinutesTotales....)
		this.label = label;
    this.plugin = { beforeDraw: function(chartInstance) {
    var ctx = chartInstance.chart.ctx;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
  }};

	}

// generation du graph et export un jgp
	generate(){
		// import
		let ChartjsNode = require('chartjs-node');
    let bg = require('chartjs-plugin-background');
		// réglage de la taille de l'image générée
		let chartNode = new ChartjsNode(800, 600);


    chartNode.on('beforeDraw', function(Chart){

      Chart.plugins.register({
  beforeDraw: function(chartInstance) {
    var ctx = chartInstance.chart.ctx;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
  }
});
    });


		let chartJsOptions = {
         type: 'line',
  data: {
    labels: ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],
    datasets: [{ 
        data: [this.lundi,this.mardi,this.mercredi,this.jeudi,this.vendredi,this.samedi,this.dimanche],
        borderColor: "yellow",
        fill: false,
        steppedLine: false,
        backgroundColor : "white"
      }
    ]
  },
  options: { 
    title: {
      display: true,
      text: this.label,
      fontColor: 'black',
      fontStyle: "bold"
    },  
     legend: {
            display: false
    },
    scales: {
      xAxes: [{
       ticks: {
                    fontColor: 'black',
                    fontStyle: "bold"
                },
        
        gridLines: {
          color: 'black',
          lineWidth: 1,
          
        }
      }],
      yAxes: [{
       ticks: {
                    fontColor: 'black',
                    fontStyle: "bold"
                },
        gridLines: {
          color: 'black',
          lineWidth: 1
        }
      }]
    },
    


  }
};



        return chartNode.drawChart(chartJsOptions)
        .then(() => {
            return chartNode.getImageBuffer('image/png');
        })
        .then(buffer => {
            Array.isArray(buffer) // => true
            
            return chartNode.getImageStream('image/png');
        })
        .then(streamResult => {
        
           
            // écriture de l'image
            return chartNode.writeImageToFile('image/jpg', './graph-' + this.label + '.jpg');
        })
        .then(() => {
 
            chartNode.destroy();
            // le return 1 permet de sortir de la génération et revenir a la boucle du bot
            return 1;
        });
    }









}