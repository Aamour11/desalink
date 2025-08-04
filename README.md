# DESIGN AND DEVELOPMENT OF AN ANALYTICAL DASHBOARD APPLICATION WITH STATISTICAL DATA PROCESSING ALGORITHMS FOR MONITORING THE GROWTH OF MSMEs AT THE VILLAGE LEVEL

## Abstract

The management of Micro, Small, and Medium Enterprises (MSMEs) data at the village level is a crucial process for monitoring local economic growth. However, many village governments, especially at the RT/RW (neighborhood association) level, face difficulties in making strategic decisions because the available data is still manual, scattered, and unprocessed. Therefore, this research aims to build a web-based analytical dashboard application using statistical data processing algorithms. This system analyzes data attributes such as business type, region, operational status, and establishment date to provide accurate statistical summaries. MSME data is obtained from direct data collection and processed into a relevant dataset. The system is designed using the Next.js platform, the TypeScript programming language, and is tested using mock data for functionality validation. The implementation results show that the system successfully presents aggregate data in the form of a dashboard, an interactive table with search and filter features, and the ability to export reports in PDF and CSV formats. Thus, this system can be an effective tool for village governments in monitoring and planning the development of MSME potential objectively and based on data.

**Keywords:** Analytical Dashboard, MSMEs, Information System, Data Processing Algorithms, Data Visualization, Next.js

## Database Setup

This application requires a MySQL database.

### 1. Environment Variables

Create a `.env` file in the root of the project and add your database connection details:

```env
MYSQL_HOST=your_database_host
MYSQL_USER=your_database_user
MYSQL_PASSWORD=your_database_password
MYSQL_DATABASE=your_database_name
JWT_SECRET=your_super_secret_jwt_key_that_is_long_enough
```

### 2. Initialize Database

Once your `.env` file is configured, run the initialization script to automatically create the necessary `users` and `umkm` tables in your database.

Open your terminal in the project root and run:

```bash
npm run db:init
```

This command only needs to be run once. After the script finishes, your database will be ready and you can start the application.
