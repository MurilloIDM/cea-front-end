import { useState } from "react";
import { SendOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Input, Divider, Pagination, Popover, Tag } from 'antd';

import Modal from "../../../../components/Modal";
import Replies from "../Replies"
import Button from "../../../../components/Button";

import styles from "./styles.module.css";

const { TextArea } = Input;

const ModalRepliesView = ({
  title,
  visible,
  onCloseModal,
  data,
  onFileReply,
  onSendReply,
  onChangePage,
  commentData,
  isActive
}) => {

  const buttons = [
    {
      text: "Fechar",
      styles: "buttonDefault",
      handleClick: () => onCloseModal("replies")
    },
  ]

  const [replyText, setReplyText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [popover, setPopover] = useState(false);


  return (

    <Modal
      title={title}
      buttons={buttons}
      visible={visible}
      onCloseModal={onCloseModal}
      width={"80vw"}
      bodyStyle={{ minHeight: 154, maxHeight: "calc(90vh - 154px)", paddingBottom: 0 }}
    >
      <Replies
        data={data?.content}
        onFileReply={onFileReply}
      />

      <div className={styles.paginationContainer}>
        <Pagination
          total={data?.totalElements}
          showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} itens`}
          defaultPageSize={data?.size}
          defaultCurrent={1}
          current={currentPage}
          onChange={(page) => { onChangePage(page); setCurrentPage(page) }}
          hideOnSinglePage={true}
        />
      </div>
      <div className={styles.inputContainer}>
        <Divider className={styles.dividerReplies} />
        {!isActive ?
          <Tag icon={<ExclamationCircleOutlined />} color="warning" style={{ marginBottom: 8 }}>
            Para responder comentários é necessário que o conteúdo esteja com status "Online"
          </Tag>
          :
          <div className={styles.form}>
            <TextArea
              maxLength={255}
              autoSize={{ minRows: 1, maxRows: 3 }}
              placeholder="Digite sua resposta aqui!"
              onChange={(e) => setReplyText(e.target.value)}
              value={replyText}
              showCount
              allowClear
              autoFocus
              status={"error"}
            />
            <Popover
              content={<span style={{ color: "white" }}>O campo de texto não pode ficar vazio!</span>}
              color={"black"}
              trigger="hover"
              visible={popover}
              onVisibleChange={() => setPopover(false)}
            >
              <Button
                type="text"
                stylesButton={`buttonBackground ${styles.sendButton}`}
                handleClick={() => {
                  if (!replyText) {
                    setPopover(true)
                  }
                  else {
                    onSendReply(commentData.id, replyText);
                    setReplyText("");
                    setCurrentPage(1)
                  }
                }}
              >
                <SendOutlined
                  className={styles.iconSend}
                />
              </Button>
            </Popover>
          </div>
        }
      </div>
    </Modal>
  )
}
export default ModalRepliesView;