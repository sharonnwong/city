import React, {useContext,useState} from 'react';
import './App.css';
import {Input, Button, Icon} from 'antd'
import {Bar} from 'react-chartjs-2'
import * as moment from 'moment'
import {Link} from "react-scroll"
import { render } from 'react-dom'
import IosArrowDropdownCircle from 'react-ionicons/lib/IosArrowDropdownCircle'


const context = React.createContext()

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
      <Body />
      <Body2 />
    </div>

  </context.Provider>
}

function Header() {
  const ctx = useContext(context)
  const {searchTerm} = ctx
  const [showButton, setShowButton] = useState(false);
  return <header className="App-body">
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
        activeClass="active"
        to="result"
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
        onClick={()=> setShowButton(false)}
      >

        <IosArrowDropdownCircle className="iconwrap" fontSize="60px" color="white" beat={true} id="icon"/>
      </Link>
    </div>}
  </header>
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
        backgroundColor: 'rgba(252,205,205)',
        borderColor: 'rgba(252,205,205)',
        hoverBackgroundColor: 'rgba(235,166,166)',
        hoverBorderColor: 'rgba(235,166,166)',
      }]
    }
    summary = weather['hourly'].summary
  }

  /*<div className="hourly-summary">{summary}</div> add this after 'return'*/
  return <div className="App-body" id="result">
    
    {error && <div className="error">{error}</div>}
    {data && <div className="hourly-data">
      <Bar data={data}
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

    const flickrurl = ``
  } catch(e) {
    set({error: e.message})
  }
}
/*flickrapi = 'eb9dd006e876e2039ef7eae792448e2f'*/

export default App;
