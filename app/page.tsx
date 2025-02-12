import { auth } from "@clerk/nextjs/server";
import Nav from "./nav";
export default async function Home() {
  const { userId, redirectToSignIn } = await auth();
  if(!userId) return redirectToSignIn();

  return (
    <div>
      <h1>Meeting Room</h1>
    </div>
  );
}
