import { useState, useEffect } from "react";
import { Badge, PageHeader, Pagination, Popover } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { ExclamationCircleOutlined, SendOutlined } from "@ant-design/icons";

import useStore from "../../hooks/useStore";
import RouterBreadcrumb from "../../components/RouterBreadcrumb";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import ModalError from "../../components/Modal/components/ModalError";

import Comments from "./components/Comments"
import ModalRepliesView from "./components/ModalRepliesView";

import { CommentsService } from "../../services";

import styles from "./styles.module.css";
import TextArea from "antd/lib/input/TextArea";
import { useAddComment } from "../../hooks/useAddComment";

const ExclusivePostComments = () => {

  const navigate = useNavigate();
  const { state } = useLocation();
  const { id: postId, title, status } = state;
  const postStatus = status === "active" ? true : false;

  const [commentsData, setCommentsData] = useState();
  const [modalReplies, setModalReplies] = useState(false);
  const [repliesData, setRepliesData] = useState();
  const [commentSelected, setCommentSelected] = useState();
  const [isLoading, setIsLoading] = useState("");
  const [modalConfirmFile, setModalConfirmFile] = useState(false);
  const [dataToFile, setDataToFile] = useState();
  const [currentPageComments, setCurrentPageComments] = useState(1);
  const [modalError, setModalError] = useState(false);
  const [messageError, setMessageError] = useState("");

  const {
    comment,
    commentEmpty,
    cleanComments,
    handleAddComment,
    handleCommentEmpty
  } = useAddComment();

  const { getDataLocalStorage } = useStore();
  const userId = getDataLocalStorage("user")?.userId;

  const getCommentsData = async () => {
    const query = {
      page: currentPageComments - 1
    }

    const { data } = await CommentsService.listCommentsPerPage(query, postId)

    return data;
  }

  const updateComments = async () => {
    setIsLoading("comments")
    try {
      const data = await getCommentsData();
      setCommentsData(data);
    } catch (e) {
      setMessageError({
        type: "carregar os comentários",
        text: "Erro inesperado. Tente novamente mais tarde!"
      })
      setModalError(true);
    } finally {
      setIsLoading("");
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    updateComments();
  }, [currentPageComments])

  const handleChangePageReplies = async (page) => {
    setIsLoading(true)
    try {
      const data = await getRepliesData({ currentPage: page });
      setRepliesData(data);
    }
    catch (e) {
      setMessageError({
        type: "carregar as respostas de comentários",
        text: "Erro inesperado. Tente novamente mais tarde!"
      })
      setModalError(true)
    }
    finally {
      setIsLoading(false)
    }
  }

  const getRepliesData = async ({ currentPage = 1, commentId = commentSelected.id }) => {
    const query = {
      page: currentPage - 1
    }

    const { data } = await CommentsService.listRepliesPerPage(query, commentId)

    return data;
  }

  const handleOpenModalReplies = async (commentClicked = commentSelected) => {
    setCommentSelected(commentClicked);
    setIsLoading(true)
    try {
      const data = await getRepliesData({ commentId: commentClicked.id });
      setRepliesData(data);
      setModalReplies(true)
    }
    catch (e) {
      setMessageError({
        type: "carregar as respostas de comentários",
        text: "Erro inesperado. Tente novamente mais tarde!"
      })
      setModalError(true)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleSendReply = async (commentId, replyText) => {
    setIsLoading(true)

    const payload = {
      commentId,
      text: replyText,
      userId
    }

    try {
      await CommentsService.createReply(payload)
    } catch (e) {
      setMessageError({
        type: "responder comentário",
        text: "Erro inesperado. Tente novamente mais tarde!"
      })
      setModalError(true)
    } finally {
      await handleOpenModalReplies();
      setIsLoading(false)
    }
  }

  const handleOpenModalFileConfirm = (type, id) => {
    setDataToFile({ type, id })
    setModalConfirmFile(true)
  }

  const handleFile = async () => {
    setIsLoading(true)
    const { type, id } = dataToFile;
    const payload = { userId }
    type === "comment" ? payload.commentId = id : payload.commentReplyId = id;

    try {
      type === "comment" ?
        await CommentsService.inativeComment(payload) :
        await CommentsService.inativeReply(payload);
    } catch (e) {
      setMessageError({
        type: `arquivar ${type === "comment" ? "comentário" : "resposta de comentário"}`,
        text: "Erro inesperado. Tente novamente mais tarde!"
      })
      setModalError(true)
    } finally {
      type === "comment" ?
        updateComments() :
        handleOpenModalReplies();
      setModalConfirmFile(false)
      setIsLoading(false)
    }
  }

  const addComment = async () => {
    if (!comment) {
      handleCommentEmpty(true);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        text: comment,
        studentId: userId,
        exclusivePostId: postId,
      };

      await CommentsService.addComment(payload);
      await updateComments();
    } catch (e) {
      setMessageError({
        type: "fechar",
        text: "Erro inesparado ao adicionar comentário. Tente novamente mais tarde!"
      });
      setModalError(true);
    } finally {
      cleanComments();
      setIsLoading(false);
    }
  }

  const handleCloseModal = async () => {
    setModalReplies(false)
    updateComments();
  }

  const handleCloseModalError = () => {
    if (messageError.type === "carregar os comentários")
      navigate("../conteudo-exclusivo/listagem")
    else if (messageError.type === "carregar as respostas de comentários") {
      setModalError(false)
      setModalReplies(false)
    } else
      setModalError(false)
  }

  const buttonsModalFileConfirm = [
    {
      text: "Fechar",
      styles: "buttonDefault",
      handleClick: () => setModalConfirmFile(false),
    },
    {
      text: "Arquivar",
      styles: "buttonBackground buttonMarginLeft",
      handleClick: handleFile,
    }
  ];

  const routes = [
    {
      active: false,
      path: "/conteudo-exclusivo",
      breadcrumbName: "Conteúdo Exclusivo"
    },
    {
      active: true,
      path: "../../listagem",
      breadcrumbName: "Listagem"
    },
    {
      active: true,
      path: "/comentarios",
      breadcrumbName: "Comentários"
    }
  ];

  return (
    <div className="container">
      <Loader loading={isLoading} />
      <PageHeader
        title={"Comentários do Conteúdo Exclusivo"}
        breadcrumbRender={() => <RouterBreadcrumb routes={routes} />}
      />
      <div className={styles.containerComments}>
        <div className={styles.postTitle}>
          <div className={styles.statusIndicator}>
            <Badge
              status="processing"
              color={postStatus ? "green" : "red"}
              text={postStatus ? "online" : "offline"}
            />
          </div>
          <div className={styles.mainTitle}>
            <h1>
              Título do conteúdo: <span style={{ fontWeight: 700 }}>{title}</span>
            </h1>

            <Button
              type="text"
              children={"Voltar"}
              stylesButton="buttonBackground buttonMarginLeft"
              handleClick={() => navigate("../conteudo-exclusivo/listagem")}
            />
          </div>
        </div>

        <div className={styles.containerAddComment}>
          <TextArea
            maxLength={255}
            autoSize={{ minRows: 1, maxRows: 3 }}
            placeholder="Faça um comentário aqui"
            onChange={handleAddComment}
            value={comment}
            showCount
            allowClear
            autoFocus
            status={"error"}
          />

          <Popover
            content={<span style={{ color: "white" }}>O campo de comentário não pode ficar vazio!</span>}
            color={"black"}
            trigger="hover"
            visible={commentEmpty}
            onVisibleChange={() => handleCommentEmpty(false)}
          >
            <Button
              type="text"
              stylesButton={`buttonBackground ${styles.sendButton}`}
              handleClick={addComment}
            >
              <SendOutlined
                className={styles.iconSend}
              />
            </Button>
          </Popover>
        </div>

        {isLoading !== "comments" && (commentsData?.totalElements === 0 ?
          <>
            <EmptyState description="Ops... conteúdo ainda sem comentários" />
            <Button
              type="text"
              children={"Voltar à listagem"}
              stylesButton={`buttonDefault ${styles.buttonBack}`}
              handleClick={() => navigate("../conteudo-exclusivo/listagem")}
            />
          </>
          :
          <>
            <Comments
              data={commentsData?.content}
              handleOpenModalReplies={handleOpenModalReplies}
              handleFileComment={handleOpenModalFileConfirm}
              isActive={postStatus}
            />

            <div className={styles.paginationContainer}>
              <Pagination
                total={commentsData?.totalElements}
                showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} itens`}
                defaultPageSize={commentsData?.size}
                defaultCurrent={1}
                current={currentPageComments}
                onChange={(page) => setCurrentPageComments(page)}
                hideOnSinglePage={true}
              />
            </div>
          </>
        )}
      </div>

      <ModalRepliesView
        title={<p>Respostas do comentário de <span style={{ fontWeight: 700 }}>{commentSelected?.authorName}</span></p>}
        commentData={commentSelected}
        data={repliesData}
        visible={modalReplies}
        onFileReply={handleOpenModalFileConfirm}
        onSendReply={handleSendReply}
        onCloseModal={handleCloseModal}
        onChangePage={handleChangePageReplies}
        isActive={postStatus}
      />

      <Modal
        visible={modalConfirmFile}
        buttons={buttonsModalFileConfirm}
        onCloseModal={() => setModalConfirmFile(false)}
      >
        <div className="messageModalDelete">
          <ExclamationCircleOutlined />

          <p><b>Atenção!</b></p>
          <p>Tem certeza que deseja arquivar {dataToFile?.type === "comment" ? "este comentário?" : "esta resposta de comentário?"}</p>
        </div>
      </Modal>

      <ModalError
        visible={modalError}
        buttons={[{
          text: `${messageError.type === "carregar os comentários" ? "Voltar para a listagem" : "Fechar"}`,
          styles: "buttonDefault",
          handleClick: handleCloseModalError
        }]}
        onCloseModal={handleCloseModalError}
      >
        <div className="messageModalDelete">
          <p>Falha ao {messageError?.type}</p>

          <p>Mensagem de erro:</p>
          <p className="modalMessageAlert">{messageError?.text}</p>
        </div>
      </ModalError>
    </div >
  );
}
export default ExclusivePostComments;
