"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import './AnimatedLoginForm.css';

const LoginForm = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if username and password are correct
        if (username === 'admin' && password === 'admin') {
            // Redirect to the desired route
            router.push("/adminpanel") // Replace '/dashboard' with the route you want
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="box">
            <span className="borderLine"></span>
            <form onSubmit={handleSubmit}>
                <h2>Sign in</h2>
                <div className="inputBox">
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <span>Username</span>
                    <i></i>
                </div>
                <div className="inputBox">
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span>Password</span>
                    <i></i>
                </div>
                <div className="links">
                    <a href="#">Forget Password</a>
                    <a href="#">Signup</a>
                </div>
                <input type="submit" value="Login" className='text-black'/>
            </form>
        </div>
    );
};

export default LoginForm;
