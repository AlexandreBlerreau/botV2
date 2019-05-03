// Constantes de detection d'arret ou de reprise
const ligne1Stop = "Ligne 1 interrompue j";
const ligne1AutreStop = "Ligne 1 interrompue e" // intéruption entre station
const ligne1Start = "Reprise de la ligne 1";
let dateOfDay = new Date();
let dateOfDayId = `${dateOfDay.getDate()}/${dateOfDay.getMonth() +1}/${dateOfDay.getFullYear()}`;
console.log(dateOfDayId);
// quelques variables ..
let text;
let date;

// Import
let Time = require('./Time');
let sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
let Graph = require('./graph');

// liaison a l'api et l'appli bot
let Twit = require('twit')
let T = new Twit({
                 consumer_key:         '2ZJc4zdrnWzf28f4baSjdrGgH',
                 consumer_secret:      'xYHGReqoyyXXreu5NjN3ApBrrPuBTu7TAkYmyMbutqfV6kX5mE',
                 access_token:         '1110852776270221313-UFvirHn78V8rfwyXoBlUKSZGocbQHb',
                 access_token_secret:  'rASpSd9PZBvQ9X1VHuAVf35gJho3AxzYCWZykHEKrM7fP',
                 })


// instanciation de la classe time
let t = new Time();

// récupération des données en base si il y en a.
t.getNbArret();
t.getTmpArret();
t.getProlongation();


// test d'un graph fonctionnel mais plante le programme
// a besoin de : npm install chartjs-node, npm install chart.js, npm install bluebird, npm install canvas, npm install debug, npm install jsdom, npm install stream-buffers
// ==> installer les librairies sur ce lien ==> https://github.com/Automattic/node-canvas#installation  (pkg-config cairo pango libpng jpeg giflib librsvg)

let g = new Graph(2,3,1,0,7,0,1,"Review des arrêts de cette semaine");
g.generate();



let bd = new sqlite3.Database('./bdd',function(err){});
// test d'un select

bd.all('select * from LOGS where day="' + dateOfDayId + '"', [], (err,rows) => {
    if(err){
      console.log("Erreur dans l'odre select");
    }
    if(rows){
      rows.forEach((row) => {
        console.log(row);
      })
    }
})




// définition de l'intervale de vérification
setInterval(checkTime,1000*10);



// fonction qui vérifie si c'est l'heure de tweeter
function checkTime(){
 
    let d = new Date();
    // réalisation d'une sauvegarde de l'état en base de données
    t.Save();
   

      // écriture du log dans le fichier 
      fs.appendFile("./log.txt","[" + d.getHours() + ":" + d.getMinutes() +"] [INFO] -- Sauvegarde effectuée --\n",function(err){ if(err) console.log("erreur");});

      if(d.getHours() == 00 && d.getMinutes() == 44 && d.toLocaleString('en-us', {  weekday: 'long' }) == "Sunday"){
        // signifie qu'il est 00h44 est que nous sommes dimanche, il faut tweeter les stats

       /**
        sendGraph(t.getGraph());   --> tweetera le png généré par graph.js

        **/

      }


    
    if(d.getHours() == 00 && d.getMinutes() == 42){
        // a 00h42 on tweet les stats de journée
    //sendTweet(t.Tweet());
        //t.Raz();

        // on lis les logs de la journée écoulée
        let lecture;
      lecture = fs.readFile('./log.txt', function read(err, data) {
           if (err) {
                 throw err;
            }

         lecture = data;

          // on écris les logs de la journée écoulée en base cela dois être fait obligatoirement dans le readFile sinon lecture = undefined
         let dateOfDayIdTmp = `${dateOfDay.getDate() -1}/${dateOfDay.getMonth() +1}/${dateOfDay.getFullYear()}`;
        bd.run('update LOGS set logger = logger ||"' + lecture + '" where day="' + dateOfDayIdTmp + '"',function(err){ console.log("??" + err);});
    
       
});
   
   // une fois les logs de la journée écoulée stocké en base on nettoie le fichier de logs (le write contrairement au append écrase les données du fichié)
      fs.writeFile('./log.txt','[INFO] -- Le log a été purgé --\n', function(err){}); 
      
    // on prépare un nouveau champs en table pour la prochaine jounée
   bd.run('INSERT INTO LOGS (day,logger) VALUES ("' + dateOfDayId +'","  ")', function(err) {
      if(err){
        console.log("insert" + err);
      }

    });
    
}
}

// fonction qui tweetera
function sendTweet(Atweet) {
    let d = new Date();
    let dd = d.getDate() -1; // -1 Le tweet concerne la journée dernière et le tweet est programmé pour 00h42
    let mm = d.getMonth() +1; // +1 janvier = 0
    let yyyy = d.getFullYear();

    if( dd == 0){ dd ++}; // Patch le bug du premier jour du mois à 0

    let tweet = { status:'[ ' + dd+'/'+mm+'/'+yyyy+' ]\n' + Atweet };
    T.post('statuses/update', tweet, tweeted);

    // callback tout c'est bien passé? (utile pour le debug)
    function tweeted(err,data,response){
        if(err){

            // écriture du log dans le fichier 
           fs.appendFile("./log.txt","[" + d.getHours() + ":" + d.getMinutes() +"] [ERREUR] -- Le tweet programmé n'a pas pu être posté --\n",function(err){ if(err) console.log("erreur");});

        }
    }
            // écriture du log dans le fichier 
           fs.appendFile("./log.txt","[" + d.getHours() + ":" + d.getMinutes() +"] [INFO] -- Le tweet programmé à été posté --\n",function(err){ if(err) console.log("erreur");});
}


// comptes a écouter (@iléviametro)
const users = ["2373894229"];


let stream = T.stream('statuses/filter', {follow: users})


// Laisser l'écoute des tweets en commentaire en mode developpeur pour ne pas intéferer avec le bot qui tourne sur le raspberry
/** écoute des tweet
stream.on('tweet', function (tweet) {
          if (users.indexOf(tweet.user.id_str) > -1) {
          
          // découpage des infos
         
          text = tweet.text.substring(0,21);
          // console.log(text); --> Affiche le découpage du tweet repère (voir les constantes)
          date = tweet.created_at.substring(11,19);
          
          // le tweet signifie que la ligne est à l'arrêt
          if(text == ligne1Stop || text == ligne1AutreStop){
            t.Arret(date);
          }

          
          // le tweet signifie que la ligne a repris
          if(text == ligne1Start){ 
            t.Reprise(date);
          }
          }
          })**/


