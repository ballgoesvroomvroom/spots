import { stackMiddlewares } from "@/middlewares/stackHandler";
import { loggedIn } from "@/middlewares/authMiddleware";
import { NextMiddleware } from "next/server";

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

const middlewares = [loggedIn];
export default stackMiddlewares(middlewares)