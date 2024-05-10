module.exports = {
    user: "booksapi_shin", // Replace with your SQL Server login username
    password: "booksapi_$hinTA", // Replace with your SQL Server login password
    server: "localhost",
    database: "bed_db",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };

