import Rweet from 'components/Rweet';
import { dbService } from 'fBase';
import React, { useEffect, useState } from 'react';
import RweetFactory from 'components/RweetFactory';
import Modal from 'components/Modal';

const Home = ({ userObj }) => {
	const [rweets, setRweets] = useState([]);
	const [rweetObj, setRweetObj] = useState();
	const [onModal, setOnModal] = useState(false);
	const [isOwner, setIsOwner] = useState();

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
			setRweets([]);
			setRweetObj();
			setOnModal(false);
			setIsOwner();
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
							setOnModal={setOnModal}
							setRweetObj={setRweetObj}
							setIsOwner={setIsOwner}
							userObj={userObj}
						/>
					))}
				</div>
				<div className="side_container">
					<RweetFactory userObj={userObj} />
				</div>
			</div>
			{onModal ? (
				<Modal
					rweetObj={rweetObj}
					setRweetObj={setRweetObj}
					setOnModal={setOnModal}
					isOwner={isOwner}
				/>
			) : (
				<></>
			)}
		</>
	);
};

export default Home;
