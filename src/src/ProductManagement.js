import React, { useEffect, useState } from 'react';

const ProductManagement = ({ setProducts }) => {
    const [product, setProduct] = useState({
        id: '',  // Added ID initialization
        productName: '',
        description: '',
        category: '',
        price: '',
        quantity: ''
    });
    const [products, setProductsLocal] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch products from the server
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProductsLocal(data);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error); // Log fetch errors
            }
        };
        fetchProducts();
    }, [setProducts]);

    // Handle input changes
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            ...product,
            price: parseFloat(product.price), // Convert price to a number
            quantity: parseInt(product.quantity, 10) // Convert quantity to an integer
        };

        // Validate product data before submission
        if (!productData.productName || !productData.description || !productData.category || isNaN(productData.price) || isNaN(productData.quantity)) {
            console.error('Invalid product data:', productData); // Log validation errors
            return; // Stop execution if data is invalid
        }

        try {
            const headers = { 'Content-Type': 'application/json' };
            let response;

            if (isEditing) {
                // PUT request to update a product
                response = await fetch(`http://localhost:5000/products/${product.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(productData)
                });
            } else {
                // POST request to add a new product
                response = await fetch('http://localhost:5000/products', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(productData)
                });
            }

            const responseData = await response.json(); // Parse response data
            if (!response.ok) {
                throw new Error(`Failed to submit product: ${responseData.error || response.statusText}`);
            }

            // If adding a new product
            if (!isEditing) {
                // Update the local state to reflect the new product
                setProductsLocal((prev) => [...prev, responseData]);  // Add the new product to the local state
                setProducts((prev) => [...prev, responseData]); // Update the parent state
            } else {
                // If editing, update the existing product in the list
                setProductsLocal((prev) =>
                    prev.map((prod) => (prod.id === responseData.id ? responseData : prod))
                );
                setProducts((prev) =>
                    prev.map((prod) => (prod.id === responseData.id ? responseData : prod))
                );
            }

            // Reset the product form
            setProduct({ id: '', productName: '', description: '', category: '', price: '', quantity: '' });
            setIsEditing(false); // Reset editing mode
        } catch (error) {
            console.error('Error submitting product:', error.message); // Log submission errors
        }
    };

    // Handle product deletion
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/products/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            const newProducts = products.filter((prod) => prod.id !== id);
            setProductsLocal(newProducts);
            setProducts(newProducts);
        } catch (error) {
            console.error('Error deleting product:', error); // Log deletion errors
        }
    };

    // Handle editing a product
    const handleEdit = (prod) => {
        setProduct(prod); // Set product data for editing
        setIsEditing(true); // Set editing mode
    };

    return (
        <div>
            <h2>Product Management</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="productName"
                    value={product.productName}
                    placeholder="Product Name"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    value={product.description}
                    placeholder="Description"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    value={product.category}
                    placeholder="Category"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={product.price}
                    placeholder="Price (M)"
                    onChange={handleChange}
                    required
                    min="0"
                />
                <input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    placeholder="Quantity"
                    onChange={handleChange}
                    required
                    min="0"
                />
                <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
                {isEditing && <button onClick={() => setIsEditing(false)}>Cancel</button>}
            </form>

            <h3>Product Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((prod) => (
                        <tr key={prod.id}>
                            <td>{prod.productName}</td> {/* Ensure productName is shown */}
                            <td>{prod.description}</td>
                            <td>{prod.category}</td>
                            <td>M{prod.price}</td>
                            <td>{prod.quantity}</td>
                            <td>
                                <button onClick={() => handleEdit(prod)}>Edit</button>
                                <button onClick={() => handleDelete(prod.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductManagement;
