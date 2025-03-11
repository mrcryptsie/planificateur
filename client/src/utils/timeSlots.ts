
import axios from 'axios';

// Fonction pour créer des créneaux horaires
export async function createTimeSlots() {
  try {
    // Dates pour les 5 prochains jours
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    // Heures de début (de 08h à 16h)
    const startHours = [8, 10, 12, 14, 16];
    
    // Créer les créneaux
    for (const date of dates) {
      for (const hour of startHours) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 2, 0, 0, 0);
        
        // Vérifier si le créneau est pendant les heures de cours (8h-18h)
        if (startTime.getHours() >= 8 && endTime.getHours() <= 18) {
          await axios.post('/api/timeslots', {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString()
          });
        }
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la création des créneaux horaires:', error);
    return { success: false, error };
  }
}
