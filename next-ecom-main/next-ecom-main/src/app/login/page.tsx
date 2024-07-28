import LogCom from "@/components/LogCom";
import PaginationBar from "@/components/PaginationBar";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default async function Login() {
  const products = await prisma.loginLog.findMany();
  return (
    <div>
      <div className="my-4 grid grid-cols-1">
        {products.map((product) => (
          <p key={product.id}>
            {"Account:"}
            {product.email} {"Time:"}
            {product.timestamp.toString()}
          </p>
        ))}
      </div>
      <a href="/" className="btn btn-square btn-primary w-full">
        HOME
      </a>
    </div>
  );
}
