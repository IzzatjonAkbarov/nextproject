"use client";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";

import ProductCard from "@/components/customCard";

// Define your RootState type based on your store structure
interface RootState {
  product: {
    products: ProductType[];
    editingProduct: ProductType | null;
  };
}

interface ProductType {
  id: string;
  name: string;
  storage: string;
  color: string;
  installment: number;
  price: number;
  img: string;
}

export default function Home() {
  const dispatch = useDispatch();

  // Correct the selector to match your store structure
  const { products } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://67908d83af8442fd7376b1e4.mockapi.io/fooddashboard"
        );
        const data = await response.json();
        dispatch(setProducts(data));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mahsulotlar</h1>
      <div className="space-y-4 h-[600px] overflow-y-scroll">
        {products?.length > 0 ? (
          products.map((product: ProductType) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center text-gray-500">Mahsulotlar topilmadi</p>
        )}
      </div>
    </div>
  );
}
