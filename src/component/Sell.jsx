import React, { useState, useEffect } from 'react';
import './Sell.css';
import Nav from './nav';
import PageAB from './PageAB';

function Sell() {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantityAvailable, setQuantityAvailable] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const stoid = localStorage.getItem('userid');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        fetch('http://localhost:3001/Category')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate to ensure price and quantity are not negative
        if (price < 0 || quantityAvailable < 0) {
            alert('Price and Quantity Available cannot be negative.');
            return;
        }

        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantityAvailable', quantityAvailable);
        formData.append('image', image);
        formData.append('category', category);
        formData.append('Sellerid', stoid);

        fetch('http://localhost:3001/INproduct', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setProductName('');
                setDescription('');
                setPrice('');
                setQuantityAvailable('');
                setImage('');
                setCategory('');
                fetchCategories();
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <Nav />
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {image && <img className='flex-grow-1 flex-basis-200 block-text-center' src={URL.createObjectURL(image)} alt="Product" style={{ maxWidth: '400px', maxHeight: '400px' }} />}
                </div>
                <div style={{ flex: 1 }}>
                    <div className="form-container2">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Product Name:</label>
                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Description:</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Price:</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label>Quantity Available:</label>
                                <input
                                    type="number"
                                    value={quantityAvailable}
                                    onChange={(e) => setQuantityAvailable(e.target.value)}
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="imageInput">Choose Image:</label>
                                <input
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Category:</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.CategoryID} value={cat.CategoryID}>
                                            {cat.CategoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
            <PageAB />
        </div>
    );
}

export default Sell;
