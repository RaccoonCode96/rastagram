import Rweet from 'components/Rweet';
import { dbService } from 'fBase';
import React, { useEffect, useState } from 'react';
import RweetFactory from 'components/RweetFactory';

const Home = ({ userObj }) => {
	const [rweets, setRweets] = useState([]);

	useEffect(() => {
		dbService
			.collection('rweets')
			.orderBy('createdAt', 'desc')
			.onSnapshot((snapshot) => {
				const rweetArray = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setRweets(rweetArray);
			});
	}, []);

	return (
		<div>
			<RweetFactory userObj={userObj} />
			<div>
				{rweets.map((rweet) => (
					<Rweet
						key={rweet.id}
						rweetObj={rweet}
						isOwner={rweet.creatorId === userObj.uid}
					/>
				))}
			</div>
		</div>
	);
};

export default Home;
