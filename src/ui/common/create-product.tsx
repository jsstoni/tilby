"use client";

import { Button } from "@/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/shadcn/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/ui/shadcn/form";
import {
  createProduct,
  uploadImage,
} from "@/app/(auth)/dashboard/catalog/action";
import { formProduct } from "@/lib/validations";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useAlert } from "@/lib/hooks";
import { FormProduct } from "@/ui/form/form-product";

export function CreateProduct(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formProduct>>({
    resolver: zodResolver(formProduct),
  });

  const { notice, warning } = useAlert();

  const handleOpen = (): void => {
    form.reset();
    setOpen(true);
  };

  const { executeAsync, status } = useAction(createProduct, {
    onSuccess: () => {
      notice("successfully created product");
      setOpen(false);
    },
    onError: () => {
      warning("There was an error creating the product");
    },
  });

  const onSubmit = async (value: z.infer<typeof formProduct>) => {
    let imageUrl: string | undefined;

    if (value.imageUrl instanceof File) {
      const formData = new FormData();
      formData.append("image", value.imageUrl);
      imageUrl = await uploadImage(formData);
    } else if (typeof value.imageUrl === "string") {
      imageUrl = value.imageUrl;
    }

    const dataToSend = { ...value, imageUrl };

    if (imageUrl === undefined) {
      delete dataToSend.imageUrl;
    }

    await executeAsync(dataToSend);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={handleOpen} className="w-full">
          <PlusCircle size={16} className="mr-1" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-30px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <FormProduct
            action={form.handleSubmit(onSubmit)}
            control={form.control}
            status={status}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
}
