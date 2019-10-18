import React, { useState } from 'react';
import { render, hydrate} from 'react-dom';
import './index.css';
import './App.css';
import { createBrowserHistory } from 'history'
import * as Examples from './examples'
import { Router, Route, Link, Redirect, Switch } from 'react-router-dom'

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
    <button onClick={toggleFlag} id="menu-button">{flag ? '>' : '<'}</button>
    {children}
  </main>
}

const Root = () => <Router history={history}>
  <Layout routeComps={_routeComps}>
    <Switch>
      {_routeComps.map(props => <Route {...props} />)}
      <Route render={() => <Redirect to="/PlainText" />} />
    </Switch>
  </Layout>
</Router>


const rootElement = document.getElementById("root");

if (rootElement != null && rootElement.hasChildNodes()) {
  hydrate(<Root />, rootElement);
} else {
  render(<Root />, rootElement);
}