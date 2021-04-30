import React from 'react';
import {
	HashRouter as Router,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from 'components/Navigation';
import User from './User';

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
	return (
		<Router>
			{isLoggedIn && <Navigation refreshUser={refreshUser} userObj={userObj} />}
			<Switch>
				{isLoggedIn ? (
					<>
						<Route exact path="/">
							<Home userObj={userObj} />
						</Route>
						<Route exact path="/profile">
							<Profile refreshUser={refreshUser} userObj={userObj} />
						</Route>
						<Route exact path="/user">
							<User refreshUser={refreshUser} userObj={userObj} />
						</Route>
						<Redirect from="*" to="/" />
					</>
				) : (
					<>
						<Route exact path="/">
							<Auth />
						</Route>
						<Redirect from="*" to="/" />
					</>
				)}
			</Switch>
		</Router>
	);
};

export default AppRouter;

// <> : Fragment 인데 부모요소가 없을 때  많은 요소들을 render 하고 싶을 때씀
