import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ userObj }) => (
	<>
		<div className="head_container">
			<nav className="nav_container">
				<div className="head_logo">Racstagram</div>
				<ul className="nav_items">
					<li className="nav_item">
						<Link to="/">
							<FontAwesomeIcon
								className={'icon_home'}
								icon={faHome}
								size={'2x'}
							/>
						</Link>
					</li>
					<li className="nav_item">
						<Link to="/profile">
							{/* {userObj.photoURL && ( */}
							<img
								className="nav_portrait"
								alt="user_photo"
								src={userObj.photoURL}
								width="25px"
								height="25px"
							/>
							{/* )} */}
						</Link>
					</li>
				</ul>
			</nav>
		</div>
		<div className="nav_block"></div>
	</>
);
export default Navigation;
