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

	}


	generate(){
		// import
		let ChartjsNode = require('chartjs-node');

		// réglage de la taille de l'image générée
		let chartNode = new ChartjsNode(600, 600);


		let chartJsOptions = {
         type: 'line',
  data: {
    labels: ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],
    datasets: [{ 
        data: [this.lundi,this.mardi,this.mercredi,this.jeudi,this.vendredi,this.samedi,this.dimanche],
        borderColor: "yellow",
        fill: false
      }
    ]
  },
  options: {

    title: {
      display: true,
      text: this.label
    },  
     legend: {
            display: false
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
            return chartNode.writeImageToFile('image/png', './testimage.png');
        })
        .then(() => {
 
            chartNode.destroy();
            // le return 1 permet de sortir de la génération et revenir a la boucle du bot
            return 1;
        });
    }









}