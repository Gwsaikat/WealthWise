# Academic Calendar Component

The `AcademicCalendar` component allows students to track important financial dates related to their education, such as tuition payment deadlines, textbook purchases, housing payments, and other academic expenses.

## Features

- View a calendar with academic events and financial deadlines
- Add, edit, and delete academic events
- Track estimated expenses for each event
- Add events directly to expenses for budgeting
- Filter events by type (tuition, books, supplies, housing, fees, other)
- Support for recurring events (weekly, monthly, semester)
- Integration with the user's currency preference

## Setup Requirements

Before using this component, make sure you have:

1. Set up the `academic_events` table in your Supabase project using the migration file in `src/migrations/create_academic_events_table.sql`
2. Added the types for the academic_events table to `src/types/supabase.ts` as shown in the provided code
3. Installed the required dependencies:
   - `date-fns` for date formatting and manipulation
   - `uuid` for generating unique IDs

## Usage

Import and use the component in your React application:

```tsx
import AcademicCalendar from './components/calendar/AcademicCalendar';

const MyPage = () => {
  return (
    <div>
      <h1>My Academic Calendar</h1>
      <AcademicCalendar />
    </div>
  );
};

export default MyPage;
```

## Authentication

The component requires a logged-in user to function properly. The following features are available based on authentication status:

- **Logged In**: Full functionality including viewing, adding, editing, and deleting events.
- **Not Logged In**: A prompt to sign in is displayed with limited functionality.

## Event Types

The component supports the following event types:

- **Tuition Payment**: For tuition payments and related fees
- **Books & Materials**: For textbook purchases and course materials
- **Supplies**: For general academic supplies and equipment
- **Housing Payment**: For dorm or housing-related expenses
- **Fees & Dues**: For miscellaneous academic fees
- **Other**: For other education-related expenses

## Integration with Expenses

The component integrates with the expense tracking system, allowing users to add academic events directly as expenses with a single click. 