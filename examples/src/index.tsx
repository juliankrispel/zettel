import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import { createBrowserHistory } from 'history'
import * as Examples from './examples'
import { Router, Route, Link, Redirect } from 'react-router-dom'

const exampleModules: { [key: string]: any } = {...Examples}

type RouteComps = {
  path: string,
  component: any
}[]

const _routeComps: RouteComps = Object.keys(Examples).map((key: string) => ({
  path: `/${key}`,
  component: exampleModules[key]
}))

const history = createBrowserHistory()

type LayoutProps = {
  children: React.ReactElement,
  routeComps: RouteComps
}

const Layout = ({ children, routeComps }: LayoutProps) => {
  const [flag, setFlag] = useState(false)
  const toggleFlag = () => setFlag(!flag)

  return <main className={`app ${flag ? 'menu-toggled': ''}`}>
    <nav>
      <ul>
        {routeComps.map((route: any) => (
          <li onMouseUp={toggleFlag} key={route.path}><Link to={route.path}>{route.path.substr(1)}</Link></li>
        ))}
      </ul>
    </nav>
    <button onClick={toggleFlag} id="menu-button">⇠</button>
    {children}
  </main>
}

ReactDOM.render(
  <Router history={history}>
    <Layout routeComps={_routeComps}>
      <>
        <Redirect from="/" to="/PlainText" />
        {_routeComps.map(props => <Route {...props} />)}
      </>
    </Layout>
  </Router>
, document.getElementById('root'));