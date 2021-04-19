import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Rweet = ({ userObj, rweetObj, setOnModal, setRweetObj, setIsOwner }) => {
	const toggleOnModal = () => {
		setOnModal((prev) => !prev);
		setRweetObj(rweetObj);
		setIsOwner(rweetObj.creatorId === userObj.uid);
	};

	return (
		<div className="post">
			<>
				<div className="rweet_creator_container">
					<img
						alt="rweet_creator_img"
						className="rweet_creator_img"
						src={rweetObj.photoUrl}
						width="32px"
						height="32px"
					/>
					<h4 className="rweet_creator_name">{rweetObj.displayName}</h4>
					<button className="rweet_creator_menu" onClick={toggleOnModal}>
						<FontAwesomeIcon icon={faEllipsisH} size="1x" />
					</button>
				</div>
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
				</div>
			</>
		</div>
	);
};

export default Rweet;
