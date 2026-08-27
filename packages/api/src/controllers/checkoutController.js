const StripeService = require('../services/stripe');
const DatabaseService = require('../services/db');

class CheckoutController {
  static async createSession(req, res, next) {
    try {
      const { items, email } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Cart is empty' });
      }

      const session = await StripeService.createCheckoutSession(items, email);
      res.json({ success: true, data: { sessionId: session.id, url: session.url } });
    } catch (error) {
      next(error);
    }
  }

  static async getSuccess(req, res, next) {
    try {
      const { sessionId } = req.query;

      if (!sessionId) {
        return res.status(400).json({ success: false, error: 'Session ID required' });
      }

      const session = await StripeService.getSession(sessionId);

      // Create order in database
      const order = await DatabaseService.createOrder({
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
        totalAmount: session.amount_total / 100, // Convert from cents
        currency: session.currency?.toUpperCase(),
        status: 'completed',
        email: session.customer_email,
      });

      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CheckoutController;