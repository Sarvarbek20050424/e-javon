// src/lib/validations.ts
import { z } from "zod";

// Talaba profili uchun
export const studentProfileSchema = z.object({
  student_no: z.string().min(1, "Talaba ID kiritilishi shart"),
  birth_date: z.string().min(1, "Tug'ilgan sana kiritilishi shart"),
  passport: z.string().min(9, "Pasport seriyasi va raqami noto'g'ri (kamida 9 ta belgi)"),
  phone: z.string().min(9, "Telefon raqami noto'g'ri"),
  address: z.string().min(5, "Manzil kiritilishi shart"),
});

// O'qituvchi profili uchun
export const teacherProfileSchema = z.object({
  full_name: z.string().min(2, "To'liq ism kamida 2 ta belgidan iborat bo'lishi kerak"),
});

// Hujjat formasi uchun
export const documentFormSchema = z.record(z.string().min(1, "Bu maydonni to'ldirish shart"));