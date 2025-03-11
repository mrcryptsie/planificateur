import { pgTable, text, serial, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const roomStatusEnum = pgEnum('room_status', ['available', 'partially_occupied', 'occupied']);
export const departmentEnum = pgEnum('department', ['informatique', 'mathematiques', 'physique', 'chimie', 'biologie', 'autres']);
export const levelEnum = pgEnum('level', ['l1', 'l2', 'l3', 'm1', 'm2']);

// Room schema
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  capacity: integer("capacity").notNull(),
  occupancyRate: integer("occupancy_rate").default(0),
  status: roomStatusEnum("status").default('available'),
});

// Proctor schema
export const proctors = pgTable("proctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  department: departmentEnum("department").notNull(),
  availability: text("availability").array(),
  avatarUrl: text("avatar_url"),
});

// Exam schema
export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  level: levelEnum("level").notNull(),
  department: departmentEnum("department").notNull(),
  duration: text("duration").notNull(),
  date: timestamp("date").notNull(),
  roomId: integer("room_id").references(() => rooms.id),
  participants: integer("participants").default(0),
  proctorIds: integer("proctor_ids").array(),
});

// Time slot schema
export const timeSlots = pgTable("time_slots", {
  id: serial("id").primaryKey(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  examId: integer("exam_id").references(() => exams.id),
  roomId: integer("room_id").references(() => rooms.id),
});

// Insert schemas
export const insertRoomSchema = createInsertSchema(rooms).omit({ id: true });
export const insertProctorSchema = createInsertSchema(proctors).omit({ id: true });
export const insertExamSchema = createInsertSchema(exams).omit({ id: true });
export const insertTimeSlotSchema = createInsertSchema(timeSlots).omit({ id: true });

// Types
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

export type InsertProctor = z.infer<typeof insertProctorSchema>;
export type Proctor = typeof proctors.$inferSelect;

export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof exams.$inferSelect;

export type InsertTimeSlot = z.infer<typeof insertTimeSlotSchema>;
export type TimeSlot = typeof timeSlots.$inferSelect;
