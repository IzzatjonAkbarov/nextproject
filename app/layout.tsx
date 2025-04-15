"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useCallback } from "react";
import Image from "next/image";

// Components
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Fonts
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/provider/reduxProvider"; // Assuming this was in the original
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Form Schema
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      storage: "",
      color: "",
      installment: 0,
      price: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let base64Image = "";
      if (values.img) {
        base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result?.toString() || "");
          reader.onerror = reject;
          reader.readAsDataURL(values.img!);
        });
      }

      const productData = {
        name: values.name,
        storage: values.storage,
        color: values.color,
        installment: values.installment,
        price: values.price,
        img: base64Image,
      };
      await fetch("https://67908d83af8442fd7376b1e4.mockapi.io/fooddashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      form.reset();
      window.location.reload();
      setPreviewImage(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const onImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        form.setValue("img", file);
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    [form]
  );
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          {" "}
          {/* Assuming ReduxProvider was part of the original setup */}
          <div className="flex items-start gap-10">
            <aside className="h-screen inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
              <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link
                  className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                  href="https://vercel.com/templates/next.js/admin-dashboard-tailwind-postgres-react-nextjs">
                  <Image
                    alt="logo"
                    height={100}
                    width={100}
                    src={"/favicon.ico"}
                  />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  data-state="closed"
                  href="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-house h-5 w-5">
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                </Link>

                <Link
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  data-state="closed"
                  href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shopping-cart h-5 w-5">
                    <circle cx={8} cy={21} r={1} />
                    <circle cx={19} cy={21} r={1} />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  <span className="sr-only">Orders</span>
                </Link>
                <Link
                  className="flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8 bg-accent text-black" // Adjusted class assuming it was like this
                  data-state="closed"
                  href="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-package h-5 w-5">
                    <path d="m7.5 4.27 9 5.15" />
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                  <span className="sr-only">Products</span>
                </Link>
                <Link
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  data-state="closed"
                  href="/customers">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-users-round h-5 w-5">
                    <path d="M18 21a8 8 0 0 0-16 0" />
                    <circle cx={10} cy={8} r={5} />
                    <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                  </svg>
                  <span className="sr-only">Customers</span>
                </Link>
                <Link
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  data-state="closed"
                  href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-line-chart h-5 w-5">
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  <span className="sr-only">Analytics</span>
                </Link>
              </nav>
              <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  data-state="closed"
                  href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-settings h-5 w-5">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx={12} cy={12} r={3} />
                  </svg>
                  <span className="sr-only">Settings</span>
                </Link>
              </nav>
            </aside>
            <div className="w-full">
              <header className="sticky py-5 top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 sm:hidden"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-controls="radix-:r6:" // Note: radix IDs might differ on render
                  data-state="closed">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-panel-left h-5 w-5">
                    <rect width={18} height={18} x={3} y={3} rx={2} />
                    <path d="M9 3v18" />
                  </svg>
                  <span className="sr-only">Toggle Menu</span>
                </button>
                <nav aria-label="breadcrumb" className="hidden md:flex">
                  <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
                    <li className="inline-flex items-center gap-1.5">
                      <Link
                        className="transition-colors hover:text-foreground"
                        href="#">
                        Dashboard
                      </Link>
                    </li>
                    <li
                      role="presentation"
                      aria-hidden="true"
                      className="[&>svg]:size-3.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <Link
                        className="transition-colors hover:text-foreground"
                        href="#">
                        Products
                      </Link>
                    </li>
                    <li
                      role="presentation"
                      aria-hidden="true"
                      className="[&>svg]:size-3.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <span
                        role="link"
                        aria-disabled="true"
                        aria-current="page"
                        className="font-normal text-foreground">
                        All Products
                      </span>
                    </li>
                  </ol>
                </nav>
                <form
                  // Note: This action attribute might cause issues if not intended
                  action="javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
                  className="relative ml-auto flex-1 md:grow-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-search absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground">
                    <circle cx={11} cy={11} r={8} />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    className="flex h-10 border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    placeholder="Search..."
                    type="search"
                    name="q"
                  />
                </form>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 overflow-hidden rounded-full"
                  type="button"
                  id="radix-:r9:" // Note: radix IDs might differ on render
                  aria-haspopup="menu"
                  aria-expanded="false"
                  data-state="closed">
                  <img
                    alt="Avatar"
                    loading="lazy"
                    width={36}
                    height={36}
                    decoding="async"
                    data-nimg={1}
                    className="overflow-hidden rounded-full"
                    srcSet="/placeholder-user.webp" // Ensure these image paths are correct
                    src="/placeholder-user.webp"
                    style={{ color: "transparent" }}
                  />
                </button>
              </header>
              <div className="flex items-center w-[97%] m-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  {/* Using default TabsList styles from shadcn/ui */}
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="archived" className="hidden sm:flex">
                      Archived
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="ml-auto flex items-center gap-2">
                  {/* Using default Button styles from shadcn/ui */}
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <FileIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Export
                    </span>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="h-8 gap-1">
                        <PlusCircleIcon className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Add Product
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Create New Product</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="storage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Storage</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="installment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Installment Price</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
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
                                <FormLabel>Full Price</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                              <div className="flex flex-col gap-2">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={onImageChange}
                                />
                                {previewImage && (
                                  <div className="mt-2">
                                    <Image
                                      src={previewImage}
                                      alt="Preview"
                                      width={100}
                                      height={100}
                                      className="rounded-md"
                                    />
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                          {/*
                            This DialogTrigger wrapping the button might cause the dialog
                            to close before the async onSubmit finishes in some scenarios.
                            Consider controlling dialog open state manually if issues arise.
                          */}

                          <Button type="submit" className="w-full">
                            Add Product
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {children}
            </div>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}

// Icon components (as originally provided)
function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function PlusCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}
