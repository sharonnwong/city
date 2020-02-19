import React, {useContext,useState} from 'react';
import './App.css';
import {Input, Button} from 'antd'

const context = React.createContext()

function App() {
  const [state, setState] = useState({
    searchTerm:''
  })
  return <context.Provider value={{
    ...state,
    set: v=> setState({...state, ...v})
  }}>
    <div className="App">
      <Body />      
    </div>
  </context.Provider>
}

function Body() {
  const ctx = useContext(context)

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
          if(e.key==='Enter' && ctx.searchTerm) search(ctx)
        }}
      />
      <Button className="button" shape="circle" icon="search" onClick={()=> search(ctx)} disabled={!ctx.searchTerm}/>
    </div>
  </header>
}

async function search({searchTerm, set}){
  console.log(searchTerm)
  set({searchTerm:''})
}

export default App;
