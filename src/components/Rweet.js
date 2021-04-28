import {
	faEllipsisH,
	faImage,
	faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
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
					{rweetObj.photoUrl ? (
						<img
							alt="rweet_creator_img"
							className="rweet_creator_img"
							src={rweetObj.photoUrl}
							width="32px"
							height="32px"
						/>
					) : (
						<FontAwesomeIcon
							className="rweet_creator_img"
							icon={faUserCircle}
							size="2x"
						/>
					)}

					<h4 className="rweet_creator_name">{rweetObj.displayName}</h4>
					<button className="rweet_creator_menu" onClick={toggleOnModal}>
						<FontAwesomeIcon icon={faEllipsisH} size="1x" />
					</button>
				</div>
				<div className="rweet_img_container">
					<FontAwesomeIcon
						className="rweet_file_btn"
						icon={faImage}
						size="4x"
					/>
					{rweetObj.attachmentUrl && (
						<img
							className="rweet_img"
							src={rweetObj.attachmentUrl}
							alt="rweet img"
						/>
					)}
				</div>
				<div className="rweet_text_container">
					<div className="rweet_text">
						<span className="rweet_text_userName">{rweetObj.displayName}</span>
						{rweetObj.text}
					</div>
				</div>
			</>
		</div>
	);
};

export default Rweet;
