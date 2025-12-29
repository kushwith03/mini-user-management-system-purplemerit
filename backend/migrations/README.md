# Database Migrations

This project uses plain SQL files for database migrations.

## Migration Order

Migrations must be executed in ascending order based on their filename:

1. `001_create_users_table.sql`

## How to Run Migrations

### Local Development

Use the PostgreSQL `psql` CLI:

```bash
psql \
  -h <DB_HOST> \
  -p <DB_PORT> \
  -U <DB_USER> \
  -d <DB_NAME> \
  -f migrations/001_create_users_table.sql
```
