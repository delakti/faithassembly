import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
      if (!process.env.SQUARE_ACCESS_TOKEN) {
          throw new Error('Server configuration error: Missing SQUARE_ACCESS_TOKEN');
      }

      // Dynamic import to prevent cold-start crashes and handle CJS/ESM interop
      const squareCjs = await import('square');
      
      // Attempt to find Client in various export locations
      let Client = squareCjs.Client;
      if (!Client && squareCjs.default && squareCjs.default.Client) {
          Client = squareCjs.default.Client;
      }
      
      // Also check Environment similarly
      let Environment = squareCjs.Environment;
      if (!Environment && squareCjs.default && squareCjs.default.Environment) {
          Environment = squareCjs.default.Environment;
      }

      if (!Client) {
          console.error('Square SDK Import Debug:', Object.keys(squareCjs));
          throw new Error('Failed to import Square Client from SDK');
      }

      // Initialize Square Client
      const client = new Client({
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
        environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
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
