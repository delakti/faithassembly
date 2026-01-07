import { Client, Environment } from 'square';

// Initialize Square Client
// Note: In production, switch Environment.Sandbox to Environment.Production
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sourceId, amount } = req.body;

    if (!sourceId || !amount) {
        return res.status(400).json({ message: 'Missing sourceId or amount' });
    }

    // Amount is in cents (e.g., $10.00 = 1000)
    // Ensure amount is a BigInt or string if needed by SDK, but usually number/string works for JSON
    const paymentsApi = client.paymentsApi;
    
    // Create a unique idempotency key
    const idempotencyKey = crypto.randomUUID();

    const { result } = await paymentsApi.createPayment({
      idempotencyKey,
      sourceId,
      amountMoney: {
        amount: BigInt(amount), // Amount in lowest denomination (e.g., cents)
        currency: 'GBP', // Changed to GBP since previous context mentioned UK
      },
    });

    // Send the result back to the client
    // We parse the result with JSON.stringify to handle BigInt serialization if necessary
    const jsonResult = JSON.parse(JSON.stringify(result, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));

    return res.status(200).json(jsonResult);

  } catch (error) {
    console.error('Payment Error:', error);
    return res.status(500).json({ 
        message: 'Payment failed', 
        error: error.message,
        details: error.errors ? error.errors : undefined
    });
  }
}
