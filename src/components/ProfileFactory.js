import { authService, storageService } from 'fBase';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';

const ProfileFactory = ({ userObj, refreshUser, setOnProfile }) => {
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
	const [attachment, setAttachment] = useState('');
	const [onEditing, setEditing] = useState(false);
	const history = useHistory();

	const onLogOutClick = () => {
		authService.signOut();
		history.push('/');
	};

	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setNewDisplayName(value);
	};

	const toggleEditing = () => {
		setEditing((prev) => !prev);
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
		setOnProfile(false);
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
		<div className="profile_menu">
			{onEditing ? (
				<>
					<form onSubmit={onSubmit} className="editing_form">
						<div className="preview_container">
							<>
								<label className="rweet_file_btn" htmlFor="input-file">
									<FontAwesomeIcon icon={faImage} size="4x" />
								</label>
								<input
									type="file"
									id="input-file"
									accept="image/*"
									onChange={onFileChange}
								/>
							</>
							{attachment && (
								<div>
									<img
										className="real_preview"
										src={attachment}
										alt="attachment"
										width="255.55px"
										height="220px"
									/>
									<button
										className="preview_cancel"
										onClick={onClearAttachment}
									>
										<FontAwesomeIcon icon={faTimesCircle} size="1x" />
									</button>
								</div>
							)}
						</div>
						<div className="name_form_container">
							<div className="name_label">Name : </div>
							<input
								className="name_form"
								type="text"
								placeholder="Display name"
								onChange={onChange}
								value={newDisplayName}
							/>
						</div>
						<input
							className="profile_btn"
							type="submit"
							value="Update Profile"
						/>
						<button className="profile_btn" onClick={toggleEditing}>
							cancel
						</button>
					</form>
				</>
			) : (
				<>
					<button className="profile_btn" onClick={toggleEditing}>
						Edit
					</button>
					<button className="profile_btn" onClick={onLogOutClick}>
						Log Out
					</button>
				</>
			)}
		</div>
	);
};

export default ProfileFactory;
