import Rweet from 'components/Rweet';
import { dbService } from 'fBase';
import React, { useEffect, useState } from 'react';
import ProfileFactory from 'components/ProfileFactory';
import Modal from 'components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Profile = ({ userObj, refreshUser }) => {
	const [rweets, setRweets] = useState([]);
	const [rweetObj, setRweetObj] = useState();
	const [onModal, setOnModal] = useState(false);
	const [isOwner, setIsOwner] = useState();
	const [updated, setUpdated] = useState();
	const [onProfile, setOnProfile] = useState(false);

	const getMyRweets = async () => {
		// 로그인시 받아오는 profile이 없는 경우 임시 userName
		if (!userObj.displayName) {
			await userObj.updateProfile({
				displayName: `User`,
			});
		}
		const rweetObj = await dbService
			.collection('rweets')
			.where('creatorId', '==', userObj.uid)
			.orderBy('createdAt', 'desc')
			.get();
		const rweetArray = rweetObj.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		setRweets(rweetArray);
	};

	const toggleProfileUpdate = () => {
		setOnProfile((prev) => !prev);
	};

	useEffect(() => {
		getMyRweets();
		return () => {
			setRweets([]);
			setRweetObj();
			setOnModal(false);
			setIsOwner();
			getMyRweets();
		};
	}, [updated]);
	return (
		<>
			<div className="home_container">
				<div className="main_container">
					{rweets.map((rweet) => (
						<Rweet
							key={rweet.id}
							rweetObj={rweet}
							setOnModal={setOnModal}
							setRweetObj={setRweetObj}
							setIsOwner={setIsOwner}
							userObj={userObj}
						/>
					))}
				</div>
				<div className="side_container">
					<div className="profile_section">
						<div className="profile_show">
							<div className="profile_portrait">
								<>
									{userObj.photoURL && (
										<img
											className="real_portrait"
											alt="user_photo"
											src={userObj.photoURL}
											width="50px"
											height="50px"
										/>
									)}
									<FontAwesomeIcon
										className="default_portrait"
										icon={faUserCircle}
										size="4x"
									/>
								</>
							</div>
							<div className="profile_name_container">
								{userObj.displayName && (
									<>
										<h2 className="profile_name">{userObj.displayName}</h2>
										<FontAwesomeIcon
											onClick={toggleProfileUpdate}
											className="profile_update_btn"
											icon={faCaretDown}
											size="2x"
										/>
									</>
								)}
							</div>
							<div className="profile_info"></div>
						</div>
						{onProfile && (
							<ProfileFactory
								setUpdated={setUpdated}
								rweets={rweets}
								setOnProfile={setOnProfile}
								refreshUser={refreshUser}
								userObj={userObj}
							/>
						)}
					</div>
				</div>
			</div>
			{onModal ? (
				<Modal
					setUpdated={setUpdated}
					rweetObj={rweetObj}
					setRweetObj={setRweetObj}
					setOnModal={setOnModal}
					isOwner={isOwner}
				/>
			) : (
				<></>
			)}
		</>
	);
};
export default Profile;
