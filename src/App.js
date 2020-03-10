import React, {useContext,useState} from 'react';
import './App.css';
import {Input, Button, Icon} from 'antd'
import { Tabs } from 'antd';
import {Bar, Line} from 'react-chartjs-2'
import * as moment from 'moment'
import {Link} from "react-scroll"
import { render } from 'react-dom'
import IosArrowDropdownCircle from 'react-ionicons/lib/IosArrowDropdownCircle'


const context = React.createContext()
const { TabPane } = Tabs;

function App() {
  const [state, setState] = useState({
    searchTerm:''
  })
  /*const [showResult, setShowResult] = useState(false);*/
  return <context.Provider value={{
    ...state,
    set: v=> setState(current=>{
      return {...current, ...v}
     })
  }}>
    <div className="App">
      <Header />
      {/* <Tabs className="tabs">
        <TabPane tab="Hourly Temperature" key="1">
          <Body />
        </TabPane>
        <TabPane tab="Daily Temperature" key="2">
          <Body2 />
        </TabPane>
      </Tabs> */}
      
      
      {/* <Picture /> */}
    </div>

  </context.Provider>
}

function Header() {
  const ctx = useContext(context)
  const {searchTerm} = ctx
  const [showButton, setShowButton] = useState(false);
  const [showResult, setShowResult] = useState(false);
  return <div><header className="App-body">
    <link href="https://fonts.googleapis.com/css?family=Reenie+Beanie&display=swap" rel="stylesheet"></link>
    <div className="city">
      <h1>City</h1>
      
      <h6>A city is its skyline, its weather, and its people.<br/></h6>
    </div>
    <div className="searching">
      <Input 
        className="input"
        value={ctx.searchTerm}
        onChange={e=> ctx.set({searchTerm:e.target.value})}
        placeholder="Search for a city"
        onKeyPress={e=>{
          if(e.key==='Enter' && searchTerm) search(ctx)
        }}
      />
      <Button className="button" shape="circle" icon="search" 
              onClick={()=> {search(ctx);setShowButton(true);}} disabled={!searchTerm} />
    </div>
    {showButton && 
    <div >
      <Link
        onClick={()=> {setShowButton(false);setShowResult(true);}}
        activeClass="active"
        to="result"
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
      >
        <IosArrowDropdownCircle className="iconwrap" fontSize="60px" color="white" beat={true} id="icon"/>
      </Link>
    </div>}
  </header>
  <div id="result">
  {showResult &&
    <Tabs className="tabs" id="tab">
    <TabPane tab="Hourly Temperature" key="1">
      <Body />
    </TabPane>
    <TabPane tab="Daily Temperature" key="2">
      <Body2 />
    </TabPane>
  </Tabs>
  }</div>
  </div>
}

function Body(){
  const ctx = useContext(context)
  const {error, weather, mode} = ctx
  console.log(weather)
  let summary
  let data
  if(weather){
    console.log(weather)
    data = {
      labels:weather['hourly'].data.map(d=> {let format = 'dd hh:mm'
      return moment(d.time*1000).format(format)}),
      datasets: [{
        label: 'Hourly Temperature',
        data: weather.hourly.data.map(d=>d.temperature),
        
        borderColor: 'rgba(252,205,205)',
        hoverBackgroundColor: 'rgba(235,166,166)',
        hoverBorderColor: 'rgba(235,166,166)',
      }]
    }
    summary = weather['hourly'].summary
  }

  /*<div className="hourly-summary">{summary}</div> add this after 'return'*/
  return <div className="App-body">
    
    {error && <div className="error">{error}</div>}
    {data && <div className="hourly-data">
      <Line data={data}
        width={600} height={300}
      />
    </div>}
  </div>
}

function Body2(){
  const ctx = useContext(context)
  const {error, weather, mode} = ctx
  console.log(weather)
  let data
  if(weather){
    console.log(weather)
    data = {
      labels:weather['daily'].data.map(d=> {let format = 'ddd'
      return moment(d.time*1000).format(format)}),
      datasets: [{
        label: 'Daily Temperature',
        data: weather.daily.data.map(d=>(d.temperatureHigh+d.temperatureLow)/2),
        backgroundColor: 'rgba(252,205,205)',
        borderColor: 'rgba(252,205,205)',
        hoverBackgroundColor: 'rgba(235,166,166)',
        hoverBorderColor: 'rgba(235,166,166)',
      }]
    }
  } 
  return <div className="App-body">
    {error && <div className="error">{error}</div>}
    {data && <div>
      <Bar data={data}
        width={600} height={300}
      />
    </div>}
  </div>
}

// function Picture(){
//   const ctx = useContext(context)

// }

async function search({searchTerm, set}){
  try {
    console.log(searchTerm)
    const term = searchTerm
    set({error:''}) /*set the searchTerm into an empty string */

    const osmurl = `https://nominatim.openstreetmap.org/search/${term}?format=json` 
    const response = await fetch(osmurl)
    const location = await response.json()
    if(!location){
      return set({error:'No city matching that query'})
    }
    const city = location[0]
    console.log(city.lat,city.lon)

    const key = '59ba7e760e021499470662acc50bb222'
    const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${key}/${city.lat},${city.lon}`
    const response2 = await fetch(url)
    const weather = await response2.json()
    console.log(weather)
    set({weather})
  } catch(e) {
    set({error: e.message})
  }
}

async function searchFlickr({searchTerm, set}){
  try {
    console.log(searchTerm)
    const term = searchTerm
    set({error:''}) 
    const key = 'eb9dd006e876e2039ef7eae792448e2f'
    const url = `https://api.flickr.com/services/rest/`
  } catch(e) {
    set({error: e.message})
  }
}
/*flickrapi = 'eb9dd006e876e2039ef7eae792448e2f'*/


// def flickrREST(baseurl = 'https://api.flickr.com/services/rest/',
//     method = 'flickr.photos.search',
//     api_key = flickr_key.key,
//     format = 'json',
//     params={},
//     printurl = False
//     ):
//     params['method'] = method
//     params['api_key'] = api_key
//     params['format'] = format
//     if format == "json": params["nojsoncallback"]=True
//     url = baseurl + "?" + urllib.parse.urlencode(params)
//     if printurl:
//         print(url)
//     return safeGet(url)

export default App;
