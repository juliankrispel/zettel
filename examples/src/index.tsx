import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import App from './examples/KittenAndLink';
import { createBrowserHistory } from 'history'
import * as Examples from './examples'
import { Router, Route, Link } from 'react-router-dom'

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

const Layout = ({ children, routeComps }: LayoutProps) => <div className="app">
  <nav>
    <ul>
      {routeComps.map((route: any) => (
        <li key={route.path}><Link to={route.path}>{route.path.substr(1)}</Link></li>
      ))}
    </ul>
  </nav>
  {children}
</div>

ReactDOM.render(
  <Router history={history}>
    <Layout routeComps={_routeComps}>
      <>
        <Route exact path="/" component={_routeComps[0].component} />
        {_routeComps.map(props => <Route {...props} />)}
      </>
    </Layout>
  </Router>
, document.getElementById('root'));