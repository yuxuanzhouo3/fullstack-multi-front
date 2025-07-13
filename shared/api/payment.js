import { supabase } from '../utils/supabase';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const { action, amount, currency, paymentMethod, description } = req.body;

      switch (action) {
        case 'create-payment-intent':
          try {
            // This would integrate with Stripe or another payment processor
            // For now, we'll create a mock payment intent
            const paymentIntent = {
              id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              amount,
              currency: currency || 'usd',
              status: 'requires_payment_method',
              description,
              created: new Date().toISOString()
            };

            res.status(200).json({ 
              success: true, 
              paymentIntent 
            });
          } catch (error) {
            res.status(400).json({ 
              success: false, 
              error: error.message 
            });
          }
          break;

        case 'confirm-payment':
          try {
            // Mock payment confirmation
            const payment = {
              id: req.body.paymentIntentId,
              status: 'succeeded',
              amount: req.body.amount,
              currency: req.body.currency,
              created: new Date().toISOString()
            };

            // Store payment record in database
            const { error } = await supabase
              .from('payments')
              .insert([payment]);

            if (error) throw error;

            res.status(200).json({ 
              success: true, 
              payment,
              message: 'Payment confirmed successfully' 
            });
          } catch (error) {
            res.status(400).json({ 
              success: false, 
              error: error.message 
            });
          }
          break;

        default:
          res.status(400).json({ 
            success: false, 
            error: 'Invalid action' 
          });
      }
      break;

    case 'GET':
      const { paymentId } = req.query;

      if (paymentId) {
        // Get specific payment
        try {
          const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('id', paymentId)
            .single();

          if (error) throw error;

          res.status(200).json({ 
            success: true, 
            payment: data 
          });
        } catch (error) {
          res.status(400).json({ 
            success: false, 
            error: error.message 
          });
        }
      } else {
        // Get all payments for user
        try {
          const { data, error } = await supabase
            .from('payments')
            .select('*')
            .order('created', { ascending: false });

          if (error) throw error;

          res.status(200).json({ 
            success: true, 
            payments: data 
          });
        } catch (error) {
          res.status(400).json({ 
            success: false, 
            error: error.message 
          });
        }
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ 
        success: false, 
        error: `Method ${method} Not Allowed` 
      });
  }
} 