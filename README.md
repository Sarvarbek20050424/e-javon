# E-javon вЂ” Talaba hujjat tizimi

**Elektron javon** вЂ” O'zbekiston OTMlari uchun talaba hujjatlarini yaratish, saqlash va o'qituvchilar bilan ulashish tizimi. Ma'lumotnomalar, arizalar, tushuntirish xatlari va obyektilarni bir necha daqiqada yarating, javoningizda saqlang va PDF formatida yuklab oling.

![Next.js](https://img.shields.io/badge/Next.js-16.3.7-black)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.17-38BDF8)

---

## рџЋЇ Asosiy xususiyatlar

### Talaba uchun
- **5 ta hujjat shabloni**: Ma'lumotnoma, Akademik ta'til arizasi, Yotoqxona arizasi, Guruh almashtirish, Tushuntirish xati, Obyektivka
- **Live preview**: Hujjat yaratishda A4 varaqda real vaqtda ko'rinish
- **Javon**: Barcha hujjatlar toifalar bo'yicha guruhlangan (spine kartalar)
- **PDF yuklab olish**: Har bir hujjatni PDF formatida saqlash
- **Pechat**: To'g'ridan-to'g'ri printer orqali chop etish
- **O'qituvchiga ulashish**: Hujjatni o'qituvchi ko'rishi uchun ochiq qilish

### O'qituvchi uchun
- **Guruh boshqaruvi**: Biriktirilgan guruhlardagi talabalar ro'yxati
- **Ochiq hujjatlar**: Faqat talaba ruxsat bergan hujjatlarni ko'rish
- **Maxfiylik**: Pasport va manzil ma'lumotlari ko'rinmaydi (RLS himoyasi)

### Admin uchun
- **Foydalanuvchilar**: O'qituvchi va talabalarni yaratish/o'chirish
- **Guruhlar va fakultetlar**: Struktura boshqaruvi
- **Barcha hujjatlar**: Tizimdagi barcha hujjatlarni ko'rish

---

## рџ›  Texnologiyalar

| Qatlam | Texnologiya |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui (Base UI) |
| Backend | Supabase (Auth, Postgres, RLS, Realtime) |
| State | TanStack Query, React Hook Form + Zod |
| PDF | pdfmake (vektor PDF generatsiya) |
| Animatsiya | Motion (Framer Motion) |

---

## рџ“¦ O'rnatish

### 1. Talablar
- Node.js 18+ 
- npm yoki pnpm
- Supabase hisob (bepul)

### 2. Repository'ni klonlash
```bash
git clone https://github.com/yourusername/varaq.git
cd varaq
npm install
