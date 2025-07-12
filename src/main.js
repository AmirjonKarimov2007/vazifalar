import express from "express";
import { config } from "dotenv";
import e from "express";
import teacherRouer from "./routes/teacher.route.js"
import groupRouer from "./routes/group.route.js"
import groupTeachersRoutes from "./routes/group-teacher.js"
import studentRoutes from "./routes/student.route.js"
config();
const PORT = +process.env.PORT
const app = express();

app.use(express.json());
app.use('/teacher',teacherRouer)
app.use('/group',groupRouer)
app.use("/group-teachers", groupTeachersRoutes)
app.use("/students", studentRoutes)

app.listen(PORT,()=>console.log(`Server is running on port: ${PORT}`))
