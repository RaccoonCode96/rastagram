import Rweet from 'components/Rweet';
import { dbService } from 'fBase';
import React, { useEffect, useState } from 'react';
import RweetFactory from 'components/RweetFactory';

const Home = ({ userObj }) => {
	const [rweets, setRweets] = useState([]);

	useEffect(() => {
		const getData = dbService
			.collection('rweets')
			.orderBy('createdAt', 'desc')
			.onSnapshot((snapshot) => {
				const rweetArray = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setRweets(rweetArray);
			});
		return () => {
			getData();
		};
	}, []);

	return (
		<>
			<div className="home_container">
				<div className="main_container">
					{rweets.map((rweet) => (
						<Rweet
							key={rweet.id}
							rweetObj={rweet}
							isOwner={rweet.creatorId === userObj.uid}
						/>
					))}
				</div>
				<div className="side_container">
					<RweetFactory userObj={userObj} />
				</div>
			</div>
		</>
	);
};

export default Home;
