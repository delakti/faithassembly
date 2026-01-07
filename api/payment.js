import crypto from 'crypto';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
      if (!process.env.SQUARE_ACCESS_TOKEN) {
          throw new Error('Server configuration error: Missing SQUARE_ACCESS_TOKEN');
      }

      // Use CommonJS require to load Square SDK reliably
      const square = require('square');
      const { SquareClient, SquareEnvironment } = square;

      if (!SquareClient) {
          throw new Error('Failed to import SquareClient from square SDK via require');
      }

      // Initialize Square Client
      // Note: "Environment" is now "SquareEnvironment"
      const client = new SquareClient({
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
        environment: process.env.NODE_ENV === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
      });

      const { sourceId, amount } = req.body;

      if (!sourceId || !amount) {
          return res.status(400).json({ message: 'Missing sourceId or amount' });
      }

      const paymentsApi = client.paymentsApi;
      const idempotencyKey = crypto.randomUUID();

      const { result } = await paymentsApi.createPayment({
        idempotencyKey,
        sourceId,
        amountMoney: {
          amount: BigInt(amount),
          currency: 'GBP',
        },
      });

      // Serialize BigInt to string to avoid JSON errors
      const jsonResult = JSON.parse(JSON.stringify(result, (key, value) =>
          typeof value === 'bigint'
              ? value.toString()
              : value
      ));

      return res.status(200).json(jsonResult);

  } catch (error) {
    console.error('Payment API Error:', error);
    
    // Extract meaningful error message from Square API response if available
    let errorMessage = error.message;
    if (error.errors && error.errors.length > 0) {
        errorMessage = error.errors.map(e => e.detail).join(', ');
    }

    return res.status(500).json({ 
        message: 'Payment processing failed', 
        error: errorMessage,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
}
