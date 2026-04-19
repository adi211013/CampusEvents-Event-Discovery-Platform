"use client";

import React from "react";
import { useUser } from "@/components/UserProvider";

const Page = () => {
  const user = useUser();
  return (
    <div onClick={() => console.log(user)}>
      home page {user ? `witaj ${user.email}` : null}
    </div>
  );
};

export default Page;
