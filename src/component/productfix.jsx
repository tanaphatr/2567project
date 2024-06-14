import React, { useState, useEffect } from 'react';
import Nav from './nav';
import './Item.css';
import PageAB from './PageAB';

function Productfix() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [users, setUsers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [Delete, setDelete] = useState(false);
    const [productData, setProductData] = useState(null);
    const [tempProductData, setTempProductData] = useState(null);
    const url = window.location.href;
    const Pro_ID = url.substring(url.lastIndexOf('/') + 1);

    useEffect(() => {
        // Fetch products
        fetch('http://localhost:3001/product')
            .then(response => response.json())
            .then(data => {
                if (data) {
                    const product = data.find(item => item.Productid === parseInt(Pro_ID));
                    if (product) {
                        setSelectedProduct(product);
                        setProductData(product);
                        setTempProductData(product);
                    } else {
                        console.log('Product not found');
                    }
                } else {
                    console.log('No data received');
                }
            })
            .catch(error => console.error('Error fetching product:', error));

        // Fetch users
        fetch('http://localhost:3001/user')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, [Pro_ID]);

    const handleEdit = () => {
        setEditing(!editing);
    };

    const handleCancel = () => {
        setEditing(false);
        setTempProductData({ ...productData });
    };

    const handleSave = () => {
        console.log(tempProductData)
        if (tempProductData.Price < 0 || tempProductData.QuantityAvailable < 0) {
            alert('Price and Quantity Available cannot be negative.');
            return;
        }
        console.log(tempProductData)
        fetch('http://localhost:3001/editproduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tempProductData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('User data updated successfully:', data);
                setUserData({ ...tempProductData });
                setEditing(false);
            })
            .catch(error => console.error('Error updating user data:', error));
        setEditing(false);
    };

    const handleDelete = () => {
        setDelete(!Delete);
    };

    const handleCancelDelete = () => {
        setDelete(false);
    };

    const handleConfirm = () => {
        fetch('http://localhost:3001/deleteproduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tempProductData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('User data updated successfully:', data);
                window.location.href = '/';
            })
            .catch(error => console.error('Error updating user data:', error));
        setDelete(false);
    };

    return (
        <div>
            <Nav />
            {tempProductData && (
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                            className='flex-grow-1 flex-basis-200 block-text-center'
                            src={`http://localhost:3001/public/image/${selectedProduct.ImageURL}`}
                            alt="Product"
                            style={{ maxWidth: '400px', maxHeight: '400px' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div>
                            <h1>ชื่อ: {tempProductData.Productname}</h1>
                            <p>จำนวน: {tempProductData.QuantityAvailable}</p>
                            {tempProductData.Price && (
                                <p>ราคา: ฿{tempProductData.Price}</p>
                            )}
                            <p>คำอธิบาย: {tempProductData.Description}</p>
                        </div>
                        <br />
                        <div>
                            {!editing ? (
                                <button2 onClick={handleEdit}>Edit</button2>
                            ) : (
                                <div>
                                    <div className="edit-buttons">
                                        <p>Productname</p>
                                        <input type="text2" value={tempProductData.Productname} onChange={e => setTempProductData({ ...tempProductData, Productname: e.target.value })} />
                                        <p>QuantityAvailable</p>
                                        <input type="text2" value={tempProductData.QuantityAvailable} onChange={e => setTempProductData({ ...tempProductData, QuantityAvailable: e.target.value })} />
                                        <p>Price</p>
                                        <input type="text2" value={tempProductData.Price} onChange={e => setTempProductData({ ...tempProductData, Price: e.target.value })} />
                                        <p>Description</p>
                                        <input type="text2" value={tempProductData.Description} onChange={e => setTempProductData({ ...tempProductData, Description: e.target.value })} />
                                        <button2 onClick={handleSave}>Save</button2>
                                        <button2 className="cancel" onClick={handleCancel}>Cancel</button2>
                                    </div>
                                </div>
                            )}
                            {!Delete ? (
                                <button2 className="cancel" onClick={handleDelete}>Delete</button2>
                            ) : (
                                <div>
                                    <div className="edit-buttons">
                                        <button2 className="edit-buttons" onClick={handleConfirm}>Confirm</button2>
                                        <button2 className="cancel" onClick={handleCancelDelete}>Cancel</button2>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <PageAB />
        </div>
    );
}

export default Productfix;
