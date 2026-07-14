import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import listingsRouter from "./listings";
import chatsRouter from "./chats";
import adminRouter from "./admin";
import officesRouter from "./offices";
import storageRouter from "./storage";
import notificationsRouter from "./notifications";
import favoritesRouter from "./favorites";
import savedSearchesRouter from "./saved-searches";
import reportsRouter from "./reports";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/listings", listingsRouter);
router.use("/chats", chatsRouter);
router.use("/admin", adminRouter);
router.use("/offices", officesRouter);
router.use("/storage", storageRouter);
router.use("/notifications", notificationsRouter);
router.use("/favorites", favoritesRouter);
router.use("/saved-searches", savedSearchesRouter);
router.use("/reports", reportsRouter);

export default router;
