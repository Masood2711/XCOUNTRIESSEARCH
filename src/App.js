import React, {useEffect, useState} from "react";
import "./App.css";

const API_URL="https://countries-search-data-prod-812920491762.asia-south1.run.app/countries";


function App() {

  const [countries,setCountries]=useState([]);
  const [search,setSearch]=useState("");

  useEffect(()=>{
    fetch(API_URL).then((response)=>response.json()).then((data)=>{
      setCountries(data);
    }).catch((error)=>{
      console.error("Error feching countries",error);
    })
  },[]);

  const filteredCountries=countries.filter((country)=>country.common.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="App">
      <div className="search-container">
        <input type="text" placeholder="Search for Countries" value={search} onChange={(event)=>setSearch(event.target.value)}/>
      </div>
      <div className="countriesContainer">
        {filteredCountries.map((country)=>(
          <div className="countryCard" key={country.common}>
            <img src={country.png} alt={country.common}/>
            <p>{country.common}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
