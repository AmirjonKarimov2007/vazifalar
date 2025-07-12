import express from "express";
import db from "../db/index.js";




class groupController{
    async createGroup(req,res){
        try {
             const { name } = req.body;
            if (!name) {
                return res.status(400).json({
                    message: "Inputlarni to'liq to'ldiringda endi!"
                });

            };
            const result = await db.query(
                `INSERT INTO groups (name) VALUES ($1) RETURNING *`,
                [name]
            );
            res.status(201).json({
                message: "Guruh muvaffaqiyatli qo‘shildi",
                groups: result.rows[0]
            });
        } catch (error) {
            return res.status(500).json({
                message:`Serverda xatolik yuz berdi: ${error}`
            });
        };
    };
    async getAllGroups(req, res) {
        try {
            const groupsWithStudents = await db.query(`
            SELECT 
                g.id as group_id,
                g.name as group_name,
                s.id as student_id,
                s.username
            FROM groups g
            LEFT JOIN students s ON g.id = s.group_id
            ORDER BY g.id
            `)

            const map = {}

            for (const row of groupsWithStudents.rows) {
            if (!map[row.group_id]) {
                map[row.group_id] = {
                id: row.group_id,
                name: row.group_name,
                students: []
                }
            }
            if (row.student_id) {
                map[row.group_id].students.push({
                id: row.student_id,
                username: row.username
                })
            }
            }

            const groups = Object.values(map)

            return res.status(200).json({
            message: "Guruhlar va ularning o‘quvchilari",
            groups
            })
        } catch (error) {
            return res.status(500).json({
            message: `Serverda xatolik yuz berdi: ${error}`
            })
        }
        }

    async getGroupById(req, res) {
        try {
            const { id } = req.params

            const result = await db.query(`
            SELECT 
                g.id as group_id,
                g.name as group_name,
                s.id as student_id,
                s.username
            FROM groups g
            LEFT JOIN students s ON g.id = s.group_id
            WHERE g.id = $1
            `, [id])

            if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Guruh topilmadi"
            })
            }

            const groupData = {
            id: result.rows[0].group_id,
            name: result.rows[0].group_name,
            students: result.rows
                .filter(row => row.student_id)
                .map(row => ({
                id: row.student_id,
                username: row.username
                }))
            }

            return res.status(200).json({
            message: "Guruh topildi",
            group: groupData
            })

        } catch (error) {
            return res.status(500).json({
            message: `Server xatosi: ${error}`
            })
        }
        }

    async updateGroupById(req, res) {
        try {
            const { id } = req.params
            const { name } = req.body

            if (!name) {
            return res.status(400).json({
                message: "Group nomi kerak"
            })
            }

            const check = await db.query(
            `SELECT * FROM groups WHERE id = $1`,
            [id]
            )

            if (check.rows.length === 0) {
            return res.status(404).json({
                message: "Bunday group topilmadi"
            })
            }

            const result = await db.query(
            `UPDATE groups SET name = $1 WHERE id = $2 RETURNING *`,
            [name, id]
            )

            return res.status(200).json({
            message: "Group yangilandi",
            data: result.rows[0]
            })

        } catch (error) {
            return res.status(500).json({
            message: `Server xatosi: ${error}`
            })
        }
    }
    async deleteGroupById(req, res) {
        try {
            const { id } = req.params

            const check = await db.query(
            `SELECT * FROM groups WHERE id = $1`,
            [id]
            )

            if (check.rows.length === 0) {
            return res.status(404).json({
                message: "Group topilmadi"
            })
            }

            await db.query(
            `DELETE FROM groups WHERE id = $1`,
            [id]
            )

            return res.status(200).json({
            message: "Group o‘chirildi"
            })

        } catch (error) {
            return res.status(500).json({
            message: `Server xatosi: ${error}`
            })
        }
        }


}

export default groupController;