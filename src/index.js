
import "./style.css"
import locationIcon from "./icon-location.svg"

var map;

console.log(process.env.GEO_API);

const DOM_error_text = document.querySelector(".error__text");
const DOM_form = document.querySelector("form");
const DOM_map = document.getElementById("map")

const DOM_ip_col = document.getElementById("ip__data");
const DOM_location_col = document.getElementById("location__data");
const DOM_timezone_col = document.getElementById("timezone__data");
const DOM_isp_col = document.getElementById("isp__data");


const EMAIL_REGEX = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
const DOMAIN_REGEX = /^(?=.{1,253}\.?$)(?:(?!-|[^.]+_)[A-Za-z0-9-_]{1,63}(?<!-)(?:\.|$)){2,}$/

/*
async function getApiKey (){
  const res = await fetch("./config.json");
  const json = await res.json();

  return json.apiKey
};
*/

function getParameter(input){
  switch(true){
    case EMAIL_REGEX.test(input):
      return "email"
    case DOMAIN_REGEX.test(input):
      return "domain"
    case IP_REGEX.test(input): 
      return "ipAddress"
    default:
      return false
  }
}



async function generateMap(val){
    const apiKey = process.env.GEO_API;
    if (!getParameter(val)){
      DOM_error_text.textContent = `Your input format is incorrect`
      return 
    }
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&${getParameter(val)}=${val}`
    try{
        const res = await fetch(url)
        if (!res.ok){
            throw new Error(`Response status: ${res.status}`)
        }
        const json = await res.json();

        const {location,ip,isp} = await json;
        const {city,country,region,postalCode,lat,lng,timezone} = await location

        if (map != undefined || map != null) {
          map.off();
          map.remove();
        }

        map = L.map(DOM_map,{scrollWheelZoom:false}).setView([lat,lng],18);

        var greenIcon = L.icon({
        iconUrl: locationIcon,

        iconSize:     [60, 80], 
        shadowSize:   [50, 64], 
        iconAnchor:   [35, 80], 
        shadowAnchor: [4, 62],  
        popupAnchor:  [-3, -76] 
    });

        L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            
        let marker = L.marker([lat,lng],{
            icon: greenIcon,
        }).addTo(map)


        ip ? DOM_ip_col.textContent = ip : null;
        isp ? DOM_isp_col.textContent = isp : null;
        (postalCode || region || city) ? DOM_location_col.textContent = `${region}, ${city} ${postalCode}` : null;
        timezone ? DOM_timezone_col.textContent = `UTC ${timezone}` : null;

        DOM_error_text.textContent = ""
    } catch(err) {
        console.error(err.message)
        DOM_error_text.textContent = err.message
    }
}

function onFormSubmit (e) {
  e.preventDefault()
  const form_input = e.target[0].value;
  generateMap(form_input)
}

DOM_form.addEventListener("submit", onFormSubmit)

