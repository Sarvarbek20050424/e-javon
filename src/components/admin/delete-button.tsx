"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteTeacher } from "@/app/actions/admin";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`"${name}" o'qituvchini o'chirasizmi?`)) return;
    startTransition(async () => {
      const res = await deleteTeacher(id);
      if (res?.error) toast.error(res.error);
      else toast.success("O'qituvchi o'chirildi");
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={handleDelete}
      className="text-red hover:bg-red/10 hover:text-red"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}