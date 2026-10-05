# Local database

Start MySQL in XAMPP. Development defaults are `localhost:3306`, user `root`, empty password, database `saathhisab`. Override with `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `apps/server/.env`.

From the repository root:

```sh
npm run db:setup
npm run db:seed
npm run dev:server
```

Setup creates the database and applies `schema.sql` only when it has no tables. It never drops or rewrites existing tables. An existing installation retains its IDs, password hashes, and data; its table and column names must match `schema.sql`. Future schema changes require explicit SQL migrations, not rerunning initial setup. The optional seed requires an empty users table and creates the three demo accounts with password `password123`.

Tests require `TEST_DATABASE_URL=mysql://root@localhost:3306/saathhisab_test`. The database name must end in `_test` and differ from `DB_NAME`. Set `NODE_ENV=test` when running `apps/server/database/setup.js` to initialize that schema. `npm run db:reset:test` deletes only data in the explicitly configured test schema, preserving its tables.

```powershell
$env:NODE_ENV = 'test'
node apps/server/database/setup.js
Remove-Item Env:NODE_ENV
npm run test:engine
npm run test:api
```

Runtime SQL uses bound parameters. Multi-step writes use a single connection with commit/rollback. Money remains integer paisa; unsafe integer conversions are rejected. Dates use UTC and activity metadata is decoded as JSON. Settlement transitions lock rows to prevent concurrent double confirmation.
