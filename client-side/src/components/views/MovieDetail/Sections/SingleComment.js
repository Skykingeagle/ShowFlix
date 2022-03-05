import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import LikeDislikes from "./LikeDislike";
import { commentNum } from "./ReplyComment";

const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [CommentValue, setCommentValue] = useState("");
  const [OpenReply, setOpenReply] = useState(false);

  const handleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const openReply = () => {
    setOpenReply(!OpenReply);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
      content: CommentValue,
      replyComment: commentNum,
    };
    console.log(variables.replyComment);

    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        // setCommentValue("");
        setOpenReply(!OpenReply);
        props.refreshFunction(response.data.result);
      } else {
        alert("Failed to save Comment");
      }
    });
  };

  const onDelete = async (e) => {
    const variables = {
      writer: user.userData._id,
      postId: props.postId,
      commentId: props.comment._id,
      content: CommentValue,
      replyComment: commentNum,
    };
    console.log(variables);
    const checkwriter = props.comment.writer._id;
    console.log(checkwriter);

    if (variables.replyComment === 0) {
      if (checkwriter === variables.writer) {
        // Axios.delete(`/api/comment/deleteComment/${props.comment._id}`, variables).then((response) => {
        //   props.refreshFunction(response.data.result);
        // });

        const repo = await fetch(`/api/comment/deleteComment/${props.comment._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        console.log(repo);

        Axios.post("/api/comment/getComments", props.movieVariable).then((response) => {
          console.log(response);
          if (response.data.success) {
            console.log("response.data.comments", response.data.comments);
            props.setCommentLists(response.data.comments);
          } else {
            alert("Failed to get comments Info");
          }
        });
      } else {
        alert("Invalid User: failed to delete the comment.");
      }
    } else {
      alert("Nested Comment");
    }
  };

  const actions = [
    <LikeDislikes
      comment
      commentId={props.comment._id}
      userId={localStorage.getItem("userId")}
    />,
    <span onClick={openReply} key="comment-basic-reply-to">
      Reply to{" "}
    </span>,

    <div>
      <Button onClick={onDelete}>Delete</Button>
    </div>,

    <div>
      <Button>Edit</Button>
    </div>,
  ];

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="image" />}
        content={<p>{props.comment.content}</p>}
        replyComment={props.replyComment}
      ></Comment>

      <br />
      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <TextArea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={handleChange}
            value={CommentValue}
            placeholder="write some comments"
          />
          <br />
          <Button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
