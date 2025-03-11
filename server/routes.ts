import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoomSchema, insertProctorSchema, insertExamSchema, insertTimeSlotSchema } from "@shared/schema";
import axios from 'axios'; // Added import for axios


export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for Rooms
  app.get("/api/rooms", async (_req, res) => {
    try {
      const rooms = await storage.getAllRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rooms" });
    }
  });

  app.get("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.getRoom(parseInt(req.params.id));
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Error fetching room" });
    }
  });

  app.post("/api/rooms", async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(roomData);
      res.status(201).json(room);
    } catch (error) {
      res.status(400).json({ message: "Invalid room data" });
    }
  });

  // API Routes for Proctors
  app.get("/api/proctors", async (_req, res) => {
    try {
      const proctors = await storage.getAllProctors();
      res.json(proctors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching proctors" });
    }
  });

  app.get("/api/proctors/:id", async (req, res) => {
    try {
      const proctor = await storage.getProctor(parseInt(req.params.id));
      if (!proctor) {
        return res.status(404).json({ message: "Proctor not found" });
      }
      res.json(proctor);
    } catch (error) {
      res.status(500).json({ message: "Error fetching proctor" });
    }
  });

  app.post("/api/proctors", async (req, res) => {
    try {
      const proctorData = insertProctorSchema.parse(req.body);
      const proctor = await storage.createProctor(proctorData);
      res.status(201).json(proctor);
    } catch (error) {
      res.status(400).json({ message: "Invalid proctor data" });
    }
  });

  // API Routes for Exams
  app.get("/api/exams", async (req, res) => {
    try {
      const { level, department, date } = req.query;

      // If filters are provided, use filtered method
      if (level || department || date) {
        const exams = await storage.getFilteredExams({
          level: level as string,
          department: department as string,
          date: date as string,
        });
        return res.json(exams);
      }

      // Otherwise get all exams
      const exams = await storage.getAllExams();
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: "Error fetching exams" });
    }
  });

  app.get("/api/exams/:id", async (req, res) => {
    try {
      const exam = await storage.getExam(parseInt(req.params.id));
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      res.json(exam);
    } catch (error) {
      res.status(500).json({ message: "Error fetching exam" });
    }
  });

  app.post("/api/exams", async (req, res) => {
    try {
      const examData = insertExamSchema.parse(req.body);
      const exam = await storage.createExam(examData);
      res.status(201).json(exam);
    } catch (error) {
      res.status(400).json({ message: "Invalid exam data" });
    }
  });

  // API Routes for Time Slots
  app.get("/api/timeslots", async (_req, res) => {
    try {
      const timeSlots = await storage.getAllTimeSlots();
      res.json(timeSlots);
    } catch (error) {
      res.status(500).json({ message: "Error fetching time slots" });
    }
  });

  // Endpoint pour récupérer tous les créneaux horaires pour l'API
  app.get("/api/time-slots", async (_req, res) => {
    try {
      const timeSlots = await storage.getAllTimeSlots();
      res.json(timeSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      res.status(500).json({ message: "Error fetching time slots" });
    }
  });

  app.post("/api/generate-timeslots", async (_req, res) => {
    try {
      const response = await axios.post('http://localhost:8000/api/exam-scheduler/generate-timeslots/');
      res.json(response.data);
    } catch (error) {
      console.error('Error generating time slots:', error);
      res.status(500).json({ message: "Error generating time slots" });
    }
  });

  app.post("/api/timeslots", async (req, res) => {
    try {
      const timeSlotData = insertTimeSlotSchema.parse(req.body);
      const timeSlot = await storage.createTimeSlot(timeSlotData);
      res.status(201).json(timeSlot);
    } catch (error) {
      res.status(400).json({ message: "Invalid time slot data" });
    }
  });

  // API Route for Stats
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  // API Route pour la planification des examens
  app.post("/api/schedule", async (_req, res) => {
    try {
      // Simuler l'appel à l'algorithme d'optimisation
      const result = await storage.scheduleExams();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la planification des examens" });
    }
  });

  // Endpoint pour la planification manuelle
  app.post("/api/manual-schedule", async (req, res) => {
    try {
      const { examId, roomId, timeSlotId, proctorIds } = req.body;

      // Appeler le backend Django
      const response = await axios.post('http://localhost:8000/api/exam-scheduler/manual-schedule/', {
        exam_id: examId,
        room_id: roomId,
        time_slot_id: timeSlotId,
        proctor_ids: proctorIds
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error in manual scheduling:', error);
      res.status(500).send('Internal server error');
    }
  });

  // Route pour générer des créneaux horaires
  app.post("/api/generate-timeslots", async (req, res) => {
    try {
      const response = await axios.post('http://localhost:8000/api/exam-scheduler/generate-timeslots/', {
        start_time: "08:00",
        end_time: "18:00",
        interval_minutes: 30
      });

      res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      console.error('Error generating time slots:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}