import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthForm from 'components/AuthForm';
import { authService, firebaseInstance } from 'fBase';
import React, { useState } from 'react';

const Auth = () => {
	const [newAccount, setNewAccount] = useState(false);
	const [error, setError] = useState('');
	const onSocialClick = async (event) => {
		const {
			target: { name },
		} = event;
		let provider;
		if (name === 'google') {
			provider = new firebaseInstance.auth.GoogleAuthProvider();
		} else if (name === 'github') {
			provider = new firebaseInstance.auth.GithubAuthProvider();
		}
		await provider.addScope('profile');
		await authService.signInWithPopup(provider);
	};

	const toggleAccount = () => setNewAccount((prev) => !prev);

	return (
		<>
			<div className="auth_container">
				<h2 className="auth_title">Racstagram</h2>
				<div className="auth_form">
					<AuthForm newAccount={newAccount} setError={setError} />
				</div>
				<div className="auth_ortext">
					<div className="ortext_slice"></div>
					<div className="ortext">Or</div>
					<div className="ortext_slice"></div>
				</div>
				<div className="auth_socialLogin">
					<button
						className="socialLogin_btn"
						onClick={onSocialClick}
						name="google"
					>
						<FontAwesomeIcon
							className="icon_google"
							icon={faGoogle}
							size="1x"
						/>
						Continue with Google
					</button>
					<button
						className="socialLogin_btn"
						onClick={onSocialClick}
						name="github"
					>
						<FontAwesomeIcon
							className="icon_github"
							icon={faGithub}
							size="1x"
						/>
						Continue with Github
					</button>
				</div>
				<h4 className="auth_error">{error}</h4>
			</div>
			<div className="auth_mode_container">
				<span onClick={toggleAccount} className="auth_mode">
					{newAccount ? 'Sign In' : 'Create Account'}
				</span>
			</div>
		</>
	);
};
export default Auth;
