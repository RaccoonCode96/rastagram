import React from 'react';
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import Auth from 'routes/Auth'; 
import Home from 'routes/Home';

const AppRouter = ({isLoggedIn}) => {
    return (
        <Router>
            <Switch>
                {isLoggedIn ? (
                    <>
                    <Route exact path="/">
                        <Home />
                    </Route>
                </> 
                ) : (
                    <Route exact path="/">
                        <Auth />
                    </Route>
                )}
            </Switch>
        </Router>
    )
}

export default AppRouter; 


// <> : Fragment 인데 부모요소가 없을 때  많은 요소들을 render 하고 싶을 때씀