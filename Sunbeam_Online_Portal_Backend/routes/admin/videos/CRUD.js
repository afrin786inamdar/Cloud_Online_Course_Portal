const express = require(`express`)
const pool = require(`../../../db/pool`)
const result = require(`../../../utils/result`)

const router  = express.Router();

router.get("/:course_id",(req,res) => {
  const { course_id } = req.params;
    const sql = `select * from videos where course_id=?`;
    pool.query(sql,[course_id],(error,data) =>{
        res.send(result.createResult(error,data))
    })
})

router.post("/",(req,res)=>{
    //Destructuring
    const {course_id,title,description,youtube_url,added_at} = req.body;
    const sql = `insert into videos(course_id,title,description,youtube_url) values(?,?,?,?)`
        pool.query(sql,[course_id,title,description,youtube_url],(error,data) =>{
        res.send(result.createResult(error,data))
    })
})

router.put('/:video_id', (req, res) => {
  const { video_id } = req.params;
  const { course_id, title, description, youtube_url } = req.body;

  const fields = [];
  const values = [];

  if (course_id) {
    fields.push('course_id=?');
    values.push(course_id);
  }
  if (title) {
    fields.push('title=?');
    values.push(title);
  }
  if (description) {
    fields.push('description=?');
    values.push(description);
  }
  if (youtube_url) {
    fields.push('youtube_url=?');
    values.push(youtube_url);
  }

  if (fields.length === 0) {
    return res.send(result.createResult('No fields provided for update', null));
  }

  const sql = `UPDATE videos SET ${fields.join(', ')} WHERE video_id=?`;
  values.push(video_id);

  pool.query(sql, values, (error, data) => {
    res.send(result.createResult(error, data));
  });
});

router.delete("/:video_id", (req, res) => {
    const { video_id } = req.params;

    const sql = `delete from videos where video_id = ?`;

    pool.query(sql,[video_id], (error, data) => {
        res.send(result.createResult(error, data))
    })
})

module.exports = router;