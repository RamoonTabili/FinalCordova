"use strict"; // Oppress this shit.

if (document.deviceready) {
    document.addEventListener('deviceready', onDeviceReady); // This is a device.
}
else {
    document.addEventListener('DOMContentLoaded', onDeviceReady); // This is without a device.
}

let pages = []; // used to store all our screens/pages
let links = []; // used to store all our navigation links
let standings = [];
let garray = [];
let refresh = [];

// Let's initiate this shit!

function onDeviceReady() {
    console.log("Ready!");
    serverData.getJSON();
    
    
    pages = document.querySelectorAll('[data-role="page"]');

    links = document.querySelectorAll('[data-role="nav"] a');
     
    for(let i=0; i<links.length; i++) {
        links[i].addEventListener("click", navigate);
    }
    
    document.getElementById("refreshR").addEventListener("click", serverData.getJSON);
    document.getElementById("refreshS").addEventListener("click", serverData.getJSON);
  // create some fake data so you can see how to use a table
  // fakeStandingsData();
    
}

document.addEventListener("DOMContentLoaded", function(){
    
});

let serverData = {
    url: "http://griffis.edumedia.ca/mad9014/sports/basketball.php ",
    httpRequest: "GET",
    getJSON: function () {
        
        // Add headers and options objects
        // Create an empty Request Headers instance
        let headers = new Headers();

        // Add a header(s)
        // key value pairs sent to the server

        headers.append("Content-Type", "text/plain");
        headers.append("Accept", "application/json; charset=utf-8");
        
        // simply show them in the console
        console.dir("headers: " + headers.get("Content-Type"));
        console.dir("headers: " + headers.get("Accept"));
        
        // Now the best way to get this data all together is to use an options object:
        
         // Create an options object
        let options = {
            method: serverData.httpRequest,
            mode: "cors",
            headers: headers
        };
        
        // Create an request object so everything we need is in one package
        let request = new Request(serverData.url, options);
        console.log(request);
           
        fetch(request)
            .then(function (response) {

                console.log(response);
                return response.json();
            })
            .then(function (data) {
                console.log(data); // now we have JS data, let's display it

                // Call a function that uses the data we recieved  
                displayData(data);
            })
            .catch(function (err) {
                alert("Error: " + err.message);
            });
    }
};

function navigate(ev) {
    ev.preventDefault(); 

    let link = ev.currentTarget; 
  console.log(link);
  // split a string into an array of substrings using # as the seperator
    let id = link.href.split("#")[1]; // get the href page name
  console.log(id);
    //update what is shown in the location bar
    history.replaceState({}, "", link.href);
    
    for(let i=0; i<pages.length; i++) {
        if(pages[i].id == id){
             pages[i].classList.add("active");
        } else {
            pages[i].classList.remove("active");
        }           
    }
}

function displayData(data) {
    console.log(data);
    
    console.log(data.teams);
    console.log(data.scores);
    
    let ul = document.querySelector(".results_list");
    ul.innerHTML = "";
    
    //standings = [];
    
    data.teams.forEach(function(item) {
       
        console.log(data.teams)
        
        let team = {
            id: item.name,
            points: 0,
            W: 0,
            L: 0,
            T: 0,
        };
        garray[item.id] = team;
        //standings.push(team);
    });
    
    data.scores.forEach(function(value) {
        
        let li = document.createElement("li");
        li.className = "score";
        let h3 = document.createElement("h3");
        h3.textContent = value.date;
        
        let homeTeam = null;
        let awayTeam = null;
        
        ul.appendChild(li);
        ul.appendChild(h3);
        
        let games = value.games;
        
        games.forEach(function (item) {
            
            homeTeam = getTeamName(data.teams, item.home);
            awayTeam = getTeamName(data.teams, item.away);
            
            let dg = document.createElement("div");
            
            let home = document.createElement("div");
            home.className = "home";
            home.innerHTML = homeTeam + " " + "<b>" + item.home_score + "</b>" + "&nbsp" + "<br>";
            let away = document.createElement("div");
            away.className = "away";
            away.innerHTML = "<b>" + item.away_score + " " + "</b>" + awayTeam + "&nbsp" + "<br>";
            
            dg.appendChild(home);
            dg.appendChild(away);
            ul.appendChild(dg);
            
            if (item.home_score > item.away_score) {
                garray[item.home].W++;
                garray[item.away].L++;
                garray[item.home].points += 2;
            }
            else if (item.home_score < item.away_score) {
                garray[item.away].W++;
                garray[item.home].L++;
                garray[item.away].points += 2;
            }
            else {
                garray[item.home].T++;
                garray[item.away].T++;
                garray[item.home].points += 1;
                garray[item.away].points += 1;
            }
            
        });
        
    });
    
    garray.sort(function compare(a, b) {
        if (a.W < b.W) {
            return 1;
        }
        if (a.W > b.W) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });
    
    console.log(garray);
    StandingsData();
    
//    localStorage.setItem("scores", JSON.stringify(data));
//    var myScoresData = JSON.parse(localStorage.getItem("scores"));
//    console.log("From LS:");
//    console.log(myScoresData);
    
}

function getTeamName(teams, id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            return teams[i].name;
        }
    }
    return "unknown";
}

function StandingsData() {
    
    let tbody = document.querySelector("#teamStandings tbody");
    tbody.innerHTML = "";
    
    garray.forEach(function(data) {
        //Sample Tables stuff here:
        let tr = document.createElement("tr");
        let tdn = document.createElement("td");
        tdn.textContent = data.id;
        let tdw = document.createElement("td");
        tdw.textContent = data.W;
        let tdl = document.createElement("td");
        tdl.textContent = data.L;
        let tdt = document.createElement("td");
        tdt.textContent = data.T;
        let tdp = document.createElement("td");
        tdp.textContent = data.points;
        tr.appendChild(tdn);
        tr.appendChild(tdw);
        tr.appendChild(tdl);
        tr.appendChild(tdt);
        tr.appendChild(tdp);
        tbody.appendChild(tr);
    });
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (b,a) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}