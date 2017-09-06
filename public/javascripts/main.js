/**
 * Created by smgallac on 20/06/2017.
 */

function register(token){
    console.log('registering for SSE streams with token: '+token);
    var eventUrl = new EventSource("https://realtime.opensensors.io/v1/events/topics//orgs/icri/qeop/nsc/bat1?token="+token);
    eventUrl.onmessage = function(event) {
        document.getElementById("result").innerHTML += event.data;
    }
}

function hello(){
    console.log("hello world");
}