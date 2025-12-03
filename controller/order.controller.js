const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const Inventory = require('../models/inventory.model');

/**
 ** Create order (with stock check)
 */
exports.createOrder = async (req, res) => {
    try {
        const { customerId, products, shippingAddress, paymentMethod } = req.body;

        // Check customer exists
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        let totalAmount = 0;

        // Verify stock for each item
        for (const item of products) {
            const inventory = await Inventory.findOne({ productId: item.productId });
            if (!inventory) {
                return res.status(404).json({ message: `Inventory not found for product ${item.productId}` });
            }

            if (inventory.totalQuantity < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for product ${item.productId}`,
                    available: inventory.totalQuantity
                });
            }

            // Subtotal calculation
            totalAmount += item.price * item.quantity;
        }

        // Reduce stock after confirming all good
        for (const item of products) {
            const inventory = await Inventory.findOne({ productId: item.productId });

            inventory.totalQuantity -= item.quantity;
            if (inventory.totalQuantity < 0) inventory.totalQuantity = 0;
            await inventory.save();
        }

        // Create order
        const order = await Order.create({
            customerId,
            products,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentStatus: "Pending",
            status: "Pending"
        });

        // Attach order to customer
        customer.orders.push(order._id);
        await customer.save();

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/** 
 * *Get All orders
*/
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("customerId").populate("products.productId");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 ** order by id
 */
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("customerId").populate("products.productId");

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 ** Update status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = status;
        await order.save();

        res.json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
