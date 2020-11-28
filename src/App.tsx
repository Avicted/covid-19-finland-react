import React from 'react'
import './theme/app.css'
import 'twin.macro'
import Dashboard from './features/dashboard/containers/Dashboard'
import { Provider } from 'react-redux'
import store from './framework/store'
import ApplicationComponent from './framework/components/ApplicationComponent'
import { HashRouter, Route, Switch } from 'react-router-dom'

;(window as any).store = store
function App() {
    return (
        <Provider store={store}>
            <HashRouter>
                <ApplicationComponent>
                    <Switch>
                        <Route exact path="/">
                            <Dashboard />
                        </Route>
                    </Switch>
                </ApplicationComponent>
            </HashRouter>
        </Provider>
    )
}

export default App
