import React, { useState, useEffect } from 'react';
import './Userprofile.css';
import Nav from './nav';

function Userprofile() {
    const [userData, setUserData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [tempUserData, setTempUserData] = useState(null);

    useEffect(() => {
        const stoid = localStorage.getItem('userid');
        if (stoid) {
            fetch('http://localhost:3001/user')
                .then(response => response.json())
                .then(data => {
                    const user = data.find(user => user.Userid == stoid);
                    if (user) {
                        setUserData(user);
                        setTempUserData({ ...user }); 
                    } else {
                        console.error('User not found');
                    }
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, []);

    // Function to handle editing mode
    const handleEdit = () => {
        setEditing(!editing);
    };

    // Function to handle cancel editing
    const handleCancel = () => {
        setEditing(false);
        setTempUserData({ ...userData });
    };

    const handleSave = () => {
        if (!/^\d{10}$/.test(tempUserData.Phone)) {
            alert('Phone number must be exactly 10 digits long and contain numbers only');
            return;
        }

        fetch('http://localhost:3001/edituser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tempUserData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('User data updated successfully:', data);
                setUserData({ ...tempUserData });
                setEditing(false); 
            })
            .catch(error => console.error('Error updating user data:', error));
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempUserData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    return (
        <div>
            <Nav />
            <div className="user-profile">
                <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>User Profile</h2>
                {tempUserData ? (
                    <div>
                        <p>Username: {tempUserData.Username}</p>
                        <p>Mail: {tempUserData.Mail}</p>
                        <p>Name: {tempUserData.Name}</p>
                        <p>Address: {tempUserData.Address}</p>
                        <p>Phone: {tempUserData.Phone}</p>
                        <br />
                        <hr />
                        <br />
                        {!editing ? (
                            <button2 onClick={handleEdit}>Edit</button2>
                        ) : (
                            <div>
                                <p>Mail</p>
                                <input type="text2" name="Mail" value={tempUserData.Mail} onChange={handleInputChange} />
                                <p>Name</p>
                                <input type="text2" name="Name" value={tempUserData.Name} onChange={handleInputChange} />
                                <p>Address</p>
                                <input type="text2" name="Address" value={tempUserData.Address} onChange={handleInputChange} />
                                <p>Phone</p>
                                <input type="text2" name="Phone" value={tempUserData.Phone} onChange={handleInputChange} />
                                <div className="edit-buttons">
                                    <button2 onClick={handleSave}>Save</button2>
                                    <button2 className="cancel" onClick={handleCancel}>Cancel</button2>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="loading">Loading...</p>
                )}
            </div>
        </div>
    );
}

export default Userprofile;
