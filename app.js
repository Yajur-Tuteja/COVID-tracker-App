const apiURL="https://disease.sh/v3/covid-19/countries";
const covidSearch=document.getElementsByClassName("covidSearch")[0];
const search=document.getElementById("search");

async function getCovidData() {
    const apiResponse = await fetch(apiURL);
    const data=await apiResponse.json();
    console.log(data);
    return data;
}

function formatNumber(num) {
    return String(num).replace(/(.)(?=(\d{3})+$)/g, "$1,");
  }

async function worldIndData(){
    const response=await getCovidData();
    const worldStatE1=document.getElementsByClassName("world_status")[0];
    const indStatE1=document.getElementsByClassName("india_status")[0];
    console.log(indStatE1);
    console.log(worldStatE1);

    let worldCases=0;
    let worldDeaths=0;
    let worldRecovered=0;
    let worldData="";
    for(const data of response)
    {
        worldData={
            cases:(worldCases+=data.cases),
            deaths:(worldDeaths+=data.deaths),
            recovered:(worldRecovered+=data.recovered),
        }; 
    }
    
    worldStatE1.innerHTML=`
    <div class="status_item">
        <h2 id="wconfirmed">${worldData.cases}</h2>
         <p class="confirmed">Confirmed</p>
    </div>
    <div class="status_item">
        <h2 id="wdeaths">${worldData.deaths}</h2>
        <p class="deaths">Deaths</p>
    </div>
    <div class="status_item">
        <h2 id="wrecovered">${worldData.recovered}</h2>
        <p class="recovered">Recovered</p>
    </div>
    `;
    worldNumStatEffect({wconfirmed,wdeaths,wrecovered}, worldData);
    
   for(const data of response){
        if(data.country==="India")
        {
            indStatE1.innerHTML=`
            <div class="status_item">
                <h2 id="iconfirmed">${data.cases}</h2>
                <p class="confirmed">Confirmed</p>
            </div>
            <div class="status_item">
                <h2 id="ideaths">${data.deaths}</h2>
                <p class="deaths">Deaths</p>
            </div>
            <div class="status_item">
                <h2 id="irecovered">${data.recovered}</h2>
                <p class="recovered">Recovered</p>
            </div>
             `;
             indNumStatEffect({iconfirmed,ideaths,irecovered},data);
        }
    }   
    
    for (const data of response){
        search.innerHTML+=`
        <option value="${data.country}">${data.country}</option>
        `;
    }
}


async function getCovidDataPerCountry(country){
    const searchResult=document.getElementsByClassName("search_result")[0];

    const loader = document.createElement("img");
    loader.className = "loader";
    loader.src = "loader.gif";
    covidSearch.appendChild(loader);
    searchResult.innerHTML = "";

    const apiResponse=await fetch(`https://disease.sh/v3/covid-19/countries/${country}`);
    const data=await apiResponse.json();
    
    loader.remove();

    searchResult.innerHTML=`
            <div class="flag">
                <img src=${data.countryInfo.flag} alt="">
            </div>
            <div class="results">
                 <h2>&nbsp${data.country}</h2>
                 <ul>
                    <li> Cases: ${formatNumber(data.cases)} |  Active: ${formatNumber(data.active)} </br>
                    <li> Deaths:${formatNumber(data.deaths)}
                    <li> Recovered: ${formatNumber(data.recovered)} | Critical: ${formatNumber(data.critical)}                
                        </p>
                  </ul>
             </div>
          `;
}


function worldNumStatEffect(id, data) {
    const confirmed = new CountUp(id.wconfirmed, 0, data.cases);
    const deaths = new CountUp(id.wdeaths, 0, data.deaths);
    const recovered = new CountUp(id.wrecovered, 0, data.recovered);
    confirmed.start();
    deaths.start();
    recovered.start();
}
  
function indNumStatEffect(id, data) {
    const confirmed = new CountUp(id.iconfirmed, 0, data.cases);
    const deaths = new CountUp(id.ideaths, 0, data.deaths);
    const recovered = new CountUp(id.irecovered, 0, data.recovered);
    confirmed.start();
    deaths.start();
    recovered.start();
}

document.addEventListener("DOMContentLoaded",worldIndData);

search.onchange=()=>{
    const searchTerm=search.value;
    getCovidDataPerCountry(searchTerm);
}