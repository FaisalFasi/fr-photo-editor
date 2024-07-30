import React from "react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div>
      <SignUp forceRedirectUrl="/" />
    </div>
  );
};

export default SignUpPage;
