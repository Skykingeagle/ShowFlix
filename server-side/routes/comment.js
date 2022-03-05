const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");
const { auth } = require("../middleware/auth");
const censor = require("text-censor");

router.post("/saveComment", auth, (req, res) => {
  const filter = censor.filter(req.body.content, (err, censored) => censored)
  req.body.content = filter;
  const comment = new Comment(req.body);

  comment.save((err, comment) => {
    console.log(err);
    if (err) return res.json({ success: false, err });

    Comment.find({ _id: comment._id })
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, result });
      });
  });
  
});

router.post("/getComments", (req, res) => {
  Comment.find({ postId: req.body.movieId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

// To Update the comment
// router.put("/updateComment", async(req,res)=>{

// })

// To Delete the comment
router.delete("/deleteComment", async(req, res) => {
  console.log(req.body);
  const id = req.body.commentId;
  const repo = await Comment.findByIdDelete(id);
  res.status(200).json({success: true});
});
module.exports = router;
