import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dbService, storageService } from 'fBase';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const RweetFactory = ({ userObj }) => {
	const [rweet, setRweet] = useState('');
	const [attachment, setAttachment] = useState('');
	const [doubleSubmit, setDoubleSubmit] = useState(false);

	const onSubmit = async (event) => {
		event.preventDefault();
		if (!doubleSubmit) {
			setDoubleSubmit(true);
			let attachmentUrl = '';
			if (attachment !== '') {
				const attachmentRef = storageService
					.ref()
					.child(`${userObj.uid}/${uuidv4()}`);
				const response = await attachmentRef.putString(attachment, 'data_url');
				attachmentUrl = await response.ref.getDownloadURL();
			}
			setAttachment('');
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
			setDoubleSubmit(false);
		}
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
		setAttachment('');
	};
	return (
		<form className="form_rweets" onSubmit={onSubmit}>
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
							width="235.6px"
							height="220px"
						/>
						<button className="preview_cancel" onClick={onClearAttachment}>
							<FontAwesomeIcon icon={faTimesCircle} size="1x" />
						</button>
					</div>
				)}
			</div>
			<textarea
				className="form_rweets_text"
				value={rweet}
				onChange={onChange}
				placeholder="What's on your mind?"
				maxLength={120}
				rows="2"
				cols="20"
				wrap="hard"
				required
			></textarea>
			<div className="form_rweet_controller">
				<label className="rweet_submit_btn" htmlFor="input-submit">
					<FontAwesomeIcon icon={faPaperPlane} size="2x" />
				</label>
				<input type="submit" id="input-submit" value="Rweet" />
			</div>
		</form>
	);
};

export default RweetFactory;
