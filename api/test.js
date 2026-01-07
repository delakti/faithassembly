export default async function handler(req, res) {
  const hasToken = !!process.env.SQUARE_ACCESS_TOKEN;
  
  let squareImportResult = 'Not Attempted';
  let importError = null;

  try {
      const square = await import('square');
      const { Client } = square;
      squareImportResult = !!Client ? 'Success' : 'Client is undefined';
  } catch (e) {
      console.error('Import Error:', e);
      squareImportResult = 'Failed';
      importError = {
          message: e.message,
          stack: e.stack
      };
  }
  
  res.status(200).json({ 
      status: 'ok', 
      message: 'API is working', 
      nodeVersion: process.version,
      hasSquareToken: hasToken,
      squareImportResult,
      importError
  });
}
