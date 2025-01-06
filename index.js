
const express=require('express');
const fetch=require('node-fetch');
require('dotenv').config(); 
console.log(process.env.API_key);
const Datastore=require('nedb');
const app=express();
app.listen(3000,() =>{console.log("listening at 3000")});

//database.insert({name:"brahim",status:"happy"});
//app.use(express.static('public'));
const database2=new Datastore('database2.db');
database2.loadDatabase();
app.use(express.static('weitherapp'));
app.use(express.json({ limit: '2mb' })); 




app.post('/weitherapi',async(request,response)=>{
    //console.log("data recive");
    //console.log(request.body);
    const data=request.body;
    const timestamp=Date.now();
   
    //get weither base on client locatoin
    
        const api_site="https://api.open-meteo.com/v1/forecast?current=apparent_temperature";
        const fetch_response= await fetch(api_site+`&latitude=${data.lat}&longitude=${data.long}`);
        const api_json=await fetch_response.json();
        console.log(api_json);
        //console.log(api_json[0].current.apparent_temperature);
        data.weither=api_json.current.apparent_temperature;
        //send data back
        response.json({
            status:"succses",
            timestamp:timestamp,
            latitude:data.lat,
            longitude:data.long,
            weither:data.weither
        });    
});




app.get('/give/:lat/:long',async(request,response)=>{
    /*const latlong=request.params.latlong.split(',');
    const lat=latlong[0];
    const long=latlong[1];*/
    const lat=request.params['lat'];
    const long=request.params['long'];

    const api_site=`https://api.open-meteo.com/v1/forecast?current=apparent_temperature&latitude=${lat}&longitude=${long}`;
    const fetch_response=await fetch(api_site);
    const json =await fetch_response.json();
    response.json(json);

});



app.post('/storedata' ,async(request,response)=>{
    const data=request.body;
    database2.insert(data);
    response.json({
        status:"data stored in database",
        
    });    

});


app.get('/map' ,async(request,response)=>{
    database2.find({}, (err,data)=>{
        if(err){
            response.end();
            return;
        }
        response.json(data);
});
});


