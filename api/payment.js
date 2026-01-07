import { Client, Environment } from 'square';
import crypto from 'crypto';

// Initialize Square Client
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!process.env.SQUARE_ACCESS_TOKEN) {
      console.error('SQUARE_ACCESS_TOKEN is missing');
      return res.status(500).json({ message: 'Server configuration error: Missing Access Token' });
  }

  try {
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
        error: errorMessage 
    });
  }
}
