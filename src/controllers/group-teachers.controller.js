import db from "../db/index.js"

class groupTeachersController {
  async createGroupTeacher(req, res) {
    try {
      const { group_id, teacher_id } = req.body

      if (!group_id || !teacher_id) {
        return res.status(400).json({
          message: "group_id va teacher_id kerak"
        })
      }

      const group = await db.query(`SELECT * FROM groups WHERE id = $1`, [group_id])
      const teacher = await db.query(`SELECT * FROM teachers WHERE id = $1`, [teacher_id])

      if (group.rows.length === 0 || teacher.rows.length === 0) {
        return res.status(404).json({
          message: "Group yoki teacher topilmadi"
        })
      }

      const result = await db.query(
        `INSERT INTO  groups_teacher (group_id, teacher_id) VALUES ($1, $2) RETURNING *`,
        [group_id, teacher_id]
      )

      return res.status(201).json({
        message: "Bog'lanish qo‘shildi",
        data: result.rows[0]
      })

    } catch (error) {
      return res.status(500).json({
        message: `Xatolik: ${error}`
      })
    }
  }

  async getAllGroupTeachers(req, res) {
    try {
      const result = await db.query(`
        SELECT gt.id, g.name as group_name, t.full_name as teacher_name
        FROM  groups_teacher gt
        JOIN groups g ON gt.group_id = g.id
        JOIN teachers t ON gt.teacher_id = t.id
        ORDER BY gt.id
      `)

      return res.status(200).json({
        message: "Barcha group-teacher bog‘lanishlar",
        data: result.rows
      })

    } catch (error) {
      return res.status(500).json({
        message: `Xatolik: ${error}`
      })
    }
  }

  async updateGroupTeacher(req, res) {
    try {
      const { id } = req.params
      const { group_id, teacher_id } = req.body

      if (!group_id || !teacher_id) {
        return res.status(400).json({
          message: "Yangi group_id va teacher_id kerak"
        })
      }

      const check = await db.query(
        `SELECT * FROM  groups_teacher WHERE id = $1`,
        [id]
      )

      if (check.rows.length === 0) {
        return res.status(404).json({
          message: "Bog‘lanish topilmadi"
        })
      }

      const result = await db.query(
        `UPDATE  groups_teacher SET group_id = $1, teacher_id = $2 WHERE id = $3 RETURNING *`,
        [group_id, teacher_id, id]
      )

      return res.status(200).json({
        message: "Bog'lanish yangilandi",
        data: result.rows[0]
      })

    } catch (error) {
      return res.status(500).json({
        message: `Xatolik: ${error}`
      })
    }
  }

  async deleteGroupTeacher(req, res) {
    try {
      const { id } = req.params

      const check = await db.query(
        `SELECT * FROM  groups_teacher WHERE id = $1`,
        [id]
      )

      if (check.rows.length === 0) {
        return res.status(404).json({
          message: "Bog‘lanish topilmadi"
        })
      }

      await db.query(
        `DELETE FROM  groups_teacher WHERE id = $1`,    
        [id]
      )

      return res.status(200).json({
        message: "Bog'lanish o‘chirildi"
      })

    } catch (error) {
      return res.status(500).json({
        message: `Xatolik: ${error}`
      })
    }
  }
}

export default new groupTeachersController()
