import db from "../db/index.js"

class studentsController {
  async createStudent(req, res) {
    try {
      const { username, group_id } = req.body
      if (!username || !group_id) {
        return res.status(400).json({
          message: "username va group_id kerak"
        })
      }

      const group = await db.query(`SELECT * FROM groups WHERE id = $1`, [group_id])

      if (group.rows.length === 0) {
        return res.status(404).json({
          message: "Group topilmadi"
        });
      };

      const result = await db.query(
        `INSERT INTO students (username, group_id) VALUES ($1, $2) RETURNING *`,
        [username, group_id]
      );

      return res.status(201).json({
        message: "Student qo‘shildi",
        student: result.rows[0]
      });
      
    } catch (error) {
      return res.status(500).json({
        message: `Server xatosi: ${error}`
      })
    }
  }

  async getAllStudents(req, res) {
    try {
      const result = await db.query(`
        SELECT s.id, s.username, g.name AS group_name
        FROM students s
        LEFT JOIN groups g ON s.group_id = g.id
        ORDER BY s.id
      `)

      return res.status(200).json({
        message: "Barcha studentlar",
        students: result.rows
      })

    } catch (error) {
      return res.status(500).json({
        message: `Server xatosi: ${error}`
      })
    }
  }

  async getStudentById(req, res) {
    try {
      const { id } = req.params

      const result = await db.query(`
        SELECT s.id, s.username, g.name AS group_name
        FROM students s
        LEFT JOIN groups g ON s.group_id = g.id
        WHERE s.id = $1
      `, [id])

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Student topilmadi"
        })
      }

      return res.status(200).json({
        message: "Student topildi",
        student: result.rows[0]
      })

    } catch (error) {
      return res.status(500).json({
        message: `Server xatosi: ${error}`
      })
    }
  }

  async updateStudentById(req, res) {
    try {
      const { id } = req.params
      const { username, group_id } = req.body

      if (!username || !group_id) {
        return res.status(400).json({
          message: "Yangi username va group_id kerak"
        })
      }

      const check = await db.query(`SELECT * FROM students WHERE id = $1`, [id])
      if (check.rows.length === 0) {
        return res.status(404).json({
          message: "Student topilmadi"
        })
      }

      const result = await db.query(
        `UPDATE students SET username = $1, group_id = $2 WHERE id = $3 RETURNING *`,
        [username, group_id, id]
      )

      return res.status(200).json({
        message: "Student yangilandi",
        student: result.rows[0]
      })

    } catch (error) {
      return res.status(500).json({
        message: `Server xatosi: ${error}`
      })
    }
  }

  async deleteStudentById(req, res) {
    try {
      const { id } = req.params

      const check = await db.query(`SELECT * FROM students WHERE id = $1`, [id])
      if (check.rows.length === 0) {
        return res.status(404).json({
          message: "Student topilmadi"
        })
      }

      await db.query(`DELETE FROM students WHERE id = $1`, [id])

      return res.status(200).json({
        message: "Student o‘chirildi"
      })

    } catch (error) {
      return res.status(500).json({
        message: `Server xatosi: ${error}`
      })
    }
  }
}

export default  studentsController;
