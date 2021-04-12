import { authService } from 'fBase';
import React, { useState } from 'react';

const AuthForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [newAccount, setNewAccount] = useState(true);
	const [error, setError] = useState('');

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
			setError(error.message);
		}
	};
	const toggleAccount = () => setNewAccount((prev) => !prev);
	return (
		<>
			<form onSubmit={onSubmit}>
				<input
					name="email"
					type="email"
					placeholder="Email"
					required
					value={email}
					onChange={onChange}
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={onChange}
				/>
				<input
					type="submit"
					value={newAccount ? 'Create Account' : 'Sign In'}
				/>
				{error}
			</form>
			<span onClick={toggleAccount}>
				{newAccount ? 'Sign In' : 'Create Account'}
			</span>
		</>
	);
};

export default AuthForm;
