// src/app/talaba/profil/profile-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentProfileSchema } from "@/lib/validations";
import { updateStudentProfile } from "@/app/actions/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfileForm({ 
  initialData, 
  fullName, 
  groupName, 
  facultyName 
}: { 
  initialData: any; 
  fullName: string;
  groupName: string;
  facultyName: string;
}) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      student_no: initialData?.student_no || "",
      birth_date: initialData?.birth_date || "",
      passport: initialData?.passport || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
    }
  });

  async function onSubmit(data: any) {
    setLoading(true);
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    const result = await updateStudentProfile(formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Ma'lumotlar muvaffaqiyatli saqlandi!");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link href="/talaba">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          Profil ma'lumotlari
        </CardTitle>
        <CardDescription className="flex flex-wrap gap-2 text-sm mt-2">
          <span>Ism: <strong className="text-foreground">{fullName}</strong></span> | 
          <span>Guruh: <strong className="text-foreground">{groupName}</strong></span> | 
          <span>Fakultet: <strong className="text-foreground">{facultyName}</strong></span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student_no">Talaba ID</Label>
              <Input id="student_no" {...register("student_no")} placeholder="22120001" />
              {errors.student_no && <p className="text-sm text-destructive">{errors.student_no.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_date">Tug'ilgan sana</Label>
              <Input id="birth_date" type="date" {...register("birth_date")} />
              {errors.birth_date && <p className="text-sm text-destructive">{errors.birth_date.message as string}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passport">Pasport seriyasi va raqami</Label>
              <Input id="passport" {...register("passport")} placeholder="AA1234567" />
              {errors.passport && <p className="text-sm text-destructive">{errors.passport.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon raqami</Label>
              <Input id="phone" {...register("phone")} placeholder="+998901234567" />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message as string}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Doimiy yashash manzili</Label>
            <Input id="address" {...register("address")} placeholder="Toshkent sh., Chilonzor tumani..." />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message as string}</p>}
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={loading}>
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}