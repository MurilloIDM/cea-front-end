import { useState } from "react";
import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";

import Modal from "../../../../components/Modal"
import Button from "../../../../components/Button";

import styles from "./styles.module.css";

const { TextArea } = Input

const ModalInputComment = ({
  title,
  visible,
  onCloseModal,
  handleSendComment
}) => {

  const [commentText, setCommentText] = useState("");

  const buttons = [
    {
      text: "Fechar",
      styles: "buttonDefault",
      handleClick: () => onCloseModal("comment")
    }
  ]

  return (
    <Modal
      title={title}
      visible={visible}
      width={"60vw"}
      buttons={buttons}
      children={<div className={styles.inputCommentContainer}>
        <TextArea
          maxLength={255}
          autoSize={{ minRows: 1, maxRows: 3 }}
          placeholder="Digite seu comentário aqui!"
          onChange={(e) => setCommentText(e.target.value)}
          allowClear
          showCount
          autoFocus
        />
        <Button
          type="text"
          stylesButton={`buttonBackground ${styles.sendButton}`}
          handleClick={() => handleSendComment(commentText)}
        >
          <SendOutlined
            className={styles.iconSend}
          />
        </Button>
      </div>}
      onCloseModal={onCloseModal}
    />
  )
}

export default ModalInputComment;