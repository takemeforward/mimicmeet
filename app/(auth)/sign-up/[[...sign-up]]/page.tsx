import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <main className="flex-center w-full min-h-[120vh]">
      <SignUp />
    </main>
  );
};

export default SignUpPage;
