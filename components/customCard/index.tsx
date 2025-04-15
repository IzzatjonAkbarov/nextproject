import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteProduct, updateProduct } from "@/redux/productSlice";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  storage: z.string().min(1, { message: "Storage is required." }),
  color: z.string().min(1, { message: "Color is required." }),
  installment: z.coerce
    .number()
    .min(0, { message: "Installment must be positive." }),
  price: z.coerce.number().min(0, { message: "Price must be positive." }),
  img: z.instanceof(File).optional(),
});

interface ProductType {
  id: string;
  name: string;
  storage: string;
  color: string;
  installment: number;
  price: number;
  img: string;
}

export default function ProductCard({ product }: { product: ProductType }) {
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      storage: product.storage,
      color: product.color,
      installment: product.installment,
      price: product.price,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let base64Image = product.img; // Keep existing image if no new one is provided
      if (values.img) {
        base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result?.toString() || "");
          reader.onerror = reject;
          reader.readAsDataURL(values.img!);
        });
      }

      const updatedProduct = {
        ...values,
        img: base64Image,
        id: product.id,
      };

      dispatch(updateProduct(updatedProduct));
      try {
        await fetch(
          `https://67908d83af8442fd7376b1e4.mockapi.io/fooddashboard/${product.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
          }
        );
        dispatch(updateProduct(product));
      } catch (error) {
        console.error("Error updating product:", error);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async () => {
    dispatch(deleteProduct(product.id));
    try {
      await fetch(
        `https://67908d83af8442fd7376b1e4.mockapi.io/fooddashboard/${product.id}`,
        {
          method: "DELETE",
        }
      );
      dispatch(deleteProduct(product.id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="flex items-center justify-between border p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <div className="flex gap-4 items-center">
        <img
          src={product.img}
          alt={product.name}
          className="w-20 h-20 object-cover rounded"
        />
        <div>
          <h2 className="font-semibold text-lg">{product.name}</h2>
          <p className="text-sm text-muted-foreground">
            {product.storage} • {product.color}
          </p>
          <p className="text-green-600 font-medium">
            Narxi: {product.price.toLocaleString()} so&apos;m
          </p>
          <p className="text-blue-500 text-sm">
            Muddatli to&apos;lov: {product.installment.toLocaleString()}{" "}
            so&apos;m
          </p>
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2 space-y-1">
          <button
            onClick={() => {
              setIsDialogOpen(true);
            }}
            className="flex items-center w-full px-2 py-1.5 hover:bg-muted rounded text-sm gap-2">
            <Pencil className="w-4 h-4" /> Tahrirlash
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center w-full px-2 py-1.5 hover:bg-red-100 text-red-600 rounded text-sm gap-2">
            <Trash2 className="w-4 h-4" /> O&apos;chirish
          </button>
        </PopoverContent>
      </Popover>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mahsulotni tahrirlash</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nomi</Label>
              <Input id="name" {...form.register("name")} placeholder="Nomi" />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage">Xotira</Label>
              <Input
                id="storage"
                {...form.register("storage")}
                placeholder="Xotira"
              />
              {form.formState.errors.storage && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.storage.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Rangi</Label>
              <Input
                id="color"
                {...form.register("color")}
                placeholder="Rangi"
              />
              {form.formState.errors.color && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.color.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Narxi</Label>
              <Input
                id="price"
                {...form.register("price")}
                placeholder="Narxi"
                type="number"
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="installment">Muddatli to&apos;lov</Label>
              <Input
                id="installment"
                {...form.register("installment")}
                placeholder="Muddatli to'lov"
                type="number"
              />
              {form.formState.errors.installment && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.installment.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="img">Rasm</Label>
              <Input
                id="img"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    form.setValue("img", e.target.files[0]);
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}>
                Bekor qilish
              </Button>
              <Button type="submit">Saqlash</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
