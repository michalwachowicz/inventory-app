# Inventory App

A book management application built with Express, TypeScript, and EJS

[Visit the preview](https://inventory-app-9iho.onrender.com/)

## 🛠️ Features

- Multiple routes
- PostgreSQL Support
- Form Validation built with Zod
- Caching with TTL system
- Search functionality
- CRUD operations for genres, authors, and books

## 🚀 Getting Started

### Prerequisites

- [NodeJS](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

Clone the repository and install dependencies:

```bash
git clone git@github.com:michalwachowicz/inventory-app.git
cd inventory-app
npm install
```

### Setting up the database

#### Updaing environment variables

Rename `.env.copy` file to `.env` and fill the values with your database credentials in the format specified in the file

#### Setting up the password

You need to set up the password in order to be able to perform CRUD operations inside the app. To set the password use the following command:

```bash
npm run db:password <new password>
```

#### Generating sample data

This step is optional as you can also start with an empty state and use your own data. After configuring the ENV file, simply run the following command to generate the sample data in your database:

```bash
npm run db:generate
```

You can also modify the sample data before generating by editing the `./src/db/sample-data.ts` file

### Running the app

#### Running the database

Before you run the app, please make sure that your PostgreSQL server is up and running

#### Development Mode

```bash
npm run dev
```

Visit the address shown in your terminal (usually `http://localhost:3000/`)

#### Production Mode

```bash
npm start
```

Visit the address shown in your terminal (usually `http://localhost:3000/`)
