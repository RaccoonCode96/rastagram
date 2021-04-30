import { authService } from 'fBase';
import React, { useState } from 'react';

const AuthForm = ({ newAccount, setError }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onChange = (event) => {
		const {
			target: { name, value },
		} = event;
		if (name === 'email') {
			setEmail(value);
		} else if (name === 'password') {
			setPassword(value);
		}
	};
	const onSubmit = async (event) => {
		event.preventDefault();
		try {
			if (newAccount) {
				await authService.createUserWithEmailAndPassword(email, password);
			} else {
				await authService.signInWithEmailAndPassword(email, password);
			}
		} catch (error) {
			const handle = error.code.match(/(?<=\/)([a-zA-Z-]*)/g)[0];
			const message = handle.replace(/-/g, ' ');
			setError(message);
		}
	};

	return (
		<>
			<form onSubmit={onSubmit}>
				<input
					className="auth_input"
					name="email"
					type="email"
					placeholder="Email"
					required
					value={email}
					onChange={onChange}
				/>
				<input
					className="auth_input"
					name="password"
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={onChange}
				/>
				<input
					className="auth_btn"
					type="submit"
					value={newAccount ? 'Create Account' : 'Sign In'}
				/>
			</form>
		</>
	);
};

export default AuthForm;
