import { dbService, storageService } from 'fBase';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const RweetFactory = ({ userObj }) => {
	const [rweet, setRweet] = useState('');
	const [attachment, setAttachment] = useState('');

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
			photoUrl: userObj.photoURL,
			displayName: userObj.displayName,
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
		<form className="form_rweets" onSubmit={onSubmit}>
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
					<img src={attachment} alt="attachment" width="220px" height="220px" />
					<button onClick={onClearAttachment}>Clear</button>
				</div>
			)}
		</form>
	);
};

export default RweetFactory;
