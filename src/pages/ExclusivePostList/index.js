import { useState, useRef } from "react";
import { PageHeader } from "antd";
import {
  EditOutlined,
  DeleteFilled,
  PlusOutlined,
  WarningOutlined,
  InfoCircleFilled
} from "@ant-design/icons";

import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import ProTable from "../../components/ProTable";
import ActionTable from "../../components/ActionTable";
import ColumnDateTable from "../../components/ColumnDateTable";
import RouterBreadcrumb from "../../components/RouterBreadcrumb";
import ModalError from "../../components/Modal/components/ModalError";

import { ExclusivePostService } from "../../services";

import { useNavigate } from "react-router-dom";

import styles from "./styles.module.css";
import ModalProgress from "../../components/Modal/components/ModalProgress";

const routes = [
  {
    active: false,
    path: "/conteudo-exclusivo",
    breadcrumbName: "Conteúdo Exclusivo",
  },
  {
    active: true,
    path: "/listagem",
    breadcrumbName: "Listagem",
  }
];

const ExclusivePostList = () => {
  const tableRef = useRef();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [messageError, setMessageError] = useState({});
  const [currentDelete, setCurrentDelete] = useState("");
  const [modalProgress, setModalProgress] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [dataSurveySelected, setDataSurveySelected] = useState([]);
  const [titleSurveySelected, setTitleSurveySelected] = useState("");
  const [modalProgressError, setModalProgressError] = useState(false);

  const getData = async ({ current, pageSize, title, status, type }) => {
    const query = {
      direction: "DESC",
      page: current - 1,
      orderBy: "createdAt",
      linesPerPage: pageSize
    };

    if (type) query.type = type;
    if (title) query.title = title;
    if (status) query.status = status;

    try {
      const { data } = await ExclusivePostService.listPerPage(query);
      const { content, totalElements } = data;

      const exclusivePosts = content.map((exclusivePost) => {
        exclusivePost.status = exclusivePost.status ? "active" : "inative";
        return exclusivePost;
      });

      return {
        success: true,
        data: exclusivePosts,
        total: totalElements,
      };
    } catch (e) {
      setMessageError({
        type: "listar conteúdo exclusivo",
        text: "Erro inesperado. Tente novamente mais tarde!"
      });
      setModalError(true);
    }
  }

  const getPollTopics = async (id, title) => {
    setLoading(true);

    try {
      const { data: {
        pollTopics,
        totalVotes
      } } = await ExclusivePostService.findPollTopics(id);

      setTitleSurveySelected(`${title} (${totalVotes})`);
      setDataSurveySelected(pollTopics);
    } catch (e) {
      setModalProgressError(true);
    } finally {
      setLoading(false);
      setModalProgress(true);
    }
  }

  const handleCloseModalError = () => setModalError(false);
  const handleCloseModalDelete = () => setOpenModalDelete(false);

  const handleDelete = async () => {
    const id = currentDelete || "";

    setLoading(true);
    try {
      await ExclusivePostService.inative(id);

      tableRef.current.reload();
    } catch (e) {
      setMessageError({
        type: "deletar conteúdo exclusivo",
        text: "Erro inesperado. Tente novamente mais tarde!",
      });
      setModalError(true);
    } finally {
      setLoading(false);
      setOpenModalDelete(false);
    }
  }

  const handleEdit = (record) => {
    navigate(`/conteudo-exclusivo/edicao/${record.id}`, { state: { record } });
  }

  const handleDetailsSurvey = async (id, title) => {
    await getPollTopics(id, title);
  }

  const handleDetailsContent = async (id, title, status) => {
    navigate(`/conteudo-exclusivo/comentarios`, { state: { id, title, status } });
  }

  const handleCloseModalProgress = () => {
    setTitleSurveySelected("");
    setDataSurveySelected([]);
    setModalProgressError(false);
    setModalProgress(false);
  }

  const navigateExclusivePostCreator = () => navigate("/conteudo-exclusivo/cadastro");

  const buttonsModalDelete = [
    {
      text: "Fechar",
      styles: "buttonDefault",
      handleClick: handleCloseModalDelete,
    },
    {
      text: "Deletar",
      styles: "buttonBackground buttonMarginLeft",
      handleClick: handleDelete,
    }
  ];

  const actionsTable = [
    {
      name: "Detalhes",
      func: async ({ id, title, status, type }) => {
        const operationExec = type === "TEXT" ? handleDetailsContent : handleDetailsSurvey;
        await operationExec(id, title, status);
      },
      icon: <InfoCircleFilled />
    },
    {
      name: "Editar",
      func: handleEdit,
      icon: <EditOutlined className="iconUpdate" />,
    },
    {
      name: "Deletar",
      func: (record) => {
        setCurrentDelete(record.id);
        setOpenModalDelete(true);
      },
      icon: <DeleteFilled className="iconDelete" />
    },
  ];

  const columns = [
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      ellipsis: true,
      valueType: "select",
      valueEnum: {
        text: {
          text: "Conteúdo",
        },
        survey: {
          text: "Enquete",
        },
      },
      width: "120px",
      render: (_, { type }) => type === "SURVEY" ? "Enquete" : "Conteúdo",
    },
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
      ellipsis: true
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ellipsis: true,
      valueType: "select",
      valueEnum: {
        all: {
          text: "Todos",
          status: "Default",
        },
        active: {
          text: "Online",
          status: "Success",
        },
        inative: {
          text: "Offline",
          status: "Error"
        }
      },
      width: "200px",
    },
    {
      title: "Data de Criação",
      dataIndex: "createdAt",
      hideInSearch: true,
      ellipsis: true,
      width: "200px",
      render: (_, record) => <ColumnDateTable date={record?.createdAt} formatDate="DD/MM/YYYY" adapt />
    },
    {
      title: "Ações",
      valueType: "option",
      width: "330px",
      render: ({ props }) => <ActionTable actions={actionsTable} record={props.record} />,
    }
  ];


  return (
    <div>
      <Loader loading={loading} />

      <PageHeader
        title="Listagem de Conteúdos Exclusivos"
        breadcrumbRender={() => <RouterBreadcrumb routes={routes} />}
      />

      <div className={styles.containerTable}>
        <ProTable
          rowKey="id"
          columns={columns}
          textButton="Cadastrar Novo"
          stylesButton="buttonPrimary"
          iconButton={<PlusOutlined />}
          actionButton={navigateExclusivePostCreator}
          request={getData}
          actionRef={tableRef}
        />
      </div>

      <ModalError
        visible={modalError}
        buttons={[{
          text: "Fechar",
          styles: "buttonDefault",
          handleClick: handleCloseModalError,
        }]}
        onCloseModal={handleCloseModalError}
      >
        <div className="messageModalDelete">
          <p>Falha ao {messageError?.type}</p>

          <p>Mensagem de erro:</p>
          <p className="modalMessageAlert">{messageError?.text}</p>
        </div>
      </ModalError>

      <Modal
        visible={openModalDelete}
        buttons={buttonsModalDelete}
        onCloseModal={handleCloseModalDelete}
      >
        <div className="messageModalDelete">
          <WarningOutlined />

          <p><b>Atenção!</b></p>
          <p>Ao deletar o registro atual não é possível recuperá-lo!</p>
        </div>
      </Modal>

      <ModalProgress
        visible={modalProgress}
        data={dataSurveySelected}
        error={modalProgressError}
        title={titleSurveySelected}
        buttons={[{
          text: "Fechar",
          styles: "buttonDefault",
          handleClick: handleCloseModalProgress,
        }]}
        onCloseModal={handleCloseModalProgress}
      />
    </div>
  );
}

export default ExclusivePostList;
