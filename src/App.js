import React, {useContext,useState} from 'react';
import './App.css';
import {Input, Button} from 'antd'
import {Bar} from 'react-chartjs-2'
import * as moment from 'moment'

const context = React.createContext()

function App() {
  const [state, setState] = useState({
    searchTerm:''
  })
  return <context.Provider value={{
    ...state,
    set: v=> setState(current=>{
      return {...current, ...v}
     })
  }}>
    <div className="App">
      <Header />   
      <Body />   
    </div>
  </context.Provider>
}

function Header() {
  const ctx = useContext(context)
  const {searchTerm} = ctx
  const [showResult,setShowResult] = useState(false)
  return <header className="App-body">
    <link href="https://fonts.googleapis.com/css?family=Reenie+Beanie&display=swap" rel="stylesheet"></link>
    <div className="city">
      <h1>City</h1>
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
      <Button className="button" shape="circle" icon="search" onClick={()=> search(ctx)} disabled={!searchTerm} />
    </div>
  </header>
}

function Body(){
  const ctx = useContext(context)
  const {error, weather, mode} = ctx
  console.log(weather)
  let data
  if(weather){
    console.log(weather)
    data = {
      labels:weather['hourly'].data.map(d=> {let format = 'dd hh:mm'
      return moment(d.time*1000).format(format)}),
      datasets: [{
        label: 'Temperature',
        data: weather.daily.data.map(d=>d.temperatureHigh),
        backgroundColor: 'rgba(132,99,255,0.7)',
        borderColor: 'rgba(132,99,255,1)',
        hoverBackgroundColor: 'rgba(132,99,255,0.4)',
        hoverBorderColor: 'rgba(132,99,255,1)',
      }]
    }
  } 
  return <div className="App-body">
    {error && <div className="error">{error}</div>}
    {data && <div>
      <Bar data={data}
        width={800} height={400}
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


/*flickrapi = 'eb9dd006e876e2039ef7eae792448e2f'*/

export default App;
