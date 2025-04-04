const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'SharpPay  ',
        version: '1.0.0',
        description: 'API documentation for Sharppay ',
      },
      servers: [
        {
          url: 'http://localhost:5000/',
        //   url: 'https://sharppay.ticketmastermr.com/',
          
        },
      ],
    },
    // Path to the API files
    apis: ['./controllers/*/*.js','./controllers/*/*/*.js'], // Add the path to your route files
  };
  
  module.exports = swaggerOptions;
  