import React, { useState } from 'react';
import './SignIn.css';

const SignIn = () => {
    // states to manage form imputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const HandleSubmit = (e) => {
        e.preventDefault(); //prevent page reload
        console.log('Email', email);
        console.log('Password', password);
        //future DB call needed for sign in authentication
    };

    return (
    <div className = "sign-in-container">
        <h1>Sign in</h1>
        <form onSubmit={HandleSubmit}>
            <div className='form-group'>
                <label htmlFor = "email" > Email: </label>
                <input 
                    type = "email"
                    id = "email"
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor = "password" > Password: </label>
                <input 
                    type = "password"
                    id = "password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type = "submit">Sign In</button>
        </form>
    </div>
    );
}; 

export default SignIn;