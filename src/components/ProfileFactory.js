import { authService, dbService, storageService } from 'fBase';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { useRouteMatch } from 'react-router-dom';

const ProfileFactory = ({
	rweets,
	userObj,
	refreshUser,
	setOnProfile,
	setUpdated,
	setOnLoad,
	userInfo,
}) => {
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
	const [newInfo, setNewInfo] = useState(userInfo);
	const [attachment, setAttachment] = useState('');
	const [onEditing, setEditing] = useState(false);
	const [doubleSubmit, setDoubleSubmit] = useState(false);
	const history = useHistory();
	let isProfile = useRouteMatch('/profile');

	const onLogOutClick = () => {
		authService.signOut();
		history.push('/');
	};

	const onChangeName = (event) => {
		const {
			target: { value },
		} = event;
		setNewDisplayName(value);
	};

	const onChangeInfo = (event) => {
		const {
			target: { value },
		} = event;
		setNewInfo(value);
	};

	const toggleEditing = () => {
		setEditing((prev) => !prev);
	};

	const updateInfo = async () => {
		if (newInfo !== userInfo) {
			dbService.collection('user').doc(userObj.uid).set({
				info: newInfo,
			});
		}
	};

	const updatePhoto = async () => {
		if (attachment !== '') {
			let attachmentUrl = '';
			const attachmentRef = storageService
				.ref()
				.child(`${userObj.uid}/${uuidv4()}`);
			const response = await attachmentRef.putString(attachment, 'data_url');
			attachmentUrl = await response.ref.getDownloadURL();
			await userObj.updateProfile({
				photoURL: attachmentUrl,
			});
			const update = rweets.map(async (rweet) => {
				dbService.doc(`rweets/${rweet.id}`).update({
					photoUrl: attachmentUrl,
				});
			});
			await Promise.all(update);
		}
	};

	const updateDisplayName = async () => {
		if (userObj.displayName !== newDisplayName) {
			await userObj.updateProfile({
				displayName: newDisplayName,
			});
			const update = rweets.map(async (rweet) => {
				dbService.doc(`rweets/${rweet.id}`).update({
					displayName: newDisplayName,
				});
			});
			await Promise.all(update);
		}
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setOnLoad(true);
		if (!doubleSubmit) {
			setDoubleSubmit(true);
			updatePhoto();
			updateDisplayName();
			updateInfo();
			await Promise.all([updatePhoto(), updateDisplayName(), updateInfo()]);
			setAttachment('');
			refreshUser();
			setOnProfile(false);
			if (isProfile) {
				setUpdated(Date.now());
			}
			setDoubleSubmit(false);
			setOnLoad(false);
		}
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
								onChange={onChangeName}
								value={newDisplayName}
							/>
						</div>
						<textarea
							className="profile_form_info"
							placeholder="Introduce yourself!"
							onChange={onChangeInfo}
							value={newInfo}
							maxLength={120}
							rows="2"
							cols="20"
							wrap="hard"
							required
						></textarea>
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
