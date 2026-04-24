"use client";

import React from "react";
import { useUser } from "@/components/UserProvider";
import RightSide from "@/components/RightSide";

const Page = () => {
  const user = useUser();
  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto">
        <p>test</p>
      </div>
      <RightSide />
    </div>
  );
};

export default Page;
