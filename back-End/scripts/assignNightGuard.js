const mongoose = require('mongoose');
const Nurse = require('../models/Nurse');
const NightGuard = require('../models/NightGuard');

const assignNightGuard = async () => {
  try {
    // Fetch all nurses
    const nurses = await Nurse.find();

    // Shuffle the nurses array to randomize the selection
    const shuffledNurses = nurses.sort(() => Math.random() - 0.5);

    // Split the nurses into two halves
    const half = Math.ceil(shuffledNurses.length / 2);
    const firstHalf = shuffledNurses.slice(0, half);
    const secondHalf = shuffledNurses.slice(half);

    // Assign hasGuard: true to the first half and update workingHours
    for (const nurse of firstHalf) {
      nurse.hasGuard = true;
      nurse.workingHours = '19:00 PM - 7:00 AM'; // Update workingHours
      await nurse.save();

      const nightGuard = new NightGuard({
        shiftTime: nurse.workingHours,
        date: new Date(),
        location: nurse.location,
        id_nurse: nurse._id,
      });

      await nightGuard.save();
    }

    // Assign hasGuard: false to the second half and update workingHours
    for (const nurse of secondHalf) {
      nurse.hasGuard = false;
      nurse.workingHours = '7:00 AM - 19:00 PM'; // Update workingHours
      await nurse.save();
    }

    console.log('Night guard assignment completed successfully.');
  } catch (error) {
    console.error('Error assigning night guard:', error);
  }
};


// Export the function
module.exports = assignNightGuard;