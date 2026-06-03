/* ============================================================================
   Mount Comfort Men's Club — static club data
   ----------------------------------------------------------------------------
   Edit this file to add a new meeting or change the roster. No database
   changes are needed for either — ratings key off the book title.

   To add a meeting: add a new object to the TOP of MEETINGS.
   To add/remove a member: edit MEMBERS.

   Ratings are stored on a 1–10 scale (the UI shows them as 5 stars, where
   each star = 2 points, so half-stars are supported). SEED_RATINGS below is a
   one-time snapshot migrated from the old Val.town app; it only seeds the
   local demo. The live shared data lives in Supabase (see supabase.sql).
   ========================================================================== */

window.MEMBERS = [
  "Mike Kaminski",
  "William Biehn",
  "Justin Ray",
  "Derek Wardlow",
  "Travis Fink",
  "Heath Rheay",
  "Alex Dowell",
  "John Post",
];

window.MEETINGS = [
  { date: "May 2026", book: "Sightseeing", leader: "William Biehn", drink: "A Taste of Thailand" },
  { date: "April 2026", book: "The Journey to the East", leader: "Alex Dowell", drink: "Brews from Bremgarten" },
  { date: "March 2026", book: "Project Hail Mary", leader: "Heath Rheay", drink: "Russian Vodka & Tube Lasagna" },
  { date: "February 2026", book: "Revenge of the Tipping Point", leader: "Travis Fink", drink: "The Magic Third" },
  { date: "January 2026", book: "A Study in Scarlet", leader: "Derek Wardlow", drink: "Elementary" },
  { date: "November 2025", book: "Fathered by God", leader: "Mike Kaminski", drink: "Dad's Greatest Hits" },
  { date: "October 2025", book: "Frankenstein", leader: "Alex Dowell", drink: "A Bad Summer in Ireland" },
  { date: "September 2025", book: "The Ruthless Elimination of Hurry", leader: "William Biehn", drink: "Unhurried Spirits" },
  { date: "August 2025", book: "Digital Fortress", leader: "Justin Ray", drink: "19-1-14-7-18-9-1" },
  { date: "July 2025", book: "1984", leader: "Heath Rheay", drink: "Victory Gin" },
  { date: "June 2025", book: "These Silent Woods", leader: "Travis Fink", drink: "Cold Hot Chocolates" },
  { date: "May 2025", book: "With", leader: "Derek Wardlow", drink: "Mixer Roulette" },
  { date: "April 2025", book: "The Imitation of Christ", leader: "Mike Kaminski", drink: "Monk Mead" },
  { date: "February 2025", book: "The Problem of Pain", leader: "Justin Ray", drink: "Tonic for the Pain" },
  { date: "January 2025", book: "Be a Man of Standing", leader: "William Biehn", drink: "Israeli Wine & Superman Sliders" },
  { date: "December 2024", book: "The Wager", leader: "Heath Rheay", drink: "Grog" },
  { date: "October 2024", book: "Same Kind of Different as Me", leader: "Travis Fink", drink: "Serendipitous Swirl" },
  { date: "September 2024", book: "Family Discipleship", leader: "Derek Wardlow", drink: "Family Fellowship Flight" },
  { date: "August 2024", book: "Mere Christianity", leader: "Mike Kaminski", drink: "The Drinklings" },
  { date: "July 2024", book: "Imitating Jesus", leader: "Justin Ray", drink: "Passover Wine" },
  { date: "June 2024", book: "Extreme Ownership", leader: "William Biehn", drink: "Arak Heavenly Black Licorice" },
  { date: "May 2024", book: "Demon Copperhead", leader: "Heath Rheay", drink: "Lee County Cooler (& Feast)" },
  { date: "April 2024", book: "The Boys in the Boat", leader: "Travis Fink", drink: "Old Fashioned" },
  { date: "March 2024", book: "The Greatest Beer Run Ever", leader: "Derek Wardlow", drink: "Medal of Honor" },
  { date: "February 2024", book: "The Road", leader: "Mike Kaminski", drink: "Boulevard Ale Trail" },
  { date: "January 2024", book: "Winning the War in Your Mind", leader: "Justin Ray", drink: "Cognactive Bias" },
  { date: "November 2023", book: "The Screwtape Letters", leader: "Heath Rheay", drink: "El Diablo" },
  { date: "October 2023", book: "Pilgrim's Progress", leader: "Travis Fink", drink: "Flight to the Light" },
  { date: "September 2023", book: "This is the Day", leader: "Derek Wardlow", drink: "Dreamsicle" },
  { date: "August 2023", book: "Gates of Fire", leader: "Mike Kaminski", drink: "Dark and Stormy" },
  { date: "July 2023", book: "Voice of the Heart", leader: "Justin Ray", drink: "Woodchuck Hard Cider" },
];

// One-time snapshot migrated from the old app (1–10 scale). Seeds demo mode only.
window.SEED_RATINGS = {
  "1984": { "Justin Ray": 8, "Alex Dowell": 10 },
  "Digital Fortress": { "Justin Ray": 10, "Alex Dowell": 6 },
  "Project Hail Mary": { "Justin Ray": 1, "Alex Dowell": 8 },
  "These Silent Woods": { "Justin Ray": 6 },
  "With": { "Justin Ray": 10 },
  "The Wager": { "Justin Ray": 5 },
  "Sightseeing": { "Justin Ray": 2, "Alex Dowell": 5 },
  "A Study in Scarlet": { "Justin Ray": 8, "Alex Dowell": 7 },
  "Fathered by God": { "Justin Ray": 6, "Alex Dowell": 9 },
  "Frankenstein": { "Justin Ray": 9, "Alex Dowell": 10 },
  "The Ruthless Elimination of Hurry": { "Justin Ray": 7, "Alex Dowell": 8 },
  "The Imitation of Christ": { "Justin Ray": 9 },
  "The Problem of Pain": { "Justin Ray": 8 },
  "Be a Man of Standing": { "Justin Ray": 8 },
  "Same Kind of Different as Me": { "Justin Ray": 8 },
  "Family Discipleship": { "Justin Ray": 7 },
  "Mere Christianity": { "Justin Ray": 10 },
  "Imitating Jesus": { "Justin Ray": 10 },
  "Extreme Ownership": { "Justin Ray": 8 },
  "Demon Copperhead": { "Justin Ray": 4 },
  "The Boys in the Boat": { "Justin Ray": 7 },
  "The Greatest Beer Run Ever": { "Justin Ray": 5 },
  "The Road": { "Justin Ray": 3 },
  "Winning the War in Your Mind": { "Justin Ray": 6 },
  "The Screwtape Letters": { "Justin Ray": 10 },
  "Pilgrim's Progress": { "Justin Ray": 9 },
  "This is the Day": { "Justin Ray": 5 },
  "Gates of Fire": { "Justin Ray": 4 },
  "Voice of the Heart": { "Justin Ray": 5 },
  "The Journey to the East": { "Alex Dowell": 8 },
  "Revenge of the Tipping Point": { "Alex Dowell": 7 },
};
