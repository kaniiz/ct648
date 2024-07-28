import FormSubmitButton from "@/components/FormSubmitButton";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: "Add Product Flowmazon",
};

async function addProduct(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);

  if (!name || !description || !imageUrl || !price) {
    throw Error("Missing required fields");
  }

  await prisma.product.create({
    data: { name, description, imageUrl, price },
  });

  redirect("/");
}

export default async function AddProductPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Add Product</h1>
      <form action={addProduct}>
        <input
          type="text"
          required
          name="name"
          className="input input-bordered mb-3 w-full"
          placeholder="Name"
        />
        <textarea
          name="description"
          placeholder="Description"
          id=""
          className="textarea textarea-bordered mb-3 w-full"
          required
        />
        <input
          type="url"
          required
          name="imageUrl"
          className="input input-bordered mb-3 w-full"
          placeholder="Image URL"
        />
        <input
          type="number"
          required
          name="price"
          className="input input-bordered mb-3 w-full"
          placeholder="Price"
        />
        <FormSubmitButton type="submit" className="btn-block">
          Add Product
        </FormSubmitButton>
      </form>
    </div>
  );
}
