import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import FormSubmitButton from '@/components/FormSubmitButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export const metadata: Metadata = {
  title: 'Add product',
  description: 'We make your wallet cry',
}

export async function addProduct(formData: FormData){
  "use server";

  const session = await getServerSession(authOptions);

  if(!session){
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);

  if(!name || !description || !imageUrl || !price){
    throw new Error("Missing required fields");
  }
  
  await prisma.product.create({
    data: { name, description, imageUrl, price }
  });

  redirect("/");
}

export default async function AddProductPage() {
  const session = await getServerSession(authOptions);

  if(!session){
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  return (
    <div>
      <h1 className="text-lg mb-3 font-bold">Add Product</h1>
      <form action={addProduct}>
        <input type="text" className="mb-3 w-full input input-bordered" name="name" placeholder="Name" required />
        <textarea name="description" className="textarea textarea-bordered mb-3 w-full" placeholder="Description" id="" cols={30} rows={10} required></textarea>
        <input type="url" className="mb-3 w-full input input-bordered" name="imageUrl" placeholder="Image Url" required />
        <input type="number" className="mb-3 w-full input input-bordered" name="price" placeholder="Price" required />
        <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
      </form>
    </div>
  )
}
