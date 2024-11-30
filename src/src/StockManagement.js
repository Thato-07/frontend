import React, { useState } from 'react';

const StockManagement = ({ products, setProducts }) => {
  const [transaction, setTransaction] = useState({
    productId: '',
    quantity: '',
    type: 'add', // 'add' or 'deduct'
  });

  const [sellTransaction, setSellTransaction] = useState({
    productname: '',
    quantity: '',
  });

  const [transactionHistory, setTransactionHistory] = useState([]);

  // State to toggle sell form visibility
  const [isSellFormVisible, setIsSellFormVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const handleSellChange = (e) => {
    const { name, value } = e.target;
    setSellTransaction({ ...sellTransaction, [name]: value });
  };

  const handleStockChangeSubmit = (e) => {
    e.preventDefault();
    const { productId, quantity, type } = transaction;
    const quantityNum = parseInt(quantity, 10);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const product = products.find((p) => p.id === parseInt(productId, 10));
    if (!product) {
      alert('Selected product does not exist.');
      return;
    }

    setProducts((prevProducts) => {
      return prevProducts.map((prod) => {
        if (prod.id === parseInt(productId, 10)) {
          const updatedQuantity =
            type === 'add'
              ? prod.quantity + quantityNum
              : Math.max(0, prod.quantity - quantityNum);

          return { ...prod, quantity: updatedQuantity };
        }
        return prod;
      });
    });

    const transactionRecord = {
      date: new Date().toLocaleString(),
      type,
      quantity: quantityNum,
      productname: product.productname,
    };
    setTransactionHistory((prevHistory) => [...prevHistory, transactionRecord]);

    alert(
      `Transaction successful: ${type === 'add' ? 'Added' : 'Deducted'} ${quantityNum} from ${product.productname}.`
    );
    setTransaction({ productId: '', quantity: '', type: 'add' });
  };

  const handleSellSubmit = (e) => {
    e.preventDefault();
    const { productname, quantity } = sellTransaction;
    const quantityNum = parseInt(quantity, 10);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const product = products.find((p) => p.productname === productname);
    if (!product) {
      alert('Selected product does not exist.');
      return;
    }

    setProducts((prevProducts) => {
      return prevProducts.map((prod) => {
        if (prod.productname === productname) {
          const updatedQuantity = Math.max(0, prod.quantity - quantityNum);
          return { ...prod, quantity: updatedQuantity };
        }
        return prod;
      });
    });

    const transactionRecord = {
      date: new Date().toLocaleString(),
      type: 'sell',
      quantity: quantityNum,
      productname: product.productname,
    };
    setTransactionHistory((prevHistory) => [...prevHistory, transactionRecord]);

    alert(`Transaction successful: Sold ${quantityNum} of ${product.productname}.`);
    setSellTransaction({ productname: '', quantity: '' });
  };

  // Toggle sell form visibility
  const toggleSellForm = () => {
    setIsSellFormVisible((prev) => !prev);
  };

  return (
    <div className="stock">
      <h2>Stock Management</h2>
      {products.length > 0 ? (
        <>
          <h3>Current Stock Levels</h3>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Current Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.productname}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No products available.</p>
      )}

      <h3>Record Stock Transactions</h3>
      <form onSubmit={handleStockChangeSubmit}>
        <select
          name="productId"
          value={transaction.productId}
          onChange={handleChange}
          required
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.productname}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={transaction.quantity}
          onChange={handleChange}
          required
        />
        <select name="type" value={transaction.type} onChange={handleChange}>
          <option value="add">Add Stock</option>
          <option value="deduct">Deduct Stock</option>
        </select>
        <button type="submit">Submit Transaction</button>
      </form>

      <h3>
        <button onClick={toggleSellForm}>
          {isSellFormVisible ? 'Hide Sell Form' : 'Sell Products'}
        </button>
      </h3>
      {isSellFormVisible && (
        <form onSubmit={handleSellSubmit}>
          <select
            name="productname"
            value={sellTransaction.productname}
            onChange={handleSellChange}
            required
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.productname}>
                {product.productname}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={sellTransaction.quantity}
            onChange={handleSellChange}
            required
          />
          <button type="submit">Sell Product</button>
        </form>
      )}

      <h3>Transaction History</h3>
      {transactionHistory.length > 0 ? (
        <ul>
          {transactionHistory.map((transaction, index) => (
            <li key={index}>
              {transaction.date}: {transaction.type} {transaction.quantity} of{' '}
              {transaction.productname}
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions recorded.</p>
      )}
    </div>
  );
};

export default StockManagement;
