import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fBase';
import Load from './Load';

function App() {
	const [init, setInit] = useState(false);
	const [userObj, setUserObj] = useState(null);
	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setUserObj({
					photoURL: user.photoURL,
					displayName: user.displayName,
					uid: user.uid,
					updateProfile: (args) => user.updateProfile(args),
				});
			} else {
				setUserObj(null);
			}
			setInit(true);
		});
	}, []);
	const refreshUser = () => {
		const user = authService.currentUser;
		setUserObj({
			photoURL: user.photoURL,
			displayName: user.displayName,
			uid: user.uid,
			updateProfile: (args) => user.updateProfile(args),
		});
	};
	return (
		<>
			{init ? (
				<AppRouter
					refreshUser={refreshUser}
					isLoggedIn={Boolean(userObj)}
					userObj={userObj}
				/>
			) : (
				<Load />
			)}
		</>
	);
}

export default App;
