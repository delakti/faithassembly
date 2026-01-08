export default async function handler(req, res) {
  const hasToken = !!process.env.SQUARE_ACCESS_TOKEN;
  
  let squareImportResult = 'Not Attempted';
  let importError = null;

  try {
      const square = await import('square');
      // Inspect what is actually exported
      squareImportResult = {
          keys: Object.keys(square),
          defaultKeys: square.default ? Object.keys(square.default) : 'No Default'
      };
      
      const { Client } = square;
      const ClientFromDefault = square.default?.Client;
      
      squareImportResult.foundClient = !!Client;
      squareImportResult.foundClientInDefault = !!ClientFromDefault;
      
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
      importDebug: squareImportResult,
      importError
  });
}
