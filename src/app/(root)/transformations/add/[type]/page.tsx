import Header from "@/components/shared/Header";
import React from "react";
import { transformationTypes } from "@/constants";
import TransformationForm from "@/components/shared/TransformationForm";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const AddTransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const { userId } = auth();
  const transformation = transformationTypes[type];

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  if (!user) redirect("/sign-in");

  // Type guard: ensure user is an object with _id property (not an array)
  const userObj = Array.isArray(user) ? user[0] : user;
  if (!userObj || !userObj._id) redirect("/sign-in");

  // Convert _id to string safely
  const userIdString = typeof userObj._id === 'string' 
    ? userObj._id 
    : String(userObj._id);

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={userIdString}
          type={transformation.type as TransformationTypeKey}
          creditBalance={userObj.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
