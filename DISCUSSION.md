- What I would do to improve application if I had more time

  - In both the UI and the API there are likely opportunities to extract more code into their own files for better readability and maintainability
  - Implement click-to-sort on the table headers wired to the API
  - Add filtering by `degree`, `specialties`, `years of experience`, `phone number`
  - Create database indexes to support scale
  - Update the database schema for stronger data integrity
    - Specialties are currently stored in a jsonb 'payload' column. I would create a normalized `specialty` table to contain the possible values, then create a many-to-many relation between `advocates` and `specialty`. This update would allow us to fetch the possible `Specialty` values from the DB and then populate a dropdown to filter by them
    - In a similar vein, I would replace the free-text `degree` column with a lookup table or create a postgres ENUM table for the values. This would allow us to fetch the possible degree options and populate a dropdown to filter by them
  - If scale gets massive, setting up caching for the first page of results and / or common queries could provide good performance and UX gains
