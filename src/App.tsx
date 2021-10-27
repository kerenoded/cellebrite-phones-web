import React from 'react';
import './App.scss';
import { Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar'
import PhonesPage from './pages/PhonesPage/PhonesPage'
import AboutPage from './pages/AboutPage'
import PageNotFound from './pages/PageNotFound'
import styled from 'styled-components'

const App = () =>
  <div className="App">
    <Navbar />
    <Switch>
      <Route exact path='/' component={PhonesPage} />
      <Route path='/about' component={AboutPage} />
      <Route component={PageNotFound} />
    </Switch>
  </div>

export default styled(App)`

`
