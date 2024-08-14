"use client";

import { Button } from "@/ui/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/shadcn/dialog";
import { Input } from "@/ui/shadcn/input";
import { Textarea } from "@/ui/shadcn/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/shadcn/form";
import {
  createProduct,
  updateProduct,
} from "@/app/(store)/manage/catalog/action";
import { formProduct } from "@/lib/validations";
import { Loader, PlusCircle } from "lucide-react";
import { useState } from "react";
import { ProductSummary } from "@/types/product";
import { AddVariant } from "@/ui/common/add-variant";

interface Props {
  id?: number;
  product?: ProductSummary;
  update?: boolean;
}

export function CreateProduct({
  id,
  product,
  update = false,
}: Props): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formProduct>>({
    resolver: zodResolver(formProduct),
    defaultValues: product,
  });

  const handleOpen = (): void => {
    form.reset();
    setOpen(true);
  };

  async function onSubmit(values: z.infer<typeof formProduct>): Promise<void> {
    if (update) {
      if (id) {
        await updateProduct(id, values);
      }
    } else {
      await createProduct(values);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          onClick={handleOpen}
          variant={update ? "ghost" : "default"}
          className="w-full"
        >
          {update ? (
            "Edit"
          ) : (
            <>
              <PlusCircle size={16} className="mr-1" /> Add Product
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-30px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {update ? "Edit product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input placeholder="product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="product description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AddVariant />

            <div className="flex items-center gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button>
                {form.formState.isSubmitting && (
                  <Loader size={14} className="mr-1 animate-spin" />
                )}
                {update ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
