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
        "type": "ligne",
        "data": {
    		"labels": [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],

    		"datasets": [{ 
       	 	"data": [86,114,106,106,107,111,133,221,783,2478],
        	"label": "Africa",
        	"borderColor": "#3e95cd",
        	"fill": false
   
        }]
      }
    };

        return chartNode.drawChart(chartJsOptions)
        .then(() => {
            return chartNode.getImageBuffer('image/png');
        })
        .then(buffer => {
            Array.isArray(buffer) // => true
            // as a stream
            return chartNode.getImageStream('image/png');
        })
        .then(streamResult => {
            // using the length property you can do things like
            // directly upload the image to s3 by using the
            // stream and length properties
            streamResult.stream // => Stream object
            streamResult.length // => Integer length of stream
            // write to a file
            return chartNode.writeImageToFile('image/png', './testimage.png');
        })
        .then(() => {
            chartNode.destroy();
        });
    }









}