import Rweet from 'components/Rweet';
import { authService, dbService } from 'fBase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ProfileFactory from 'components/ProfileFactory';
import Modal from 'components/Modal';

const Profile = ({ userObj, refreshUser }) => {
	const history = useHistory();
	const [rweets, setRweets] = useState([]);
	const [rweetObj, setRweetObj] = useState();
	const [onModal, setOnModal] = useState(false);
	const [isOwner, setIsOwner] = useState();
	const [updated, setUpdated] = useState();

	const onLogOutClick = () => {
		authService.signOut();
		history.push('/');
	};

	const getMyRweets = async () => {
		const rweetObj = await dbService
			.collection('rweets')
			.where('creatorId', '==', userObj.uid)
			.orderBy('createdAt', 'desc')
			.get();
		const rweetArray = rweetObj.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		setRweets(rweetArray);
	};

	useEffect(() => {
		getMyRweets();
		return () => {
			setRweets([]);
			setRweetObj();
			setOnModal(false);
			setIsOwner();
			getMyRweets();
		};
	}, [updated]);
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
					<div className="profile_section">
						<div className="profile_show">
							{userObj.photoURL && (
								<img
									className="profile_portrait"
									alt="user_photo"
									src={userObj.photoURL}
									width="50px"
									height="50px"
								/>
							)}
							{userObj.displayName && (
								<h2 className="profile_name">{userObj.displayName}</h2>
							)}
							<button onClick={onLogOutClick}>Log Out</button>
						</div>
						<ProfileFactory refreshUser={refreshUser} userObj={userObj} />
					</div>
				</div>
			</div>
			{onModal ? (
				<Modal
					setUpdated={setUpdated}
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
export default Profile;
