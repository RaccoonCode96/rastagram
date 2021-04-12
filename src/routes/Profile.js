import Rweet from 'components/Rweet';
import { authService, dbService } from 'fBase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Profile = ({ userObj, refreshUser }) => {
	const history = useHistory();
	const [rweets, setRweets] = useState([]);
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

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
	}, []);

	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setNewDisplayName(value);
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		if (userObj.displayName !== newDisplayName) {
			await userObj.updateProfile({
				displayName: newDisplayName,
			});
		}
		refreshUser();
	};

	return (
		<>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					placeholder="Display name"
					onChange={onChange}
					value={newDisplayName}
				/>
				<input type="submit" value="Update Profile" />
			</form>
			<button onClick={onLogOutClick}>Log Out</button>
			<div>
				{rweets.map((rweet) => (
					<Rweet
						key={rweet.id}
						rweetObj={rweet}
						isOwner={rweet.creatorId === userObj.uid}
					/>
				))}
			</div>
		</>
	);
};
export default Profile;
