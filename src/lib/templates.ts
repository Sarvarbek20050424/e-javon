// src/lib/templates.ts

export type TemplateSlug = "spravka" | "leave" | "dorm" | "move" | "expl";

export interface TemplateField {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "date" | "textarea" | "select";
  options?: string[];
}

export interface Template {
  slug: TemplateSlug;
  title: string;
  category: string;
  fields: TemplateField[];
  render: (student: StudentData, form: Record<string, string>) => string;
}

export interface StudentData {
  full_name: string;
  student_no: string;
  birth_date: string | null;
  passport: string | null;
  phone: string | null;
  address: string | null;
  course: number | null;
  group_name: string;
  faculty_name: string;
}

// Helper: sanani o'zbekcha formatlash
function formatDateUz(dateStr: string | null): string {
  if (!dateStr) return "____________";
  const d = new Date(dateStr);
  const months = [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}-yil`;
}

function todayUz(): string {
  return formatDateUz(new Date().toISOString());
}

// ============================================================
// 1. Ma'lumotnoma (o'qish joyidan)
// ============================================================
export const spravka: Template = {
  slug: "spravka",
  title: "Ma'lumotnoma (o'qish joyidan)",
  category: "Ma'lumotnomalar",
  fields: [
    { key: "recipient", label: "Kim uchun (tashkilot nomi)", placeholder: "Toshkent shahar hokimligiga", type: "text" },
    { key: "purpose", label: "Maqsad", placeholder: "Ishga joylashish uchun", type: "text" },
  ],
  render: (s, f) => `
    <div style="text-align:center; font-weight:bold; margin-bottom:24px;">MA'LUMOTNOMA</div>
    <div style="text-align:right; margin-bottom:16px;">${todayUz()}</div>
    <div style="margin-bottom:16px;">
      Berildi: <strong>${s.full_name}</strong>ga, shaxsiy talaba raqami <strong>${s.student_no}</strong>,
      ${s.faculty_name} fakulteti, <strong>${s.group_name}</strong> guruh talabasi.
    </div>
    <div style="margin-bottom:16px;">
      Ushbu ma'lumotnoma ${f.recipient || "____________"} ga taqdim etish uchun berildi.
      Maqsad: ${f.purpose || "____________"}.
    </div>
    <div style="margin-bottom:32px;">
      Tug'ilgan sanasi: ${formatDateUz(s.birth_date)}<br/>
      Pasport: ${s.passport || "____________"}<br/>
      Manzil: ${s.address || "____________"}
    </div>
    <div style="margin-top:48px; text-align:right;">
      Dekan: ________________ / ________________
    </div>
  `,
};

// ============================================================
// 2. Akademik ta'til arizasi
// ============================================================
export const leave: Template = {
  slug: "leave",
  title: "Ariza: akademik ta'til",
  category: "Arizalar",
  fields: [
    { key: "start_date", label: "Boshlanish sanasi", placeholder: "", type: "date" },
    { key: "end_date", label: "Tugash sanasi", placeholder: "", type: "date" },
    { key: "reason", label: "Sabab", placeholder: "Oilaviy sharoitlar tufayli...", type: "textarea" },
  ],
  render: (s, f) => `
    <div style="text-align:right; margin-bottom:32px;">
      ${s.faculty_name} fakulteti dekaniga<br/>
      <strong>${s.full_name}</strong>dan<br/>
      (${s.group_name} guruh talabasi)
    </div>
    <div style="text-align:center; font-weight:bold; margin-bottom:24px;">ARIZA</div>
    <div style="margin-bottom:16px;">
      Men, <strong>${s.full_name}</strong>, ${s.faculty_name} fakulteti <strong>${s.group_name}</strong> guruh talabasi,
      oilaviy sharoitlar tufayli <strong>${formatDateUz(f.start_date)}</strong> dan
      <strong>${formatDateUz(f.end_date)}</strong> gacha akademik ta'til berishingizni so'rayman.
    </div>
    <div style="margin-bottom:32px;">
      Sabab: ${f.reason || "____________"}
    </div>
    <div style="margin-top:48px; text-align:right;">
      Sana: ${todayUz()}<br/>
      Imzo: ________________
    </div>
  `,
};

// ============================================================
// 3. Yotoqxona arizasi
// ============================================================
export const dorm: Template = {
  slug: "dorm",
  title: "Ariza: yotoqxona",
  category: "Arizalar",
  fields: [
    { key: "dorm_number", label: "Yotoqxona raqami", placeholder: "3-yotoqxona", type: "text" },
    { key: "reason", label: "Yotoxonaga muhtojlik sababi", placeholder: "Toshkent shahrida doimiy yashash joyim yo'q...", type: "textarea" },
  ],
  render: (s, f) => `
    <div style="text-align:right; margin-bottom:32px;">
      Universitet yotoqxona bo'limi boshlig'iga<br/>
      <strong>${s.full_name}</strong>dan<br/>
      (${s.group_name} guruh talabasi)
    </div>
    <div style="text-align:center; font-weight:bold; margin-bottom:24px;">ARIZA</div>
    <div style="margin-bottom:16px;">
      Men, <strong>${s.full_name}</strong>, ${s.faculty_name} fakulteti <strong>${s.group_name}</strong> guruh
      ${s.course ? `${s.course}-kurs` : ""} talabasi,
      ${f.dorm_number || "____________"} ga joylashtirishni so'rayman.
    </div>
    <div style="margin-bottom:32px;">
      ${f.reason || "____________"}
    </div>
    <div style="margin-bottom:16px;">
      Telefon: ${s.phone || "____________"}<br/>
      Manzil: ${s.address || "____________"}
    </div>
    <div style="margin-top:48px; text-align:right;">
      Sana: ${todayUz()}<br/>
      Imzo: ________________
    </div>
  `,
};

// ============================================================
// 4. Guruh almashtirish arizasi
// ============================================================
export const move: Template = {
  slug: "move",
  title: "Ariza: guruh almashtirish",
  category: "Arizalar",
  fields: [
    { key: "from_group", label: "Hozirgi guruh", placeholder: "221-20", type: "text" },
    { key: "to_group", label: "O'tmoqchi bo'lgan guruh", placeholder: "222-20", type: "text" },
    { key: "reason", label: "Sabab", placeholder: "Ish joyim o'zgarganligi sababli...", type: "textarea" },
  ],
  render: (s, f) => `
    <div style="text-align:right; margin-bottom:32px;">
      ${s.faculty_name} fakulteti dekaniga<br/>
      <strong>${s.full_name}</strong>dan<br/>
      (${s.group_name} guruh talabasi)
    </div>
    <div style="text-align:center; font-weight:bold; margin-bottom:24px;">ARIZA</div>
    <div style="margin-bottom:16px;">
      Men, <strong>${s.full_name}</strong>, hozirgi <strong>${f.from_group || s.group_name}</strong> guruhidan
      <strong>${f.to_group || "____________"}</strong> guruhiga o'tkazishni so'rayman.
    </div>
    <div style="margin-bottom:32px;">
      Sabab: ${f.reason || "____________"}
    </div>
    <div style="margin-top:48px; text-align:right;">
      Sana: ${todayUz()}<br/>
      Imzo: ________________
    </div>
  `,
};

// ============================================================
// 5. Tushuntirish xati
// ============================================================
export const expl: Template = {
  slug: "expl",
  title: "Tushuntirish xati",
  category: "Tushuntirish xatlar",
  fields: [
    { key: "incident_date", label: "Hodisa sanasi", placeholder: "", type: "date" },
    { key: "description", label: "Hodisa tafsiloti", placeholder: "Darsga kech qolishim sababi...", type: "textarea" },
  ],
  render: (s, f) => `
    <div style="text-align:right; margin-bottom:32px;">
      ${s.faculty_name} fakulteti dekaniga<br/>
      <strong>${s.full_name}</strong>dan<br/>
      (${s.group_name} guruh talabasi)
    </div>
    <div style="text-align:center; font-weight:bold; margin-bottom:24px;">TUSHUNTIRISH XATI</div>
    <div style="margin-bottom:16px;">
      Men, <strong>${s.full_name}</strong>, ${s.faculty_name} fakulteti <strong>${s.group_name}</strong> guruh talabasi,
      quyidagi holat yuzasidan tushuntirish beraman.
    </div>
    <div style="margin-bottom:16px;">
      <strong>Hodisa sanasi:</strong> ${formatDateUz(f.incident_date)}
    </div>
    <div style="margin-bottom:32px;">
      <strong>Tafsilot:</strong><br/>
      ${f.description || "____________"}
    </div>
    <div style="margin-top:48px; text-align:right;">
      Sana: ${todayUz()}<br/>
      Imzo: ________________
    </div>
  `,
};

// ============================================================
// Barcha shablonlar ro'yxati
// ============================================================
export const TEMPLATES: Template[] = [spravka, leave, dorm, move, expl];

export function getTemplate(slug: TemplateSlug): Template {
  return TEMPLATES.find((t) => t.slug === slug)!;
}