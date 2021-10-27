import React from 'react'
import NavLink from './NavLink'
import styled from 'styled-components'

const Navbar = () =>
  <nav >
    <NavLink exact to='/'>Home</NavLink>
    <NavLink to='/about'>About</NavLink>
  </nav>

export default styled(Navbar)`

`
