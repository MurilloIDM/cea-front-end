import { Divider } from "antd";
import Button from "../../../../components/Button";
import styles from "./styles.module.css";
import moment from "moment";

const Replies = ({
  data,
  onFileReply
}) => {

  return (
    <>
      {data.map((reply) => {

        const createdAt = moment(reply?.createdAt).format("DD/MM/YYYY [ às ] HH:mm");

        return (
          <div key={reply?.id} className={styles.container}>
            <div>
              <span className={styles.studentName}>{reply.authorName}</span>
              <span> {reply.text}</span>
            </div>
            <div className={styles.footer}>
              <Button
                stylesButton={styles.buttonFile}
                handleClick={() => onFileReply("reply", reply.id)}
              >
                Arquivar
              </Button>
              <span className={styles.createdAtText}>Publicado em {createdAt}</span>
            </div>
            <Divider />
          </div>
        );
      })}
    </>
  )
};

export default Replies;