import { useState } from "react";

export function useAddComment() {
  const [comment, setComment] = useState("");
  const [commentEmpty, setCommentEmpty] = useState(false);

  function handleAddComment({ target }) {
    setCommentEmpty(false);
    setComment(target?.value);
  }

  function handleCommentEmpty(value) {
    setCommentEmpty(value);
  }

  function cleanComments() {
    setComment("");
    setCommentEmpty(false);
  }

  return {
    comment,
    commentEmpty,
    handleAddComment,
    handleCommentEmpty,
    cleanComments,
  };
}