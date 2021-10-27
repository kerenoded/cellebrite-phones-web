import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const StyledNavLink = (props: any) => <NavLink {...props} />

export default styled(StyledNavLink)`
  color: black;
  margin: 5px 8px;
  text-decoration: none;
  border-bottom: solid 0px;

  transition: 200ms;

  &.active {
    color: red;
    border-bottom: solid 3px red;
  }

  &:hover {
    color: #888;
  }

`
