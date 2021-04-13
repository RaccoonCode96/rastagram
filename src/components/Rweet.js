import { dbService, storageService } from 'fBase';
import React, { useState } from 'react';

const Rweet = ({ rweetObj, isOwner }) => {
	const [editing, setEditing] = useState(false);
	const [newRweet, setNewRweet] = useState(rweetObj.text);

	const onDeleteClick = async () => {
		const ok = window.confirm('Are you sure you want to delete this rweet?');
		if (ok) {
			await dbService.doc(`rweets/${rweetObj.id}`).delete();
			if (rweetObj.attachmentUrl !== '') {
				await storageService.refFromURL(rweetObj.attachmentUrl).delete();
			}
		}
	};
	const toggleEditing = () => {
		setEditing((prev) => !prev);
	};
	const onSubmit = async (event) => {
		event.preventDefault();
		if (newRweet !== rweetObj.text) {
			await dbService.doc(`rweets/${rweetObj.id}`).update({
				text: newRweet,
			});
		}
		setEditing(false);
	};
	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setNewRweet(value);
	};
	return (
		<div className="post">
			{editing ? (
				<>
					{isOwner && (
						<>
							<form onSubmit={onSubmit}>
								<input
									type="text"
									placeholder="Edit your Rweet"
									value={newRweet}
									required
									onChange={onChange}
								/>
								<input type="submit" value="Update Rweet" />
							</form>
							<button onClick={toggleEditing}>Cancel</button>
						</>
					)}
				</>
			) : (
				<>
					<h4 className="rweet_creator">Creator</h4>
					<div className="rweet_img_container">
						{rweetObj.attachmentUrl && (
							<img
								className="rweet_img"
								src={rweetObj.attachmentUrl}
								alt="rweet img"
								width="50px"
								height="50px"
							/>
						)}
					</div>
					<div className="rweet_text_container">
						<h4 className="rweet_text">{rweetObj.text}</h4>
						{isOwner && (
							<>
								<div className="rweet_btn_controller">
									<button className="rweet_btn" onClick={onDeleteClick}>
										Delete
									</button>
									<button className="rweet_btn" onClick={toggleEditing}>
										Edit
									</button>
								</div>
							</>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default Rweet;
