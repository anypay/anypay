require('dotenv').config();

var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  httpAdapter: 'https', // Default
  apiKey: process.env.GOOGLE_MAPS_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};


var geocoder = NodeGeocoder(options);

export async function geodecode( latitude, longitude ){
 
  try{

    let geo = await geocoder.reverse({lat: latitude, lon:longitude}) 
    console.log(geo)

  }catch(error){

    console.log(error)
  }


}


export async function geocode(address) {

  let geo = {}

  let resp = await geocoder.geocode({address});

  geo['latitude'] = resp[0].latitude

  geo['longitude'] = resp[0].longitude 

  if( resp[0].country ){
    geo['country'] =  resp[0].country    
    if( resp[0].country === 'United States'){
      geo['state'] = resp[0].administrativeLevels.level1long
    }
    if( resp[0].city ){
      geo['city'] = resp[0].city
    }

  }
  console.log(geo)

  return geo;

}

