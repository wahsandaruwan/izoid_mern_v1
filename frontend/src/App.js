import Home from "./Components/Pages/Home"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Dashboard from "./Components/Pages/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/dashboard" exact>
          <Dashboard />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
