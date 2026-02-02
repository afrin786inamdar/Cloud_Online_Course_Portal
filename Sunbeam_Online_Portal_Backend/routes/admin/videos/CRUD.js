const express = require('express')
const pool = require('../../../db/pool')
const result = require('../../../utils/result')
const { toEmbedUrl } = require('../../../utils/youtube');
const { authUser } = require('../../../utils/authjwt')
const { authorizeRole } = require('../../../utils/authorizeRole')
const { checkEnrollment } = require('../../../middleware/checkEnrollment')
const { toEmbedUrl } = require('../../../utils/youtube') // ✅ ADD THIS

const router = express.Router()

// helper
const query = (sql, params) =>
  new Promise((resolve, reject) => {
    pool.query(sql, params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })

/* =========================================
   PUBLIC → VIEW ALL COURSES WITH VIDEOS
========================================= */
/* =========================================
   PUBLIC → VIEW ALL COURSES WITH VIDEOS
========================================= */
router.get('/public/courses-with-videos', async (req, res) => {
  try {
    const rows = await query(`
      SELECT 
        c.course_id,
        c.course_name,
        c.description,
        c.fees,
        DATE_FORMAT(c.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(c.end_date, '%Y-%m-%d') AS end_date,
        c.video_expire_days,

        v.video_id,
        v.title,
        v.description AS video_description,
        v.youtube_url

      FROM courses c
      LEFT JOIN videos v ON c.course_id = v.course_id

      -- Active course logic WITHOUT is_active
      WHERE c.end_date >= CURDATE()

      ORDER BY c.course_id
    `);

    // Group courses with videos
    const coursesMap = {};

    rows.forEach((row) => {
      if (!coursesMap[row.course_id]) {
        coursesMap[row.course_id] = {
          course_id: row.course_id,
          course_name: row.course_name,
          description: row.description,
          fees: row.fees,
          start_date: row.start_date,
          end_date: row.end_date,
          video_expire_days: row.video_expire_days,
          video_expire_days: row.video_expire_days,
          videos: []
        };
      }

      if (row.video_id) {
        coursesMap[row.course_id].videos.push({
          video_id: row.video_id,
          title: row.title,
          description: row.video_description,
          youtube_url: row.youtube_url
        });
      }
    });

    res.send(result.createResult(null, Object.values(coursesMap)));
  } catch (error) {
    res.send(result.createResult(error));
  }
});

/*===============================
   STUDENT → VIEW VIDEOS (ENROLLED ONLY)
========================================= */
router.get(
  '/course/:courseId',
  authUser,
  authorizeRole('student'),
  checkEnrollment,
  async (req, res) => {
    const { courseId } = req.params;
    const { courseId } = req.params;

    try {
      const videos = await query(
        'SELECT * FROM videos WHERE course_id=?',
        [courseId]
      );

      // 🔥 CONVERT YOUTUBE URL ON READ
      const fixedVideos = videos.map(v => ({
        ...v,
        youtube_url: toEmbedUrl(v.youtube_url)
      }));

      res.send(result.createResult(null, fixedVideos));
    } catch (err) {
      res.send(result.createResult(err));
    }
  }
);
);

/* =========================================
   ADMIN → ADD VIDEO
========================================= */
router.post(
  '/',
  authUser,
  authorizeRole('admin'),
  (req, res) => {
    const { course_id, title, description, youtube_url } = req.body;

    if (!course_id || !title || !description || !youtube_url) {
      return res.send(result.createResult('All fields required'))
    }

    // ✅ convert share link → embed link
    const embedUrl = toEmbedUrl(youtube_url)

    const sql = `
      INSERT INTO videos (course_id, title, description, youtube_url)
      VALUES (?, ?, ?, ?)
    `

    pool.query(
      sql,
      [course_id, title, description, embedUrl],
      [course_id, title, description, embedUrl],
      (error, data) => {
        res.send(result.createResult(error, data));
      }
    );
  }
);

/* =========================================
   ADMIN → UPDATE VIDEO
========================================= */
router.put(
  '/:video_id',
  authUser,
  authorizeRole('admin'),
  (req, res) => {
    const { video_id } = req.params
    const { course_id, title, description, youtube_url } = req.body

    const fields = []
    const values = []

    if (course_id) {
      fields.push('course_id=?')
      values.push(course_id)
    }
    if (title) {
      fields.push('title=?')
      values.push(title)
    }
    if (description) {
      fields.push('description=?')
      values.push(description)
    }
    if (youtube_url) {
      fields.push('youtube_url=?')
      values.push(toEmbedUrl(youtube_url)) // ✅ convert again
    }

    if (fields.length === 0) {
      return res.send(result.createResult('No fields to update'))
    }

    const sql = `UPDATE videos SET ${fields.join(', ')} WHERE video_id=?`
    values.push(video_id)

    pool.query(sql, values, (error, data) => {
      res.send(result.createResult(error, data))
    })
  }
)

/* =========================================
   ADMIN → DELETE VIDEO
========================================= */
router.delete(
  '/:video_id',
  authUser,
  authorizeRole('admin'),
  (req, res) => {
    const { video_id } = req.params

    pool.query(
      'DELETE FROM videos WHERE video_id=?',
      [video_id],
      (error, data) => {
        res.send(result.createResult(error, data))
      }
    )
  }
)

module.exports = router
