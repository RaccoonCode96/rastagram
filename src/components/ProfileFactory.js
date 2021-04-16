import { storageService } from 'fBase';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ProfileFactory = ({ userObj, refreshUser }) => {
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
	const [attachment, setAttachment] = useState('');

	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setNewDisplayName(value);
	};

	// const updateUrl = async (Array, attachmentUrl) => {
	// 	for (let docObj of Array) {
	// 		await dbService.doc(`rweet/${docObj.id}`).update({
	// 			photoUrl: attachmentUrl,
	// 		});
	// 	}
	// };

	const onSubmit = async (event) => {
		event.preventDefault();
		let attachmentUrl = '';
		if (attachment !== '') {
			const attachmentRef = storageService
				.ref()
				.child(`${userObj.uid}/${uuidv4()}`);
			const response = await attachmentRef.putString(attachment, 'data_url');
			attachmentUrl = await response.ref.getDownloadURL();
			await userObj.updateProfile({
				photoURL: attachmentUrl,
			});
			// profile 수정시 모든 트윗에 반영하기
			// const rweetObj = await dbService
			// 	.collection('rweets')
			// 	.where('creatorId', '==', userObj.uid)
			// 	.get();
			// const rweetArray = rweetObj.docs.map((doc) => ({
			// 	id: doc.id,
			// }));
		}

		// rweetArray.forEach((docObj) => {
		// 	console.log(docObj.id);
		// 	// 	dbService.doc(`rweet/${docObj.id}`).update({
		// 	// 		photoUrl: attachmentUrl,
		// 	// 	});
		// });

		setAttachment('');
		if (userObj.displayName !== newDisplayName) {
			await userObj.updateProfile({
				displayName: newDisplayName,
			});
		}
		refreshUser();
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
		<form onSubmit={onSubmit}>
			<input
				type="text"
				placeholder="Display name"
				onChange={onChange}
				value={newDisplayName}
			/>
			<input type="file" accept="image/*" onChange={onFileChange} />
			<input type="submit" value="Update Profile" />
			{attachment && (
				<div>
					<img src={attachment} alt="attachment" width="50px" height="50px" />
					<button onClick={onClearAttachment}>Clear</button>
				</div>
			)}
		</form>
	);
};

export default ProfileFactory;
