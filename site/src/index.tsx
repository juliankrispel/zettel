// @ts-ignore
import {importMDX} from 'mdx.macro'
import * as React from 'react';
import { useState, lazy, Suspense } from 'react';
import { render, hydrate} from 'react-dom';
import './index.css';
import { createBrowserHistory } from 'history'
import styled from 'styled-components'
import Examples from './examples'
import { Router, Route, Link, Switch } from 'react-router-dom'
import './typography'

const Readme = lazy(() => importMDX('../../README.md'))
const Container = styled.article`
  padding: 1em;
`

const Content = () =>
  <Suspense fallback={<div>Loading...</div>}>
    <Container>
      <Readme />
    </Container>
  </Suspense>

const exampleModules: { [key: string]: any } = {...Examples}

type RouteComps = {
  path: string,
  component: any
}[]

const _routeComps: RouteComps = Object.keys(Examples).map((key: string) => ({
  name: key,
  path: `/${key.toLowerCase().replace(/\s/gi, '-')}`,
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
        {routeComps.map((route: any, i) => (
          <li onMouseUp={toggleFlag} key={`${route.path}-${i}`}><Link to={route.path}>{route.name}</Link></li>
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
      {_routeComps.map((props) => <Route key={props.path} {...props} />)}
      <Route render={() => <Content />} />
    </Switch>
  </Layout>
</Router>


const rootElement = document.getElementById("root");

if (rootElement != null && rootElement.hasChildNodes()) {
  hydrate(<Root />, rootElement);
} else {
  render(<Root />, rootElement);
}