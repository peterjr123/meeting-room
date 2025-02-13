import { auth } from "@clerk/nextjs/server";
import Reservation from "./reservation";

export default async function dashboard() {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    return (
        <div className="h-full">
            <Reservation></Reservation>
        </div>
    );
}