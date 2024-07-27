import { navLinks } from "@/constants";
import { UserButton } from "@clerk/nextjs";
import mongoose from "mongoose";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Collection } from "@/components/shared/Collection";
import { getAllImages } from "@/lib/actions/image.actions";

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";
  const images = await getAllImages({ page, searchQuery });

  return (
    <div>
      <section className="home">
        <h1 className="home-heading">Transform Your Photos with AI Magic </h1>
        <ul className="flex-center w-full gap-20">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col w-full gap-2 "
            >
              <li className="flex-center w-fit rounded-full bg-white p-4">
                {
                  <Image
                    src={link.icon}
                    alt={link.label}
                    width={24}
                    height={24}
                    className="cursor-pointer"
                  />
                }
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      <section className=" sm:mt-12">
        <Collection
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </div>
  );
};

export default Home;
