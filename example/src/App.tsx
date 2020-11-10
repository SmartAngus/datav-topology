import React from 'react'

import { Layout,Preview } from 'bici-datav-npm'
import 'antd/dist/antd.css'
import 'bici-datav-npm/dist/index.css'
import { Route, BrowserRouter } from 'react-router-dom';


const App = () => {
  return <BrowserRouter>
    <Route exact path="/" component={Layout} />
    <Route path="/preview" component={Preview} />
  </BrowserRouter >
}

export default App
