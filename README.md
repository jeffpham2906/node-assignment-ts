# Installation

```bash
npm install
```

## Database

Change DATABASE_URL in .env file by your account settings

## Migrate database

```bash
npm run migrate
```

Enter some name for the migration

This step will migrate the database and adding seeding data.
You can see detail at prisma/seed.ts.

```bash
npm run dev
```

Run development environment for pre configured

## Document APIs

There a two documentation available. You can see SWAGGER ui http://localhost:3000/api-docs, and POSTMAN for easy testing
at https://documenter.getpostman.com/view/24846071/2sA3sAh7Uj

I prefer you access my postman for more details