import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fBase';

function App() {
	const [init, setInit] = useState(false); // 처음에는 false이고 나중에 사용자 인식이 모두 끝났을 때 true를 통해 해당 화면을 render
	// const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userObj, setUserObj] = useState(null);
	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				// setIsLoggedIn(true);
				setUserObj(user);
			}
			// else {
			//   setIsLoggedIn(false);
			// }
			setInit(true);
		});
	}, []);

	return (
		<>
			{/* {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing..." } */}
			{init ? (
				<AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
			) : (
				'Initializing...'
			)}
		</>
	);
}

export default App;
