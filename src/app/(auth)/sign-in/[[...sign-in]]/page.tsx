import React from "react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div>
      <SignIn forceRedirectUrl="/" />
    </div>
  );
};

export default SignInPage;
