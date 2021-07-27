import { BrowserRouter, Switch, Route } from "react-router-dom"

import HomePage from "./pages/HomePage.js"
import MainApp from "./pages/MainApp.js"
import Page404 from "./pages/Page404"
import WebHook from "./service/WebHook.js"

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/app" exact component={MainApp} />
        <Route path="/app/webhook/results" exact component={WebHook} />
        <Route path="/"  component={Page404} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
