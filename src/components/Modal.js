import React, { useState } from 'react';
import { dbService, storageService } from 'fBase';
import { useRouteMatch } from 'react-router-dom';

const Modal = ({ rweetObj, setRweetObj, setOnModal, isOwner, setUpdated }) => {
	const [newRweet, setNewRweet] = useState(rweetObj.text);
	const [editing, setEditing] = useState(false);
	let isProfile = useRouteMatch('/profile');

	const onDeleteClick = async () => {
		const ok = window.confirm('Are you sure you want to delete this rweet?');
		if (ok) {
			await dbService.doc(`rweets/${rweetObj.id}`).delete();
			if (rweetObj.attachmentUrl !== '') {
				await storageService.refFromURL(rweetObj.attachmentUrl).delete();
			}
			goOut_modal();
			if (isProfile) {
				setUpdated(Date.now());
			}
		}
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		if (newRweet !== rweetObj.text) {
			await dbService.doc(`rweets/${rweetObj.id}`).update({
				text: newRweet,
			});
			goOut_modal();
			if (isProfile) {
				setUpdated(Date.now());
			}
		}
	};

	const onChange = (event) => {
		const {
			target: { value },
		} = event;
		setNewRweet(value);
	};

	const toggleEditing = () => {
		setEditing((prev) => !prev);
	};

	const goOut_modal = () => {
		setOnModal(false);
		setRweetObj(null);
		setEditing(false);
	};

	return (
		<div className="modal" onClick={goOut_modal}>
			<div className="modal_content" onClick={(ev) => ev.stopPropagation()}>
				{editing ? (
					<>
						{isOwner && (
							<>
								<form className="edit_form" onSubmit={onSubmit}>
									<input
										className="edit_text"
										type="text"
										placeholder="Edit your Rweet"
										value={newRweet}
										required
										onChange={onChange}
									/>
									<div className="edit_controller">
										<input
											className="edit_btn1"
											type="submit"
											value="Update Rweet"
										/>
										<button
											type="button"
											className="edit_btn2"
											onClick={toggleEditing}
										>
											Cancel
										</button>
									</div>
								</form>
							</>
						)}
					</>
				) : (
					<>
						{isOwner && (
							<>
								<div className="modal_btn_controller">
									<button
										type="button"
										className="modal_btn"
										onClick={onDeleteClick}
									>
										Delete
									</button>
									<button
										type="button"
										className="modal_btn"
										onClick={toggleEditing}
									>
										Edit
									</button>
								</div>
							</>
						)}
					</>
				)}
				<button className="modal_btn" onClick={goOut_modal}>
					GoOut
				</button>
			</div>
		</div>
	);
};

export default Modal;
