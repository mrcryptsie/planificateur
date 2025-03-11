import {
  type Room, type InsertRoom,
  type Proctor, type InsertProctor,
  type Exam, type InsertExam,
  type TimeSlot, type InsertTimeSlot,
  exams, rooms, proctors, timeSlots
} from "@shared/schema";

// Type for exam filters
interface ExamFilters {
  level?: string;
  department?: string;
  date?: string;
}

// Type for statistics
interface Stats {
  totalExams: number;
  totalRooms: number;
  totalProctors: number;
  roomOccupation: number;
  proctorDistribution: number;
  timeSlotBalance: number;
  examsByDepartment: {
    department: string;
    count: number;
    percentage: number;
  }[];
}

export interface IStorage {
  // Room operations
  getAllRooms(): Promise<Room[]>;
  getRoom(id: number): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  
  // Proctor operations
  getAllProctors(): Promise<Proctor[]>;
  getProctor(id: number): Promise<Proctor | undefined>;
  createProctor(proctor: InsertProctor): Promise<Proctor>;
  
  // Exam operations
  getAllExams(): Promise<Exam[]>;
  getExam(id: number): Promise<Exam | undefined>;
  getFilteredExams(filters: ExamFilters): Promise<Exam[]>;
  createExam(exam: InsertExam): Promise<Exam>;
  
  // TimeSlot operations
  getAllTimeSlots(): Promise<TimeSlot[]>;
  createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot>;
  
  // Stats
  getStats(): Promise<Stats>;
}

export class MemStorage implements IStorage {
  private rooms: Map<number, Room>;
  private proctors: Map<number, Proctor>;
  private exams: Map<number, Exam>;
  private timeSlots: Map<number, TimeSlot>;
  
  private roomId: number;
  private proctorId: number;
  private examId: number;
  private timeSlotId: number;
  
  constructor() {
    this.rooms = new Map();
    this.proctors = new Map();
    this.exams = new Map();
    this.timeSlots = new Map();
    
    this.roomId = 1;
    this.proctorId = 1;
    this.examId = 1;
    this.timeSlotId = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }
  
  // Initialize sample data
  private initSampleData() {
    // Sample rooms
    const sampleRooms: InsertRoom[] = [
      { name: "Amphi A", capacity: 150, occupancyRate: 68, status: "available" },
      { name: "Salle 103", capacity: 50, occupancyRate: 42, status: "partially_occupied" },
      { name: "Salle Informatique B", capacity: 30, occupancyRate: 85, status: "occupied" }
    ];
    
    sampleRooms.forEach(room => this.createRoom(room));
    
    // Sample proctors
    const sampleProctors: InsertProctor[] = [
      { 
        name: "Jean Dupont", 
        department: "informatique", 
        availability: ["2024-05-15T08:00:00Z", "2024-05-16T10:00:00Z"],
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&q=80"
      },
      { 
        name: "Marie Lambert", 
        department: "mathematiques", 
        availability: ["2024-05-15T08:00:00Z", "2024-05-15T14:00:00Z"],
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&q=80"
      },
      { 
        name: "Thomas Martin", 
        department: "informatique", 
        availability: ["2024-05-15T10:00:00Z", "2024-05-16T08:00:00Z"],
        avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&q=80"
      }
    ];
    
    sampleProctors.forEach(proctor => this.createProctor(proctor));
    
    // Sample exams
    const sampleExams: InsertExam[] = [
      {
        name: "Algorithmes et Structures de Données",
        level: "l2",
        department: "informatique",
        duration: "2h30",
        date: new Date("2024-05-15T08:00:00Z"),
        roomId: 1,
        participants: 128,
        proctorIds: [1, 2]
      },
      {
        name: "Analyse Mathématique",
        level: "l1",
        department: "mathematiques",
        duration: "3h",
        date: new Date("2024-05-15T10:00:00Z"),
        roomId: 2,
        participants: 45,
        proctorIds: [3]
      },
      {
        name: "Introduction à la Programmation Web",
        level: "l2",
        department: "informatique",
        duration: "2h",
        date: new Date("2024-05-15T14:00:00Z"),
        roomId: 3,
        participants: 28,
        proctorIds: [2, 3]
      }
    ];
    
    sampleExams.forEach(exam => this.createExam(exam));
  }
  
  // Room operations
  async getAllRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }
  
  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }
  
  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = this.roomId++;
    const room = { ...insertRoom, id };
    this.rooms.set(id, room);
    return room;
  }
  
  // Proctor operations
  async getAllProctors(): Promise<Proctor[]> {
    return Array.from(this.proctors.values());
  }
  
  async getProctor(id: number): Promise<Proctor | undefined> {
    return this.proctors.get(id);
  }
  
  async createProctor(insertProctor: InsertProctor): Promise<Proctor> {
    const id = this.proctorId++;
    const proctor = { ...insertProctor, id };
    this.proctors.set(id, proctor);
    return proctor;
  }
  
  // Exam operations
  async getAllExams(): Promise<Exam[]> {
    return Array.from(this.exams.values());
  }
  
  async getExam(id: number): Promise<Exam | undefined> {
    return this.exams.get(id);
  }
  
  async getFilteredExams(filters: ExamFilters): Promise<Exam[]> {
    let filteredExams = Array.from(this.exams.values());
    
    if (filters.level) {
      filteredExams = filteredExams.filter(exam => exam.level === filters.level);
    }
    
    if (filters.department) {
      filteredExams = filteredExams.filter(exam => exam.department === filters.department);
    }
    
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filteredExams = filteredExams.filter(exam => {
        const examDate = new Date(exam.date);
        return examDate.toDateString() === filterDate.toDateString();
      });
    }
    
    return filteredExams;
  }
  
  async createExam(insertExam: InsertExam): Promise<Exam> {
    const id = this.examId++;
    const exam = { ...insertExam, id };
    this.exams.set(id, exam);
    return exam;
  }
  
  // TimeSlot operations
  async getAllTimeSlots(): Promise<TimeSlot[]> {
    return Array.from(this.timeSlots.values());
  }
  
  async createTimeSlot(insertTimeSlot: InsertTimeSlot): Promise<TimeSlot> {
    const id = this.timeSlotId++;
    const timeSlot = { ...insertTimeSlot, id };
    this.timeSlots.set(id, timeSlot);
    return timeSlot;
  }
  
  // Stats operations
  async getStats(): Promise<Stats> {
    const allExams = await this.getAllExams();
    const totalExams = allExams.length;
    
    // Group exams by department
    const departmentCounts: Record<string, number> = {};
    allExams.forEach(exam => {
      departmentCounts[exam.department] = (departmentCounts[exam.department] || 0) + 1;
    });
    
    // Calculate percentages
    const examsByDepartment = Object.entries(departmentCounts).map(([department, count]) => ({
      department,
      count,
      percentage: Math.round((count / totalExams) * 100),
    }));
    
    return {
      totalExams,
      totalRooms: this.rooms.size,
      totalProctors: this.proctors.size,
      roomOccupation: 72, // Mocked value
      proctorDistribution: 85, // Mocked value
      timeSlotBalance: 64, // Mocked value
      examsByDepartment,
    };
  }
}

export const storage = new MemStorage();
