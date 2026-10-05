"use client";

import { useState } from "react";
import { ActionForm } from "@/components/admin/action-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateStudentProfile } from "@/app/actions/profile";

const selectCls =
  "flex h-9 w-full rounded-[8px] border border-line bg-panel px-3 text-[14px] text-ink focus:outline-none focus:ring-1 focus:ring-teal";

export function StudentForm({ initial }: { initial: any }) {
  const [vals, setVals] = useState({
    student_no: initial?.student_no ?? "",
    course: String(initial?.course ?? 2),
    birth_date: initial?.birth_date ?? "",
    passport: initial?.passport ?? "",
    phone: initial?.phone ?? "",
    address: initial?.address ?? "",
  });

  const set = (key: string) => (e: any) =>
    setVals((v) => ({ ...v, [key]: e.target.value }));

  return (
    <ActionForm
      action={updateStudentProfile}
      successMessage="Profil saqlandi"
      className="grid gap-4 sm:grid-cols-2"
      showSubmit
      submitLabel="Saqlash"
    >
      <div className="space-y-1.5">
        <Label className="text-[13px]">Talaba ID</Label>
        <Input name="student_no" value={vals.student_no} onChange={set("student_no")} required />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[13px]">Kurs</Label>
        <select name="course" value={vals.course} onChange={set("course")} className={selectCls}>
          {[1, 2, 3, 4, 5, 6].map((c) => (
            <option key={c} value={String(c)}>{c}-kurs</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[13px]">Tug'ilgan sana</Label>
        <Input name="birth_date" type="date" value={vals.birth_date} onChange={set("birth_date")} required />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[13px]">Pasport</Label>
        <Input name="passport" value={vals.passport} onChange={set("passport")} required />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[13px]">Telefon</Label>
        <Input name="phone" value={vals.phone} onChange={set("phone")} required />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[13px]">Manzil</Label>
        <Input name="address" value={vals.address} onChange={set("address")} required />
      </div>
    </ActionForm>
  );
}
