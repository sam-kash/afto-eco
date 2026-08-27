const stripeClient = require('../config/stripe');

class StripeService {
  /**
   * Create checkout session
   */
  static async createCheckoutSession(items, customerEmail) {
    try {
      const lineItems = items.map((item) => ({
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.name,
            images: item.images && item.images.length > 0 ? [item.images[0]] : undefined,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      }));

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/cancel`,
        customer_email: customerEmail,
      });

      return session;
    } catch (error) {
      console.error('Stripe error:', error);
      throw error;
    }
  }

  /**
   * Get session details
   */
  static async getSession(sessionId) {
    try {
      const session = await stripeClient.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      console.error('Stripe error:', error);
      throw error;
    }
  }
}

module.exports = StripeService;