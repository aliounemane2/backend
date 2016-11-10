'use strict';

app.controller('DashboardCtrl', function ($scope, $window, $location, AuthService, NgMap, $timeout, $interval, $q, $queueFactory, $http) {
  var vm=this;
  var mymap;
  var tableau = [];
  //  var debut;
  //  $scope.tableau = [];

  $scope.directi = [];

  // Variables
  var debut = null;
  var fin = null;

  // Déclarer les points
  var p1 = new google.maps.LatLng(14.782300000000001, -17.323140000000002);
  var p2 = new google.maps.LatLng(14.78231, -17.323130000000003);
  var getDistancess;
  var distance;


  $scope.pointsArray = [[]];
  $scope.pointsArray1 = [];
  $scope.pointsArray2 = [];
  var tabs = [];

  // var z = 0;
  var z = 0;

  var queue = $queueFactory($scope.pointsArray, true);
  var _qTasks = [];


  if (!$window.localStorage.token) {
    $location.path('/');
    return;
  }
  $scope.token = $window.localStorage.token;
  $scope.username = $window.localStorage.username;


//  $scope.zoomer = function(){
//      vm.LatLng(14.734749, -17.472845);
//      google.maps.event.addListener(map, 'zoom_changed', function(){
//        $scope.map = map;
//        console.log(' En console '+map.getZoom());
//      });
//  };


   NgMap.getMap({id:"chargement"}).then(function(map) {

        // var latlng = new google.maps.LatLng(14.734749,-17.472845);
        // map.setCenter(latlng);
        // map.setZoom(12);


        // a décommenter
        window.map = map;
        console.log(map.getCenter());
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);

   });

/*
    ancienne bonne méthode
    $scope.zoomer2 = function(event){

        // $scope.latlng = [];
        // $scope.latlng = [event.latLng.lat(), event.latLng.lng()];
        // console.log('lat'+event.latLng.lat()+'lng'+event.latLng.lng());

         if (debut == null){

             debut = event.latLng;
             console.log(' debut == null '+debut);

         } else if (fin == null){

             fin = event.latLng;

             $scope.directi.push(
                     {origin:debut, destination:fin}
             );

             console.log(' fin == null '+fin);
             console.log(' contenu de directi ');
             console.log($scope.directi);

         } else if (fin != null){
             fin = null;
             console.log(' fin != null => '+fin);
         } else if (debut != null){
             debut = null;
             console.log(' debut != null => '+debut);
         }
    }
*/

    $scope.zoomer2 = function(event){

        // $scope.latlng = [];
        // $scope.latlng = [event.latLng.lat(), event.latLng.lng()];
        // console.log('lat'+event.latLng.lat()+'lng'+event.latLng.lng());

         if (debut == null){
             debut = event.latLng;
             console.log(' debut == null '+debut);
         } else if (fin == null){
             fin = event.latLng;
             $scope.directi.push(
                     {origin:debut, destination:fin}
             );
             console.log(' fin == null '+fin);
             console.log(' contenu de directi ');
             console.log($scope.directi);

             debut = null;
             fin = null;

                 // à décommenter
                 $timeout(function(){
                    $scope.tracer(event);
                 }, 1000);

         } else if (fin != null){
             fin = null;
             console.log(' fin != null => '+fin);
         } else if (debut != null){
             debut = null;
             console.log(' debut != null => '+debut);
         }
    }



    // traçage de façon séquentiel fonctionne bien
/*
    $scope.tracer = function(event){

        $scope.debut = null;
        $scope.fin = null;
        var map = $scope.map;
        var zoom = map.getZoom();

        // -- console.log(' Les points --->>> ');
        // variation de steps i à n
        // variation de path i à n

        // A décommenter
        console.log(' Avant la boucle Boucle '+map.directionsRenderers);
        for (var k = 0; k < map.directionsRenderers[k].directions.routes[0].legs[0].steps.length; k++){

            console.log(' variation de k '+k);
            console.log(map.directionsRenderers[k]);
            console.log(' -------- ');

            for (var i = 0; i < map.directionsRenderers[k].directions.routes[0].legs[0].steps.length; i++){
                console.log(' Boucle  1', map.directionsRenderers[k].directions.routes[0].legs[0].steps[i]);

                for ( var j = 0; j < map.directionsRenderers[k].directions.routes[0].legs[0].steps[i].path.length; j++){
                   console.log(' Boucle 2 Latitude Longitude ', map.directionsRenderers[k].directions.routes[0].legs[0].steps[i].path[j].lat(), map.directionsRenderers[k].directions.routes[0].legs[0].steps[i].path[j].lng());

                    $scope.pointsArray.push({'lat':map.directionsRenderers[k].directions.routes[0].legs[0].steps[i].path[j].lat(), 'lng':map.directionsRenderers[k].directions.routes[0].legs[0].steps[i].path[j].lng()});
                    // console.log(map.directionsRenderers[k].directions.routes[0].legs[0].steps[i].path[j].lat(), map.directionsRenderers[k].directions.routes[0].legs[0].steps[i].path[j].lng());
                }
            }


            console.log(' le tableau pointsArray ');
            console.log($scope.pointsArray);

            var j= 0;
            $interval(function() {

                // if (j > $scope.pointsArray.length-1) // à voir le -1
                if (j > $scope.pointsArray.length-1)
                        return;
                 //console.log(' Boucle 2 ', map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j]);

                //console.log('----------');
                console.log(' j: '+j);
                //console.log($scope.pointsArray[j]);
                var latlng = new google.maps.LatLng($scope.pointsArray[j].lat, $scope.pointsArray[j].lng);
                map.markers.mark.setPosition(latlng);
                j++;
            }, 100);

            // alert(map.markers);
            console.log(map.markers);

        }

            /*
            // Bloc opérationnels

            for (var i = 0; i < map.directionsRenderers[0].directions.routes[0].legs[0].steps.length; i++){
                console.log(' Boucle  1', map.directionsRenderers[0].directions.routes[0].legs[0].steps[i]);
                for ( var j = 0; j < map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path.length; j++){
                    // console.log(' Latitude Longitude ', map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lat(), map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lng());

                    console.log(' Boucle 2 '+map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lat(), map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lng());
                    // $scope.pointsArray.push({'lat':map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lat(), 'lng':map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lng()});
                }
            }

            */


/*
        var j= 0;
        $interval(function() {

                if (j > $scope.pointsArray.length-1)
                    return;
             //console.log(' Boucle 2 ', map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j]);

            //console.log('----------');
            console.log(' j: '+j);
            //sconsole.log($scope.pointsArray[j]);
            var latlng = new google.maps.LatLng($scope.pointsArray[j].lat, $scope.pointsArray[j].lng);
            map.markers.mark.setPosition(latlng);
            j++;
        }, 100);

        // alert(map.markers);
        console.log(map.markers);



   }; // fin de la fonction

*/


  $scope.rad = function(x) {
      return x * Math.PI / 180;
  };


  $scope.getDistance = function(p1, p2) {

        var R = 6378137;
        var dLat = $scope.rad(p2.lat() - p1.lat());
        var dLong = $scope.rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos($scope.rad(p1.lat())) * Math.cos($scope.rad(p2.lat())) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        // return d;

        // console.log(' La valeur arrondi de la distance ');
        // console.log(Math.ceil(d/10)*10);
        return Math.ceil(d/10)*10;

    };

    $scope.traitement = function(){
        var map = $scope.map;

        distance = 0;

        if ( distance < $scope.getDistance(p1, p2)){
            // return;

            distance = distance + 10;
            console.log(' La valeur de la distance est : ==>> '+distance);
            map.markers[z].setPosition(p1);
        }

                    /*
                            $interval(function() {
                                if (j > $scope.pointsArray.length-1)
                                    return;

                                console.log(' j: '+j);
                                var latlng = new google.maps.LatLng($scope.pointsArray[j].lat, $scope.pointsArray[j].lng);
                                //------>>>> map.markers.mark.setPosition(latlng);
                                map.markers[0].setPosition(latlng);
                                j++;
                            }, 100);

                    */

    };



   // Façon recommandé
   // $scope.tracer = function(event){   la bonne
   $scope.tracer = function(event){

        $scope.debut = null;
        $scope.fin = null;
        var map = $scope.map;
        var zoom = map.getZoom();

        z = $scope.directi.length-1;

        // A ne pas décommenter
        // z = $scope.pointsArray.length-1;
        $scope.pointsArray[z] = [];
        // $scope.pointsArray = [[]];


        // à decommenter
        // for ( var k = 0; k < map.directionsRenderers[k].directions.routes[0].legs[0].steps.length; k++){

            // console.log(' variation de k '+k);
            // console.log(' -------- ');


            for ( var i = 0; i < map.directionsRenderers[z].directions.routes[0].legs[0].steps.length; i++){
                console.log(' Boucle  1', map.directionsRenderers[z].directions.routes[0].legs[0].steps[i]);
                console.log(' La Taille de  Length '+map.directionsRenderers[z].directions.routes[0].legs[0].steps[i].path.length);

                for ( var j = 0; j < map.directionsRenderers[z].directions.routes[0].legs[0].steps[i].path.length; j++){
                    console.log(' Boucle 2 Latitude Longitude ', map.directionsRenderers[z].directions.routes[0].legs[0].steps[i].path[j].lat(), map.directionsRenderers[z].directions.routes[0].legs[0].steps[i].path[j].lng());
                    $scope.pointsArray[z].push({'lat':map.directionsRenderers[z].directions.routes[0].legs[0].steps[i].path[j].lat(), 'lng':map.directionsRenderers[z].directions.routes[0].legs[0].steps[i].path[j].lng()});
                    // var latlng = new google.maps.LatLng($scope.pointsArray[k].lat , $scope.pointsArray[k].lng);
                }
            }


            $q.when().then(function(tabs = $scope.pointsArray[z]){

                var deferred = $q.defer();
                var j = 0;


                $interval(function(tabs = $scope.pointsArray[z]){


                    if ( j >= $scope.pointsArray[z].length-1)
                        return;

                        console.log($scope.pointsArray[z][j].lat,$scope.pointsArray[z][j].lng);
                        p1 = new google.maps.LatLng($scope.pointsArray[z][j].lat,$scope.pointsArray[z][j].lng);
                        p2 = new google.maps.LatLng($scope.pointsArray[z][j+1].lat,$scope.pointsArray[z][j+1].lng);

                        console.log(' *************************  1 ');
                        console.log(' CC  1 ');
                        // $scope.getDistance(p1, p2);
                        distance = 0;

                        $interval(function(){
                            if (distance >= $scope.getDistance(p1, p2))
                                return;

                                distance = distance + 10;
                                map.markers[z].setPosition(p1);
                                console.log(' La valeur de la distance est ===>>> '+distance);
                                deferred.resolve(distance);

                        }, distance);

                        // if ( distance < $scope.getDistance(p1, p2)){
                        //    distance = distance + 10;
                        //    console.log(' La valeur de la distance est ==>>>>> '+distance);

                        // return;
                        //    map.markers[z].setPosition(p1);
                        //    console.log('  Distance ==>> '+distance);
                        //    distance = distance + 10;
                        // }
                        console.log(' *************************  2 ');


                    // console.log(' ZZZZ '+z);
                    // console.log($scope.pointsArray[z]);
                    // console.log($scope.pointsArray[z].length);

                        console.log(' La valeur de j '+j);
                        j++;
                    // }

                }, 1000);
                 return deferred.promise;
            });

            // Affichage séquentiel d'un Markeur

/*
            p1 = new google.maps.LatLng(map.directionsRenderers[z].directions.routes[0].legs[0].steps[i].path[j].lat(), map.directionsRenderers[z].directions.routes[0].legs[0].steps[i].path[j].lng());
            p2 = new google.maps.LatLng(map.directionsRenderers[z].directions.routes[0].legs[0].steps[i].path[j+1].lat(), map.directionsRenderers[z].directions.routes[0].legs[0].steps[i].path[j+1].lng());
            // --- getDistancess = $scope.getDistance(p1, p2);

            // Ok $interval( $scope.getDistance(p1, p2), 1000);
            console.log(' ddddddddddddddddddddd   ');
            $interval($scope.traitement(), 1000);
            console.log(' ddddddddddddddddddddd   ');
*/


/*  A décommenter ancien code

            $q.when().then(function(){
                // -- Tâches Asynchrones
                var deferred = $q.defer();

                    var j=0;
                    $interval(function() {
                        if (j > $scope.pointsArray.length-1){
                            return;
                        }
                        console.log(' j: '+j);
                        var latlng = new google.maps.LatLng($scope.pointsArray[j].lat, $scope.pointsArray[j].lng);
                        //------>>>> map.markers.mark.setPosition(latlng);
                        map.markers[0].setPosition(latlng);
                        j++;
                    }, 100);

                return deferred.promise;
            }).then(function(data){
                   console.log(data);
            });
*/





/*
    Le Bon code  à décommenter
    Le Bon code  à décommenter
    Le Bon code  à décommenter
    Le Bon code  à décommenter

        queue.enqueue(function () {
            var dfd = $q.defer();

            var j=0;
                    $interval(function() {
                        if (j > $scope.pointsArray.length-1){
                            return;
                        }
                        console.log(' j: '+j);
                        var latlng = new google.maps.LatLng($scope.pointsArray[j].lat, $scope.pointsArray[j].lng);
                        map.markers.mark.setPosition(latlng);
                        // ------>>>> map.markers[0].setPosition(latlng);
                        j++;

                        dfd.resolve('data received!');
                    }, 10);

                return dfd.promise;

        });
*/


  //  );


/*

            $q.when().then(function(){
                // -- Tâches Asynchrones
                var deferred = $q.defer();

                    var j=0;
                    $interval(function() {
                        if (j > $scope.pointsArray.length-1){
                            return;
                        }
                        console.log(' j: '+j);
                        var latlng = new google.maps.LatLng($scope.pointsArray[j].lat, $scope.pointsArray[j].lng);
                        //------>>>> map.markers.mark.setPosition(latlng);
                        map.markers[0].setPosition(latlng);
                        j++;
                    }, 100);

                return deferred.promise;
            }).then(function(data){
                   console.log(data);
            });

*/




/*  à décommenter
    à décommenter
    à décommenter
      }

*/


/*
        // indice 0
        for (var i = 0; i < map.directionsRenderers[0].directions.routes[0].legs[0].steps.length; i++){
            console.log(' Boucle  1', map.directionsRenderers[0].directions.routes[0].legs[0].steps[i]);
            for ( var j = 0; j < map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path.length; j++){
                console.log(' Boucle 2 Latitude Longitude ', map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lat(), map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lng());
                $scope.pointsArray.push({'lat':map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lat(), 'lng':map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lng()});
                var latlng = new google.maps.LatLng($scope.pointsArray[j].lat , $scope.pointsArray[j].lng);
                // -->>  map.markers.mark.setPosition(latlng);
                // map.markers.mark1.setPosition(latlng);
            }
        }

        var j= 0;
        $interval(function() {
            if (j > $scope.pointsArray.length-1)
                return;
            // console.log($scope.pointsArray[j]);
            console.log(' j: '+j);
            var latlng = new google.maps.LatLng($scope.pointsArray[j].lat, $scope.pointsArray[j].lng);
            // ----  map.markers.mark.setPosition(latlng);
            map.markers[0].setPosition(latlng);
            j++;
        }, 100);


        // indice 1
        for ( var i = 0; i < map.directionsRenderers[1].directions.routes[0].legs[0].steps.length; i++){
            console.log(' Boucle  1', map.directionsRenderers[1].directions.routes[0].legs[0].steps[i]);
            for ( var j = 0; j < map.directionsRenderers[1].directions.routes[0].legs[0].steps[i].path.length; j++){
                console.log(' Boucle 2 Latitude Longitude ', map.directionsRenderers[1].directions.routes[0].legs[0].steps[i].path[j].lat(), map.directionsRenderers[1].directions.routes[0].legs[0].steps[i].path[j].lng());
                $scope.pointsArray1.push({'lat':map.directionsRenderers[1].directions.routes[0].legs[0].steps[i].path[j].lat(), 'lng':map.directionsRenderers[1].directions.routes[0].legs[0].steps[i].path[j].lng()});
                // -->> $scope.pointsArray1.push({'lat':map.directionsRenderers[1].directions.routes[0].legs[0].steps[i].path[j].lat(), 'lng':map.directionsRenderers[1].directions.routes[0].legs[0].steps[i].path[j].lng()});
                var latlng = new google.maps.LatLng($scope.pointsArray[j].lat , $scope.pointsArray[j].lng);
                // -->>  map.markers.mark.setPosition(latlng);
                // map.markers.mark1.setPosition(latlng);
            }
        }

        var j = 0;
        $interval(function() {
            if (j > $scope.pointsArray1.length-1)
                return;
            // console.log($scope.pointsArray[j]);
            console.log(' j: '+j);
            var latlng = new google.maps.LatLng($scope.pointsArray1[j].lat, $scope.pointsArray1[j].lng);
            //----   map.markers.mark1.setPosition(latlng);
            map.markers[1].setPosition(latlng);
            j++;
        }, 100);

*/


   };



    $scope.zoomer = function(){

        var map = $scope.map;

        $scope.positions = [
            [14.73904693302263, -17.47169028859048],
            [14.73904693302263, -17.47169028859048],
            [14.73895873871039, -17.471878043221523],
            [14.739244721607731, -17.471764719890643],
            [14.73894317500453, -17.471451571988155],
            [14.738743440680498, -17.471907547520686],
            [14.73912345452936, -17.47142743210702],
            [14.738563160841137, -17.471954486178447],
            [14.739581286033118, -17.47166883091836],
            [14.739926280241457, -17.47151728610902],
            [14.740446364462414, -17.471289298342754],
            [14.740631830604858, -17.47109416763692],
            [14.740671388048364, -17.470909095214893],
            [14.740929483978817, -17.470656967567493],
            [14.74109808919535, -17.47083131115346],
            [14.741362669425786, -17.470903730796863]
        ];


        console.log(" Markers ");
        console.log(map.getZoom());
        var zoom = map.getZoom();

        console.log(' Les points --->>> ');
        // variation de steps i à n
        // variation de path i à n


        // A décommenter


/*

        console.log(' legs ', map.directionsRenderers[0].directions.routes[0].legs[0]);
        console.log(' steps ', map.directionsRenderers[0].directions.routes[0].legs[0].steps.length);

        for (var i = 0; i < map.directionsRenderers[0].directions.routes[0].legs[0].steps.length; i++){

            console.log(' Boucle  1', map.directionsRenderers[0].directions.routes[0].legs[0].steps[i]);
            for ( var j = 0; j < map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path.length; j++){
                // console.log(' Latitude Longitude ', map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lat(), map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lng());

                $scope.pointsArray.push({'lat':map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lat(), 'lng':map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lng()});

            }

        }

        var j= 0;
        $interval(function() {
                if (j > $scope.pointsArray.length-1)
                    return;
             //console.log(' Boucle 2 ', map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j]);

            //console.log('----------');
            console.log(' j: '+j);
            //sconsole.log($scope.pointsArray[j]);
            var latlng = new google.maps.LatLng( $scope.pointsArray[j].lat,$scope.pointsArray[j].lng);
            //map.markers[16].setPosition(latlng);
            map.markers.mark.setPosition(latlng);


                j++;
        }, 100);

                //alert(map.markers);
                console.log(map.markers);

    à décommenter

*/


//                     //$interval($scope.zoomer, j*200);
//
//                //$timeout($scope.zoomer, 500);
//                //$scope.pointsArray.push({'lat':map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lat(), 'lng':map.directionsRenderers[0].directions.routes[0].legs[0].steps[i].path[j].lng()});
//
//            }
//                      // à décommenter
//                     //$interval($scope.zoomer, i*200);
//
//        }



        console.log(' En dehors de la boucle ');
        //console.log($scope.pointsArray);


        //console.log(' Contenu pointsArray ', pointsArray);
        //console.log(pointsArray.length);






        //console.log(' En dehors de la boucle ');
        //console.log(pointsArray.length);



        //console.log(map.directionsRenderers[0].directions.routes[0].legs[0].steps[0].path[0].lat());



/*
        for ( var i = 0; i < map.directionsRenderers[0].directions.routes[0].overview_path.length; i++){
            console.log(map.directionsRenderers[0].directions.routes[0].overview_path[i].lat(), map.directionsRenderers[0].directions.routes[0].overview_path[i].lng() );
        }
*/



        //console.log(map.directionsRenderers[0].directions.routes[0]);

        //console.log(map.directionsRenderers[0].directions.routes[0].legs[0].steps[0].path[0].lat(), map.directionsRenderers[0].directions.routes[0].legs[0].steps[0].path[0].lng());



        //console.log(' markers ', map.markers);


/*
        if(zoom > 12 && zoom <= 15){
            //console.log('markers '+marker.getPosition());
            //console.log(' Ne pas Zoomer '+map.getZoom());
            map.markers[0].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[1].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[2].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[3].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[4].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[5].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[6].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[7].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[8].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[9].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[10].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[11].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[12].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[13].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[14].setIcon("./images/cercle/cercle3x3x3.png");
            map.markers[15].setIcon("./images/cercle/cercle3x3x3.png");

            //console.log(' markers 0 ', map.markers[0][1].setIcon("./images/cercle/cercle25x25.png"));


        } else if(zoom > 15 && zoom <= 18){

            map.markers[0].setIcon("./images/cercle/cercle8x8.png");
            map.markers[1].setIcon("./images/cercle/cercle8x8.png");
            map.markers[2].setIcon("./images/cercle/cercle8x8.png");
            map.markers[3].setIcon("./images/cercle/cercle8x8.png");
            map.markers[4].setIcon("./images/cercle/cercle8x8.png");
            map.markers[5].setIcon("./images/cercle/cercle8x8.png");
            map.markers[6].setIcon("./images/cercle/cercle8x8.png");
            map.markers[7].setIcon("./images/cercle/cercle8x8.png");
            map.markers[8].setIcon("./images/cercle/cercle8x8.png");
            map.markers[9].setIcon("./images/cercle/cercle8x8.png");
            map.markers[10].setIcon("./images/cercle/cercle8x8.png");
            map.markers[11].setIcon("./images/cercle/cercle8x8.png");
            map.markers[12].setIcon("./images/cercle/cercle8x8.png");
            map.markers[13].setIcon("./images/cercle/cercle8x8.png");
            map.markers[14].setIcon("./images/cercle/cercle8x8.png");
            map.markers[15].setIcon("./images/cercle/cercle8x8.png");

            console.log(' markers 0 ', map.markers[0][1].setIcon("./images/cercle/cercle25x25.png"));

        } else if(zoom > 18 && zoom <= 19){

            map.markers[0].setIcon("./images/cercle/cercle14x14.png");
            map.markers[1].setIcon("./images/cercle/cercle14x14.png");
            map.markers[2].setIcon("./images/cercle/cercle14x14.png");
            map.markers[3].setIcon("./images/cercle/cercle14x14.png");
            map.markers[4].setIcon("./images/cercle/cercle14x14.png");
            map.markers[5].setIcon("./images/cercle/cercle14x14.png");
            map.markers[6].setIcon("./images/cercle/cercle14x14.png");
            map.markers[7].setIcon("./images/cercle/cercle14x14.png");
            map.markers[8].setIcon("./images/cercle/cercle14x14.png");
            map.markers[9].setIcon("./images/cercle/cercle14x14.png");
            map.markers[10].setIcon("./images/cercle/cercle14x14.png");
            map.markers[11].setIcon("./images/cercle/cercle14x14.png");
            map.markers[12].setIcon("./images/cercle/cercle14x14.png");
            map.markers[13].setIcon("./images/cercle/cercle14x14.png");
            map.markers[14].setIcon("./images/cercle/cercle14x14.png");
            map.markers[15].setIcon("./images/cercle/cercle14x14.png");
            console.log(' markers 0 ', map.markers[0][1].setIcon("./images/cercle/cercle25x25.png"));


        } else if(zoom > 20){

            map.markers[0].setIcon("./images/cercle/cercle25x25.png");
            map.markers[1].setIcon("./images/cercle/cercle25x25.png");
            map.markers[2].setIcon("./images/cercle/cercle25x25.png");
            map.markers[3].setIcon("./images/cercle/cercle25x25.png");
            map.markers[4].setIcon("./images/cercle/cercle25x25.png");
            map.markers[5].setIcon("./images/cercle/cercle25x25.png");
            map.markers[6].setIcon("./images/cercle/cercle25x25.png");
            map.markers[7].setIcon("./images/cercle/cercle25x25.png");
            map.markers[8].setIcon("./images/cercle/cercle25x25.png");
            map.markers[9].setIcon("./images/cercle/cercle25x25.png");
            map.markers[10].setIcon("./images/cercle/cercle25x25.png");
            map.markers[11].setIcon("./images/cercle/cercle25x25.png");
            map.markers[12].setIcon("./images/cercle/cercle25x25.png");
            map.markers[13].setIcon("./images/cercle/cercle25x25.png");
            map.markers[14].setIcon("./images/cercle/cercle25x25.png");
            map.markers[15].setIcon("./images/cercle/cercle25x25.png");

            console.log(' markers 0 ', map.markers[0][1].setIcon("./images/cercle/cercle25x25.png"));

        }*/




       /* if (zoom > 15){

                console.log(" If zoom > 15 ");
                map.markers[0].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[1].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[2].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[3].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[4].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[5].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[6].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[7].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[8].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[9].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[10].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[11].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[12].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[13].setIcon("./images/cercle/cercle3x3x3.png");
                map.markers[14].setIcon("./images/cercle/cercle3x3x3.png");

                console.log(' markers 0 ', map.markers[0][1].setIcon("./images/cercle/cercle3x3x3.png"));
                map.markers[15].setIcon("./images/cercle/cercle3x3x3.png");

                //console.log(' markers 0 ', map.markers[0][1].setIcon("./images/cercle/cercle25x25.png"));

                console.log('Taille ',map.markers.length);

                for (var i=0; i < map.markers.length; i++){

                    console.log(" Debut de boucle ");
                    map.markers[i].setIcon("./images/cercle/cercle25x25.png");
                    console.log(' Taille '+i, map.markers[i]);
                    console.log(" Fin de boucle ");
                }

                //map.setMap($scope.map);

                // map.markers[1].setIcon("./images/cercle/cercle25x25.png");
                // console.log(' markers 0 ', map.markers[0].setIcon("./images/cercle/cercle25x25.png"));
                //console.log(map.markers[0]);
                console.log(' Zoom change ');
        }else */

       if(zoom > 15 && zoom <= 18){

            map.markers[0].setIcon("./images/cercle/cercle8x8.png");
            map.markers[1].setIcon("./images/cercle/cercle8x8.png");
            map.markers[2].setIcon("./images/cercle/cercle8x8.png");
            map.markers[3].setIcon("./images/cercle/cercle8x8.png");
            map.markers[4].setIcon("./images/cercle/cercle8x8.png");
            map.markers[5].setIcon("./images/cercle/cercle8x8.png");
            map.markers[6].setIcon("./images/cercle/cercle8x8.png");
            map.markers[7].setIcon("./images/cercle/cercle8x8.png");
            map.markers[8].setIcon("./images/cercle/cercle8x8.png");
            map.markers[9].setIcon("./images/cercle/cercle8x8.png");
            map.markers[10].setIcon("./images/cercle/cercle8x8.png");
            map.markers[11].setIcon("./images/cercle/cercle8x8.png");
            map.markers[12].setIcon("./images/cercle/cercle8x8.png");
            map.markers[13].setIcon("./images/cercle/cercle8x8.png");
            map.markers[14].setIcon("./images/cercle/cercle8x8.png");
            map.markers[15].setIcon("./images/cercle/cercle8x8.png");

            console.log(' markers 0 ', map.markers[0][1].setIcon("./images/cercle/cercle25x25.png"));

       }else if(zoom > 18 && zoom <= 19){

            map.markers[0].setIcon("./images/cercle/cercle14x14.png");
            map.markers[1].setIcon("./images/cercle/cercle14x14.png");
            map.markers[2].setIcon("./images/cercle/cercle14x14.png");
            map.markers[3].setIcon("./images/cercle/cercle14x14.png");
            map.markers[4].setIcon("./images/cercle/cercle14x14.png");
            map.markers[5].setIcon("./images/cercle/cercle14x14.png");
            map.markers[6].setIcon("./images/cercle/cercle14x14.png");
            map.markers[7].setIcon("./images/cercle/cercle14x14.png");
            map.markers[8].setIcon("./images/cercle/cercle14x14.png");
            map.markers[9].setIcon("./images/cercle/cercle14x14.png");
            map.markers[10].setIcon("./images/cercle/cercle14x14.png");
            map.markers[11].setIcon("./images/cercle/cercle14x14.png");
            map.markers[12].setIcon("./images/cercle/cercle14x14.png");
            map.markers[13].setIcon("./images/cercle/cercle14x14.png");
            map.markers[14].setIcon("./images/cercle/cercle14x14.png");
            map.markers[15].setIcon("./images/cercle/cercle14x14.png");
            console.log(' markers 0 ', map.markers[0][1].setIcon("./images/cercle/cercle25x25.png"));

       } else if(zoom >= 20 ){

            map.markers[0].setIcon("./images/cercle/cercle25x25.png");
            map.markers[1].setIcon("./images/cercle/cercle25x25.png");
            map.markers[2].setIcon("./images/cercle/cercle25x25.png");
            map.markers[3].setIcon("./images/cercle/cercle25x25.png");
            map.markers[4].setIcon("./images/cercle/cercle25x25.png");
            map.markers[5].setIcon("./images/cercle/cercle25x25.png");
            map.markers[6].setIcon("./images/cercle/cercle25x25.png");
            map.markers[7].setIcon("./images/cercle/cercle25x25.png");
            map.markers[8].setIcon("./images/cercle/cercle25x25.png");
            map.markers[9].setIcon("./images/cercle/cercle25x25.png");
            map.markers[10].setIcon("./images/cercle/cercle25x25.png");
            map.markers[11].setIcon("./images/cercle/cercle25x25.png");
            map.markers[12].setIcon("./images/cercle/cercle25x25.png");
            map.markers[13].setIcon("./images/cercle/cercle25x25.png");
            map.markers[14].setIcon("./images/cercle/cercle25x25.png");
            map.markers[15].setIcon("./images/cercle/cercle25x25.png");

            console.log(' markers 0 ', map.markers[0][1].setIcon("./images/cercle/cercle25x25.png"));

       }










        //vm.positions.push({pos:[lat(),lng()]});


/*      var marker = new google.maps.Marker({position: new google.maps.LatLng(14.73904693302263, -17.47169028859048), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker1 = new google.maps.Marker({position: new google.maps.LatLng(14.73904693302263, -17.47169028859048), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker2 = new google.maps.Marker({position: new google.maps.LatLng(14.73895873871039, -17.471878043221523), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker3 = new google.maps.Marker({position: new google.maps.LatLng(14.739244721607731, -17.471764719890643), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker4 = new google.maps.Marker({position: new google.maps.LatLng(14.73894317500453, -17.471451571988155), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker5 = new google.maps.Marker({position: new google.maps.LatLng(14.738743440680498, -17.471907547520686), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker6 = new google.maps.Marker({position: new google.maps.LatLng(14.73912345452936, -17.47142743210702), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker7 = new google.maps.Marker({position: new google.maps.LatLng(14.738563160841137, -17.471954486178447), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker8 = new google.maps.Marker({position: new google.maps.LatLng(14.739581286033118, -17.47166883091836), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker9 = new google.maps.Marker({position: new google.maps.LatLng(14.739926280241457, -17.47151728610902), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker10 = new google.maps.Marker({position: new google.maps.LatLng(14.740446364462414, -17.471289298342754), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker11 = new google.maps.Marker({position: new google.maps.LatLng(14.740631830604858, -17.47109416763692), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker12 = new google.maps.Marker({position: new google.maps.LatLng(14.740671388048364, -17.470909095214893), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker13 = new google.maps.Marker({position: new google.maps.LatLng(14.740929483978817, -17.470656967567493), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker14 = new google.maps.Marker({position: new google.maps.LatLng(14.74109808919535, -17.47083131115346), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
        var marker15 = new google.maps.Marker({position: new google.maps.LatLng(14.741362669425786, -17.470903730796863), icon: "./images/cercle/cercle16x16.png", map: $scope.map});
*/

        //icon: "./images/cercle/cercle12x12.png",


     /*   console.log(' Markeur changer -->> '+marker.getPosition());

        google.maps.event.addListener(map, 'zoom_changed', function(){

            var zoom = map.getZoom();
            if (zoom <= 8){

                console.log(' Ne pas Zoomer '+map.getZoom());
                marker.setIcon("./images/cercle/cercle3x3x3.png");
                map.setZoom();

            } else if (zoom > 8 && zoom <= 10){

                console.log(' Ne pas Zoomer '+map.getZoom());
                marker.setIcon("./images/cercle/cercle3x3x3.png");

            } else if (zoom > 10 && zoom <= 12){

                console.log(' Ne pas Zoomer '+map.getZoom());
                marker.setIcon("./images/cercle/cercle3x3x3.png");
                marker1.setIcon("./images/cercle/cercle3x3x3.png");
                marker2.setIcon("./images/cercle/cercle3x3x3.png");
                marker3.setIcon("./images/cercle/cercle3x3x3.png");
                marker4.setIcon("./images/cercle/cercle3x3x3.png");
                marker5.setIcon("./images/cercle/cercle3x3x3.png");
                marker6.setIcon("./images/cercle/cercle3x3x3.png");
                marker7.setIcon("./images/cercle/cercle3x3x3.png");
                marker8.setIcon("./images/cercle/cercle3x3x3.png");
                marker9.setIcon("./images/cercle/cercle3x3x3.png");
                marker10.setIcon("./images/cercle/cercle3x3x3.png");
                marker11.setIcon("./images/cercle/cercle3x3x3.png");
                marker12.setIcon("./images/cercle/cercle3x3x3.png");
                marker13.setIcon("./images/cercle/cercle3x3x3.png");
                marker14.setIcon("./images/cercle/cercle3x3x3.png");
                marker15.setIcon("./images/cercle/cercle3x3x3.png");

            }else if(zoom > 12 && zoom <= 15){
                //console.log('markers '+marker.getPosition());
                //console.log(' Ne pas Zoomer '+map.getZoom());

                marker.setIcon("./images/cercle/cercle3x3x3.png");
                marker1.setIcon("./images/cercle/cercle3x3x3.png");
                marker2.setIcon("./images/cercle/cercle3x3x3.png");
                marker3.setIcon("./images/cercle/cercle3x3x3.png");
                marker4.setIcon("./images/cercle/cercle3x3x3.png");
                marker5.setIcon("./images/cercle/cercle3x3x3.png");
                marker6.setIcon("./images/cercle/cercle3x3x3.png");
                marker7.setIcon("./images/cercle/cercle3x3x3.png");
                marker8.setIcon("./images/cercle/cercle3x3x3.png");
                marker9.setIcon("./images/cercle/cercle3x3x3.png");
                marker10.setIcon("./images/cercle/cercle3x3x3.png");
                marker11.setIcon("./images/cercle/cercle3x3x3.png");
                marker12.setIcon("./images/cercle/cercle3x3x3.png");
                marker13.setIcon("./images/cercle/cercle3x3x3.png");
                marker14.setIcon("./images/cercle/cercle3x3x3.png");
                marker15.setIcon("./images/cercle/cercle3x3x3.png");

            } else if(zoom > 15 && zoom <= 18){

                marker.setIcon("./images/cercle/cercle8x8.png");
                marker1.setIcon("./images/cercle/cercle8x8.png");
                marker2.setIcon("./images/cercle/cercle8x8.png");
                marker3.setIcon("./images/cercle/cercle8x8.png");
                marker4.setIcon("./images/cercle/cercle8x8.png");
                marker5.setIcon("./images/cercle/cercle8x8.png");
                marker6.setIcon("./images/cercle/cercle8x8.png");
                marker7.setIcon("./images/cercle/cercle8x8.png");
                marker8.setIcon("./images/cercle/cercle8x8.png");
                marker9.setIcon("./images/cercle/cercle8x8.png");
                marker10.setIcon("./images/cercle/cercle8x8.png");
                marker11.setIcon("./images/cercle/cercle8x8.png");
                marker12.setIcon("./images/cercle/cercle8x8.png");
                marker13.setIcon("./images/cercle/cercle8x8.png");
                marker14.setIcon("./images/cercle/cercle8x8.png");
                marker15.setIcon("./images/cercle/cercle8x8.png");

            } else if(zoom > 18 && zoom <= 19){

               marker.setIcon("./images/cercle/cercle14x14.png");
               marker1.setIcon("./images/cercle/cercle14x14.png");
               marker2.setIcon("./images/cercle/cercle14x14.png");
               marker3.setIcon("./images/cercle/cercle14x14.png");
               marker4.setIcon("./images/cercle/cercle14x14.png");
               marker5.setIcon("./images/cercle/cercle14x14.png");
               marker6.setIcon("./images/cercle/cercle14x14.png");
               marker7.setIcon("./images/cercle/cercle14x14.png");
               marker8.setIcon("./images/cercle/cercle14x14.png");
               marker9.setIcon("./images/cercle/cercle14x14.png");
               marker10.setIcon("./images/cercle/cercle14x14.png");
               marker11.setIcon("./images/cercle/cercle14x14.png");
               marker12.setIcon("./images/cercle/cercle14x14.png");
               marker13.setIcon("./images/cercle/cercle14x14.png");
               marker14.setIcon("./images/cercle/cercle14x14.png");
               marker15.setIcon("./images/cercle/cercle14x14.png");

            } else if(zoom > 20){

                marker.setIcon("./images/cercle/cercle25x25.png");
                marker1.setIcon("./images/cercle/cercle25x25.png");
                marker2.setIcon("./images/cercle/cercle25x25.png");
                marker3.setIcon("./images/cercle/cercle25x25.png");
                marker4.setIcon("./images/cercle/cercle25x25.png");
                marker5.setIcon("./images/cercle/cercle25x25.png");
                marker6.setIcon("./images/cercle/cercle25x25.png");
                marker7.setIcon("./images/cercle/cercle25x25.png");
                marker8.setIcon("./images/cercle/cercle25x25.png");
                marker9.setIcon("./images/cercle/cercle25x25.png");
                marker10.setIcon("./images/cercle/cercle25x25.png");
                marker11.setIcon("./images/cercle/cercle25x25.png");
                marker12.setIcon("./images/cercle/cercle25x25.png");
                marker13.setIcon("./images/cercle/cercle25x25.png");
                marker14.setIcon("./images/cercle/cercle25x25.png");
                marker15.setIcon("./images/cercle/cercle25x25.png");
            }
        });*/

   }
   //   , 800);


    //setTimeout(
    //, 1000);


/*


$timeout(function() {
    $scope.zoomer();
  }, 2000);  // update every 2 seconds


*/
//};


  $scope.logout = function () {
    AuthService.logout().then(
      function () {
        $location.path('/');
      },
      function (error) {
        $scope.error = error;
      }
    );
  };

});