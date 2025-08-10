const mongoose = require('mongoose');
const Holiday = require('./model/holiday'); 

const holidays = [
  { title: "New Year's Day", date: "2025-01-01", description: "Celebration of New Year" },
  { title: "Republic Day", date: "2025-01-26", description: "Indian Republic Day" },
  { title: "Holi", date: "2025-03-14", description: "Festival of Colors" },
  { title: "Good Friday", date: "2025-04-18", description: "Christian holiday commemorating Jesus' crucifixion" },
  { title: "Ramadan Eid (Eid al-Fitr)", date: "2025-03-31", description: "Muslim festival marking end of Ramadan (tentative)" },
  { title: "Independence Day", date: "2025-08-15", description: "India's Independence Day" },
  { title: "Raksha Bandhan", date: "2025-08-09", description: "Celebration of sibling bond" },
  { title: "Ganesh Chaturthi", date: "2025-08-27", description: "Festival of Lord Ganesha" },
  { title: "Gandhi Jayanti", date: "2025-10-02", description: "Birth Anniversary of Mahatma Gandhi" },
  { title: "Dussehra (Vijayadashami)", date: "2025-10-02", description: "Victory of Good over Evil" },
  { title: "Diwali", date: "2025-10-20", description: "Festival of Lights" },
  { title: "Christmas", date: "2025-12-25", description: "Christmas Day" }
];

const MONGO_URI = 'mongodb://localhost:27017/Emp-Management-System'; 

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    await Holiday.deleteMany(); // optional: clean previous records
    await Holiday.insertMany(holidays);
    console.log('Holidays Seeded Successfully');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error seeding holidays:', error);
    mongoose.connection.close();
  });
