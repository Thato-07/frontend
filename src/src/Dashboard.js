import React from 'react';
import { Bar } from 'react-chartjs-2';
import Slider from 'react-slick';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Import images
import candies from './images/candies.jpeg';
import coffee from './images/coffee.jpeg';
import snacks from './images/snacks.jpeg';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ products }) => {
    const data = {
        labels: products.map(product => product.productname),
        datasets: [
            {
                label: 'Stock Levels',
                data: products.map(product => product.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
        ]
    };

    // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    // Map product IDs to images
    const productImages = {
        1: candies,
        2: coffee,
        3: snacks, // Use 'snack' instead of 'snacks'
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <Bar data={data} />
            <h3>Current Stock Levels</h3>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.productname} - Quantity: {product.quantity}
                    </li>
                ))}
            </ul>
            <h3>Product Images</h3>
            <Slider {...settings}>
                {products.map(product => (
                    <div key={product.id}>
                        <img
                            src={productImages[product.id]} // Use the mapped image
                            alt={product.productname}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Dashboard;