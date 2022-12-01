import { Divider } from "antd";

import Button from "../../../../components/Button";

import moment from "moment";

import styles from "./styles.module.css";
const Comments = ({
  data,
  handleOpenModalReplies,
  handleFileComment,
  isActive
}) => {


  return (
    <>
      {data?.map((comment) => {

        const createdAt = moment(comment?.createdAt).format("DD/MM/YYYY [ às ] HH:mm");
        const totalReplies = comment.totalCommentsReply;

        return (

          <div key={comment?.id}>
            <span className={styles.studentName}>{comment.authorName}</span>
            <span> {comment.text} </span>
            <div className={styles.containerButton}>

              {(isActive || totalReplies > 0) && <Button
                stylesButton={styles.buttonFooter}
                handleClick={() => handleOpenModalReplies(comment)}
              >{totalReplies > 0 ? `Ver Respostas (${totalReplies})` : "Responder"}
              </Button>}


              <Button
                stylesButton={styles.buttonFooter}
                handleClick={() => handleFileComment("comment", comment.id)}
              >
                Arquivar
              </Button>

              <span className={styles.createdAtText}>Publicado em {createdAt}</span>

            </div>
            <Divider className={styles.divider} />
          </div>
        );
      })}
    </>
  )
};

export default Comments;