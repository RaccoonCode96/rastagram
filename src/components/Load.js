import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

const Load = () => {
	return (
		<>
			<div className="load_container">
				<h2 className="load_title">Racstagram</h2>
				<div className="icon_insta">
					<FontAwesomeIcon
						className={'fa-spin'}
						icon={faInstagram}
						size={'10x'}
					/>
				</div>
			</div>
		</>
	);
};

export default Load;
