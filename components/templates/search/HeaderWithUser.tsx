import Header from "@/components/modules/Header/Header";
import { authUser } from "@/utils/serverHelpers";
import React from "react";

const HeaderWithUser = async () => {
   const user = await authUser();

   // console.log('🐬 User -> ', user)

   return <Header isLoggedIn={Boolean(user)} user={user} />;
};

export default HeaderWithUser;
