import express from "express";
import db from "../db/index.js";

class teacherController {
    async createTeacher(req, res) {
        try {
            const { full_name, special } = req.body;
            if (!full_name || !special) {
                return res.status(400).json({
                    message: "Inputlarni to'liq to'ldiringda endi!"
                });

            };
            const result = await db.query(
                `INSERT INTO teachers (full_name,special) VALUES ($1,$2) RETURNING *`,
                [full_name, special]
            );
            res.status(201).json({
                message: "O'qituvchi muvaffaqiyatli qo‘shildi",
                teacher: result.rows[0]
            });

        } catch (error) {
            return res.status(500).json({
                message: `Serverda xatolik yuz berdi!: ${error}`
            });
        };
    };
    async getAllteachers(req, res) {
        try {
            const teacher = await db.query(`SELECT * FROM TEACHERS;`)
            return res.status(200).json({
                message: "O'qituvchilar ",
                teachers: teacher.rows
            })
        } catch (error) {
            return res.status(500).json({
                message: `Serverda xatolik yuz berdi!: ${error}`
            })
        };
    };
    async getTeacherById(req, res) {
        try {
            const teacher = await db.query('SELECT * FROM TEACHERS WHERE id=$1', [req.params.id]);
            if (!teacher.rows[0]) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Teacher topilmadi iltimos boshqa id bilan urinib kuring.'
                });
            };
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: teacher.rows
            })
        } catch (error) {
            return res.status(500).json({
                message: `Serverda xatolik yuz berdi!: ${error}`
            });
        };
    };
    async updateTeacherById(req, res) {
        try {
            const { id } = req.params
            const { full_name, special } = req.body

            if (!full_name || !special) {
                return res.status(400).json({
                    message: "Iltimos, barcha maydonlarni to'ldiring;"
                })
            }

            const teacherCheck = await db.query(
                `SELECT * FROM teachers WHERE id = $1`,
                [id]
            )

            if (teacherCheck.rows.length === 0) {
                return res.status(404).json({
                    message: "Bunday ID bilan o‘qituvchi topilmadi"
                })
            }

            const result = await db.query(
                `UPDATE teachers SET full_name = $1, special = $2 WHERE id = $3 RETURNING *`,
                [full_name, special, id]
            )

            return res.status(200).json({
                message: "O'qituvchi muvaffaqiyatli yangilandi",
                teacher: result.rows[0]
            })

        } catch (error) {
            return res.status(500).json({
                message: `Serverda xatolik yuz berdi!: ${error}`
            })
        }
    };
    async deleteTeacherById(req, res) {
        try {
            const { id } = req.params

            const teacherCheck = await db.query(
            `SELECT * FROM teachers WHERE id = $1`,
            [id]
            )

            if (teacherCheck.rows.length === 0) {
            return res.status(404).json({
                message: "Bunday ID bilan o‘qituvchi topilmadi"
            })
            }

            await db.query(
            `DELETE FROM teachers WHERE id = $1`,
            [id]
            )

            return res.status(200).json({
            message: "O'qituvchi muvaffaqiyatli o‘chirildi"
            })

        } catch (error) {
            return res.status(500).json({
            message: `Serverda xatolik yuz berdi!: ${error}`
            })
        }
        }


};



export default teacherController;