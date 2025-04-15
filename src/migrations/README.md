# Database Migrations

This directory contains SQL migration files for the WealthWise application.

## How to Apply Migrations

To set up the tables needed for the application, you need to run these migrations in your Supabase project.

### Setting up the Academic Events Table

1. Open your Supabase project dashboard
2. Go to the SQL Editor section
3. Create a new query
4. Copy and paste the contents of `create_academic_events_table.sql` into the SQL editor
5. Run the query to create the academic events table and set up the security policies

## Table Descriptions

### Academic Events

This table stores academic-related financial events such as tuition payments, textbook purchases, and other academic expenses.

| Column | Description |
|--------|-------------|
| id | Unique identifier (UUID) |
| user_id | Reference to the auth user |
| title | The event title |
| date | The date of the event |
| description | Optional description of the event |
| type | Event type (tuition, books, supplies, housing, fee, other) |
| estimatedExpense | The estimated cost of the event |
| isRecurring | Whether the event is recurring |
| recurringFrequency | How often the event recurs (weekly, monthly, semester) |
| created_at | Timestamp when the record was created |
| updated_at | Timestamp when the record was last updated 