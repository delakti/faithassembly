import { Client, Environment } from 'square';

export default function handler(req, res) {
  const hasToken = !!process.env.SQUARE_ACCESS_TOKEN;
  const squareImported = !!Client;
  
  res.status(200).json({ 
      status: 'ok', 
      message: 'API is working', 
      nodeVersion: process.version,
      hasSquareToken: hasToken,
      squareImportSuccess: squareImported
  });
}
