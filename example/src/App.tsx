import React from 'react'

import { EditorLayout,Preview } from 'bici-datav-npm'
import 'antd/dist/antd.css'
import 'bici-datav-npm/dist/index.css'
import { Route, BrowserRouter } from 'react-router-dom';


const App = () => {
  return <BrowserRouter>
    <Route exact path="/" component={EditorLayout} />
    <Route path="/preview" component={Preview} />
  </BrowserRouter >
}

export default App
