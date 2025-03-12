import React from 'react';
import './topbar.css';

const TopBar = () => {
    return (
        <div className='top-bar'>
            <div className='logo'>
                <a href = "/"> Zoo Project</a>
            </div>
            <nav className='nav-links'>
                
                <a href = "/about"> About</a>
                <a href = "/contact"> Contact</a>
                <a href = "/signin"> Sign In</a>
            </nav>
        </div>
    );

};

export default TopBar;