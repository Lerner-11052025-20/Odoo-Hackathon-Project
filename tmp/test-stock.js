const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Receipt = require('../backend/models/Receipt');
const Product = require('../backend/models/Product');

dotenv.config({ path: './backend/.env' });

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const product = await Product.findOne({ name: /Aluminium/i });
        if (!product) {
            console.log('Product not found');
            process.exit(0);
        }
        console.log('Initial Stock:', product.stock);

        const receipt = await Receipt.create({
            reference: 'TEST-REC-001',
            supplier: 'Test Supplier',
            warehouse: 'Main Warehouse',
            status: 'Draft',
            products: [{ product: product._id, quantity: 100 }]
        });
        console.log('Created Receipt:', receipt.reference);

        // Simulation updateStock
        const multiplier = 1;
        for (const item of receipt.products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity * multiplier }
            });
        }
        
        const updatedProduct = await Product.findById(product._id);
        console.log('Updated Stock:', updatedProduct.stock);

        // Cleanup
        await Receipt.deleteOne({ _id: receipt._id });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

test();
