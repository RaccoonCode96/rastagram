import Rweet from 'components/Rweet';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from 'fBase';
import React, { useEffect, useState } from 'react';

const Home = ({ userObj }) => {
	const [rweet, setRweet] = useState('');
	const [rweets, setRweets] = useState([]);
	const [attachment, setAttachment] = useState('');

	useEffect(() => {
		dbService.collection('rweets').onSnapshot((snapshot) => {
			const rweetArray = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setRweets(rweetArray);
		});
	}, []);

	const onSubmit = async (event) => {
		event.preventDefault();
		let attachmentUrl = '';
		if (attachment !== '') {
			const attachmentRef = storageService
				.ref()
				.child(`${userObj.uid}/${uuidv4()}`);
			const response = await attachmentRef.putString(attachment, 'data_url');
			attachmentUrl = await response.ref.getDownloadURL();
		}
		const rweetObj = {
			text: rweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
			attachmentUrl,
		};
		await dbService.collection('rweets').add(rweetObj);
		setRweet('');
		setAttachment('');
	};

	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setRweet(value);
	};
	const onFileChange = (event) => {
		const {
			target: { files },
		} = event;
		const theFile = files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			const {
				currentTarget: { result },
			} = finishedEvent;
			setAttachment(result);
		};
		reader.readAsDataURL(theFile);
	};

	const onClearAttachment = () => {
		setAttachment(null);
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					value={rweet}
					onChange={onChange}
					type="text"
					placeholder="What's on your mind?"
					maxLength={120}
				/>
				<input type="file" accept="image/*" onChange={onFileChange} />
				<input type="submit" value="Rweet" />
				{attachment && (
					<div>
						<img src={attachment} alt="attachment" width="50px" height="50px" />
						<button onClick={onClearAttachment}>Clear</button>
					</div>
				)}
			</form>
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
