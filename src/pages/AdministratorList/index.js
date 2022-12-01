import { useRef, useState } from "react";
import { PageHeader } from "antd";
import { useNavigate } from "react-router-dom";
import { EditFilled, DeleteFilled, PlusOutlined, WarningOutlined, LockFilled } from "@ant-design/icons";

import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import ProTable from "../../components/ProTable";
import ActionTable from "../../components/ActionTable";
import ColumnDateTable from "../../components/ColumnDateTable";
import RouterBreadcrumb from "../../components/RouterBreadcrumb";
import ModalError from "../../components/Modal/components/ModalError";
import ModalSuccess from "../../components/Modal/components/ModalSuccess";

import { AdministratorService } from "../../services";

import styles from "./styles.module.css";

const routes = [
  {
    active: false,
    path: "/administradores",
    breadcrumbName: "Administradores",
  },
  {
    active: true,
    path: "/listagem",
    breadcrumbName: "Listagem",
  }
];

const AdministratorList = () => {
  const tableRef = useRef();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dataCurrent, setDataCurrent] = useState({});
  const [modalError, setModalError] = useState(false);
  const [messageError, setMessageError] = useState({});
  const [currentDelete, setCurrentDelete] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [modalErrorPassword, setModalErrorPassword] = useState(false);

  const getData = async ({ current, pageSize, name }) => {
    const query = {
      direction: "DESC",
      page: current - 1,
      orderBy: "createdAt",
      linesPerPage: pageSize,
    };

    if (name) query.name = name;

    try {
      const { data } = await AdministratorService.listPerPage(query);

      return {
        success: true,
        data: data.content,
        total: data.totalElements,
      };
    } catch (e) {
      setMessageError({
        type: "listar administradores",
        text: "Erro inesperado. Tente novamente mais tarde!"
      });
      setModalError(true);
    }
  }

  const navigateAdministratorRegister = () => navigate("/administradores/cadastro");

  const passwordRecovery = async (username) => {
    setLoading(true);

    const payload = { username };

    try {
      const { data } = await AdministratorService.generatePassword(payload);

      setDataCurrent({ username: data?.username, password: data?.password });
      setModalSuccess(true);
    } catch (e) {
      setModalErrorPassword(true);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (record) => navigate(`/administradores/edicao/${record.id}`, { state: { record } });

  const handleCloseModalError = () => setModalError(false);
  const handleCloseModalDelete = () => setOpenModalDelete(false);

  const handleDelete = async () => {
    const id = currentDelete || "";
    try {
      setLoading(true);
      await AdministratorService.delete(id);

      tableRef.current.reload();
    } catch (e) {
      setMessageError({
        type: "deletar administrador",
        text: "Erro inesperado. Tente novamente mais tarde!"
      });
      setModalError(true);
    } finally {
      setLoading(false);
      setOpenModalDelete(false);
    }
  }

  const handleCloseModalSuccess = () => {
    setDataCurrent({});
    setModalSuccess(false);
  }

  const handleCloseModalErrorPassword = () => {
    setDataCurrent({});
    setModalErrorPassword(false);
  }

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
      name: "Recuperar senha",
      func: (record) => passwordRecovery(record?.username),
      icon: <LockFilled />
    },
    {
      name: "Editar",
      func: handleEdit,
      icon: <EditFilled className="iconUpdate" />,
    },
    {
      name: "Deletar",
      func: (record) => {
        setCurrentDelete(record.id);
        setOpenModalDelete(true);
      },
      icon: <DeleteFilled className="iconDelete" />,
    }
  ];

  const columns = [
    {
      title: "Nome de Acesso",
      dataIndex: "username",
      width: "200px",
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: "Nome Completo",
      key: "name",
      width: "auto",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Data de Criação",
      dataIndex: "createdAt",
      width: "160px",
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => <ColumnDateTable date={record?.createdAt} formatDate="DD/MM/YYYY" adapt />
    },
    {
      title: "Ações",
      valueType: "option",
      width: "380px",
      render: ({ props }) => <ActionTable actions={actionsTable} record={props.record} />,
    }
  ];

  return (
    <div>
      <Loader loading={loading} />

      <PageHeader
        title="Listagem de Administradores"
        breadcrumbRender={() => <RouterBreadcrumb routes={routes} />}
      />

      <div className={styles.containerTable}>
        <ProTable
          rowKey="id"
          columns={columns}
          textButton="Cadastrar Novo"
          stylesButton="buttonPrimary"
          iconButton={<PlusOutlined />}
          actionButton={navigateAdministratorRegister}
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
          <p>Falha ao {messageError?.type}!</p>

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

      <ModalSuccess
        visible={modalSuccess}
        buttons={[{
          text: "Fechar",
          styles: "buttonDefault",
          handleClick: handleCloseModalSuccess,
        }]}
        onCloseModal={handleCloseModalSuccess}
      >
        <div className="modalMessage">
          <p>A senha temporária do administrator {dataCurrent?.username} é:</p>
          <p className="modalMessageAlert">{dataCurrent?.password}</p>

        </div>
      </ModalSuccess>

      <ModalError
        visible={modalErrorPassword}
        buttons={[{
          text: "Fechar",
          styles: "buttonDefault",
          handleClick: handleCloseModalErrorPassword,
        }]}
        onCloseModal={handleCloseModalErrorPassword}
      >
        <div className="modalMessage">
          <p>Não foi possível gerar a senha temporária.</p>

          <p>Por favor, tente novamente mais tarde!</p>
        </div>
      </ModalError>
    </div>
  );
}

export default AdministratorList;
