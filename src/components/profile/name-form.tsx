"use client";

import { useState } from "react";
import { ActionForm } from "@/components/admin/action-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateFullName } from "@/app/actions/profile";

export function NameForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);

  return (
    <ActionForm
      action={updateFullName}
      successMessage="Profil yangilandi"
      className="space-y-4"
      showSubmit
      submitLabel="Saqlash"
    >
      <div className="space-y-1.5">
        <Label className="text-[13px]" htmlFor="full_name">To'liq ism</Label>
        <Input
          id="full_name"
          name="full_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
    </ActionForm>
  );
}
