import { useRef, useState } from "react";
import { PageHeader } from "antd";
import { useNavigate } from "react-router-dom";
import { EditFilled, PlusOutlined, AlertFilled } from "@ant-design/icons";

import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import ProTable from "../../components/ProTable";
import ActionTable from "../../components/ActionTable";
import ColumnDateTable from "../../components/ColumnDateTable";
import RouterBreadcrumb from "../../components/RouterBreadcrumb";
import ModalError from "../../components/Modal/components/ModalError";
import UploadBox from "../../components/UploadBox";

//TODO 
//mudar para o servico student
import { AdministratorService } from "../../services";

import styles from "./styles.module.css";

const routes = [
  {
    active: false,
    path: "/alunos",
    breadcrumbName: "ALunos",
  },
  {
    active: true,
    path: "/listagem",
    breadcrumbName: "Listagem",
  }
];

const StudentList = () => {
  const tableRef = useRef();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [modalError, setModalError] = useState(false);
  const [messageError, setMessageError] = useState({});

  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalUpload, setOpenModalUpload] = useState(false);
  // const options = [{
  //   value: 'ativo',
  //   label: 'Ativo'
  // },
  // {
  //   value: 'inativo',
  //   label: 'Inativo'
  // },
  // {
  //   value: 'inativo em breve',
  //   label: 'Inativo em breve'
  // }]

  // const iconStatusColor = [{
  //   ativo: "iconAlertStatusAtivo",
  //   InativoEmBreve: "iconAlertStatusInativoEmBreve",
  //   Inativo: "iconAlertStatusInativo"
  // }]

  const iconStatus = [
    {
      //vai sair quando o servivo estiver funcionando
      name: "Ativo",
      // func: handleAlertStatusChange,
      icon: <AlertFilled className="iconAlertStatusAtivo" />
    }
  ];

  // const handleCloseModalError = () => setModalError(false);
  // const handleAlertStatusChange = (record) => navigate(`/alunos/edicao/${record.id}`, { state: { record } });
  // const [status, setStatus] = useState(false)

  const getData = async ({ current, pageSize, name }) => {
    const query = {
      direction: "ASC",
      page: current - 1,
      orderBy: "createdAt",
      linesPerPage: pageSize,
    };

    if (name) query.name = name;

    try {
      //todo
      //mudar para StudentService
      //todo //mudar para StudentService
      const { data } = await AdministratorService.listPerPage(query);

      return {
        success: true,
        data: data.content,
        total: data.totalElements,
      };
    } catch (e) {
      setMessageError({
        type: "listar alunos",
        text: "Erro inesperado. Tente novamente mais tarde!"
      });
      setModalError(true);
    }
  }
  // const handleEdit = (record) => navigate(`/administradores/edicao/${record.id}`, { state: { record } });

  const handleCloseModalError = () => setModalError(false);
  const handleCloseModalEdit = () => setOpenModalEdit(false);
  const handleCloseModalUpload = () => setOpenModalUpload(false);
  
  const actionsTable = [
    {
      name: "Editar",
      func:  setOpenModalEdit,
      icon: <EditFilled className="iconUpdate" />,
    }
  ];

  const columns = [
    {
      title: "Nome",
      key: "name",
      width: "auto",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Data de Expiração",
      dataIndex: "createdAt",
      width: "200px",
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => <ColumnDateTable date={record?.createdAt} formatDate="DD/MM/YYYY" adapt />
    },
    {
      title: "Status",
      width: "200px",
      render: () => <ActionTable actions={iconStatus} />
    },
    {
      title: "Ações",
      valueType: "option",
      width: "180px",
      render: ({ props }) => <ActionTable actions={actionsTable} record={props.record} />,
    }
  ];

  return (
    <div>
      <Loader loading={loading} />

      <PageHeader
        title="Listagem de Alunos"
        breadcrumbRender={() => <RouterBreadcrumb routes={routes} />}
      />

      <div className={styles.containerTable}>
        <ProTable
          rowKey="id"
          columns={columns}
          textButton="Importar Alunos"
          stylesButton="buttonPrimary"
          iconButton={<PlusOutlined />}
          actionButton={setOpenModalUpload}
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

          <p>Messagem de erro:</p>
          <p className="modalMessageAlert">{messageError?.text}</p>
        </div>
      </ModalError>

      <Modal
        visible={openModalUpload}
        onCloseModal={handleCloseModalUpload}
      >
        <div className="">
          <UploadBox />
        </div>
      </Modal>

      <Modal
        visible={openModalEdit}
        onCloseModal={handleCloseModalEdit}
      >
        <div className="">
         
        </div>
      </Modal>

    </div>
  );
}

export default StudentList;
