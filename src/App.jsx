import { useState } from 'react'

import './App.css'
import Chart from './modules/Chart'
import Table from './modules/Table'
import TemperatureMap from './modules/TemperatureMap'

function App() {

  return (

    <div className="parent">
      <div className="navbar">

      </div>
      <div className="content">
        
        <TemperatureMap/>
      </div>
    </div>

  )
}

export default App
