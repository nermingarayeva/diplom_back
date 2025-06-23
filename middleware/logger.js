const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'N/A';
  
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
    
    const startTime = Date.now();
  
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      const statusColor = getStatusColor(statusCode);
      
      console.log(`[${timestamp}] ${method} ${url} - ${statusColor}${statusCode}\x1b[0m - ${duration}ms - ${ip}`);
    });
  
    res.on('error', (err) => {
      console.error(`[${timestamp}] ERROR ${method} ${url} - ${err.message} - IP: ${ip}`);
    });
  
    next();
  };
  
  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) {
      return '\x1b[32m';
    } else if (statusCode >= 300 && statusCode < 400) {
      return '\x1b[33m'; 
    } else if (statusCode >= 400 && statusCode < 500) {
      return '\x1b[31m'; 
    } else if (statusCode >= 500) {
      return '\x1b[35m'; 
    }
    return '\x1b[0m'; 
  };
  
  module.exports = logger;