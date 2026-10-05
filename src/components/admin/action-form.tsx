"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function ActionForm({
  action,
  children,
  className,
  submitLabel = "Saqlash",
  successMessage = "Muvaffaqiyatli saqlandi",
  resetOnSuccess = true,
  showSubmit = false,
}: {
  action: (formData: FormData) => Promise<any>;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
  successMessage?: string;
  resetOnSuccess?: boolean;
  showSubmit?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const formEl = e.currentTarget;
    startTransition(async () => {
      try {
        const res = await action(fd);
        if (res?.error) toast.error(res.error);
        else {
          toast.success(successMessage);
          if (resetOnSuccess) formEl.reset();
        }
      } catch (err: any) {
        toast.error(err?.message ?? "Noma'lum xato");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      {showSubmit && (
        <Button type="submit" disabled={isPending} className="mt-4 w-full gap-2">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      )}
    </form>
  );
}