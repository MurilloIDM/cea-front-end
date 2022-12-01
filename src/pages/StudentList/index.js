import { useRef, useState } from "react";
import { Input, PageHeader, DatePicker } from "antd";
import _orderBy from "lodash.orderby";
import { EditFilled, PlusOutlined, CalendarFilled } from "@ant-design/icons";

import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import ProTable from "../../components/ProTable";
import UploadBox from "../../components/UploadBox";
import ActionTable from "../../components/ActionTable";
import ColumnDateTable from "../../components/ColumnDateTable";
import RouterBreadcrumb from "../../components/RouterBreadcrumb";
import ModalError from "../../components/Modal/components/ModalError";
import ColumnStatusStudent from "../../components/ColumnStatusStudent";
import ContentModalErrorEdit from "./components/ContentModalErrorEdit";
import ModalSuccess from "../../components/Modal/components/ModalSuccess";
import ContentModalSuccessEdit from "./components/ContentModalSuccessEdit";
import ContentModalErrorImport from "./components/ContentModalErrorImport";
import ContentModalSuccessImport from "./components/ContentModalSuccessImport";

import { StudentService } from "../../services";

import moment from "moment";

import styles from "./styles.module.css";

const routes = [
  {
    active: false,
    path: "/alunos",
    breadcrumbName: "Alunos",
  },
  {
    active: true,
    path: "/listagem",
    breadcrumbName: "Listagem",
  }
];

const StudentList = () => {
  const tableRef = useRef();

  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState({});
  const [socialName, setSocialName] = useState("");
  const [errorEdit, setErrorEdit] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [modalError, setModalError] = useState(false);
  const [messageError, setMessageError] = useState({});
  const [importError, setImportError] = useState(false);
  const [successEdit, setSuccessEdit] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [expirationDate, setExpirationDate] = useState(null);
  const [openModalUpload, setOpenModalUpload] = useState(false);
  const [resultImportStudents, setResultImportStudents] = useState([]);
  const [openModalEditInactivation, setOpenModalEditInactivation] = useState(false);
  const [disabledUpdateExpirationDate, setDisabledUpdateExpirationDate] = useState(true);

  const getData = async ({ current, pageSize, name, status }) => {
    const query = {
      direction: "ASC",
      page: current - 1,
      linesPerPage: pageSize,
    };

    if (name) query.name = name;
    if (status) query.status = status;

    try {
      const { data } = await StudentService.listPerPage(query);
      const { content, totalElements } = data;

      const formatData = content && content?.map((record) => {
        const name = record?.socialName || record?.name;

        return {
          id: record?.id,
          name,
          email: record?.email,
          inactivationSoon: record?.inactivationSoon,
          expirationDate: record?.expirationDate,
          status: record?.status,
        };
      });

      const findName = student => student?.name.toLowerCase();
      const orderData = _orderBy(formatData, [findName],["asc"]);

      return {
        data: orderData,
        success: true,
        total: totalElements,
      };
    } catch (e) {
      setMessageError({
        type: "listar alunos",
        text: "Erro inesperado. Tente novamente mais tarde!"
      });
      setModalError(true);
    }
  }

  const submitFile = async ({ file }) => {
    setLoading(true);
    try {
      const { data } = await StudentService.importStudents(file);
      setImportSuccess(true);
      setResultImportStudents(data);
    } catch (e) {
      setImportError(true);
    } finally {
      setLoading(false);
      tableRef.current.reload();
    }
  }

  const editSocialName = async () => {
    if (!socialName || !studentId) return;

    const payload = { socialName };

    setLoading(true);
    try {
      await StudentService.updateName(payload, studentId);
      setSuccessEdit(true);
    } catch (e) {
      setErrorEdit(true);
    } finally {
      setLoading(false);
      tableRef.current.reload();
    }
  }

  const editInactivationDate = async () => {
    if (!expirationDate || !currentData?.id) return;

    const payload = { expirationDate };

    setLoading(true);
    try {
      await StudentService.updateDateInactivation(payload, currentData?.id);
    } catch (e) {
      setMessageError({
        type: "atualizar data de inativação",
        text: "Erro inesperado. Tente novamente mais tarde!"
      });
      setModalError(true);
    } finally {
      setLoading(false);
      setCurrentData({});
      setDisabledUpdateExpirationDate(true);
      setOpenModalEditInactivation(false);
      tableRef.current.reload();
    }
  }

  const handleCloseModalError = () => setModalError(false);
  const handleCloseModalUpload = () => setOpenModalUpload(false);

  const handleOpenModalEdit = (record) => {
    setStudentId(record?.id);
    setOpenModalEdit(true);
  }

  const handleOpenEditInactivation = (record) => {
    setCurrentData({ id: record?.id, email: record?.email, expirationDate: record?.expirationDate });
    setOpenModalEditInactivation(true);
  }

  const handleCloseEditInactivation = () => {
    setOpenModalEditInactivation(false);
    setCurrentData({});
    setExpirationDate(null);
    setDisabledUpdateExpirationDate(true);
  }

  const handleCloseModalEdit = () => {
    setStudentId("");
    setSocialName("");
    setOpenModalEdit(false);
  };

  const handleEditSocialName = ({ target }) => {
    const { value } = target;
    setSocialName(value);
  }

  const handleCloseModalErrorImport = () => {
    setImportError(false);
  }

  const handleCloseModalErrorEdit = () => {
    setStudentId("");
    setSocialName("");
    setOpenModalEdit(false);
    setErrorEdit(false);
  }

  const handleCloseModalSuccessImport = () => {
    setImportSuccess(false);
  }

  const handleCloseModalSuccessEdit = () => {
    setStudentId("");
    setSocialName("");
    setOpenModalEdit(false);
    setSuccessEdit(false);
  }

  const handleExpirationDate = (_, dateString) => {
    setExpirationDate(dateString || null);
    setDisabledUpdateExpirationDate(!(!!dateString));
  }
  
  const actionsTable = [
    {
      name: "Alterar Inativação",
      func: handleOpenEditInactivation,
      icon: <CalendarFilled />,
    },
    {
      name: "Editar",
      func:  handleOpenModalEdit,
      icon: <EditFilled className="iconUpdate" />,
    },
  ];

  const columns = [
    {
      title: "Nome",
      key: "name",
      width: "250px",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "E-mail",
      dataIndex: "email",
      width: "300px",
      ellipsis: true,
    },
    {
      title: "Data de Expiração",
      dataIndex: "expirationDate",
      width: "200px",
      hideInSearch: true,
      ellipsis: true,
      render: (_, { expirationDate }) => <ColumnDateTable date={expirationDate} formatDate="DD/MM/YYYY" adapt />
    },
    {
      title: "Status",
      width: "200px",
      key: "status",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        all: {
          text: "Todos",
          status: "Default",
        },
        active: {
          text: "Ativo",
          status: "Success",
        },
        inative: {
          text: "Inativo",
          status: "error",
        },
        in_deactivation: {
          text: "Inativo em breve",
          status: "error",
        },
      },
      render: (_, { status, inactivationSoon }) => (
        <ColumnStatusStudent status={status} inactivationSoon={inactivationSoon} />
      )
    },
    {
      title: "Ações",
      valueType: "option",
      width: "300px",
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
          request={getData}
          actionRef={tableRef}
          textButton="Importar Alunos"
          stylesButton="buttonPrimary"
          iconButton={<PlusOutlined />}
          actionButton={setOpenModalUpload}
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
        visible={openModalUpload}
        onCloseModal={handleCloseModalUpload}
      >
        <UploadBox
          loading={loading}
          submit={submitFile}
        />
      </Modal>

      <Modal
        visible={openModalEdit}
        buttons={[{
          text: "Salvar",
          styles: "buttonDefault",
          handleClick: editSocialName,
        }]}
        onCloseModal={handleCloseModalEdit}
      >
        <div className={styles.modalEdit}>
          <p>Edição do aluno</p>

          <p className={styles.labelEdit}>Nome social:</p>
          <Input
            type="text"
            value={socialName}
            onChange={handleEditSocialName}
          />
        </div>
      </Modal>

      <Modal
        visible={openModalEditInactivation}
        buttons={[
          {
            text: "Fechar",
            styles: "buttonDefault",
            handleClick: handleCloseEditInactivation,
          },
          {
            text: "Atualizar",
            styles: "buttonBackground buttonMarginLeft",
            disabled: disabledUpdateExpirationDate,
            handleClick: editInactivationDate,
          }
        ]}
        onCloseModal={handleCloseEditInactivation}
      >
        <div className="messageModalDelete">
          <p style={{ marginBottom: 0 }}>A data de inativação do usuário <b>{currentData?.email}</b></p>
          <p style={{ marginTop: 0 }}>é <b>{moment(currentData.expirationDate).format("DD/MM/YYYY")}</b>.</p>

          <p>Para alterar essa data de inativação, faça a alteração abaixo e atualize:</p>

          <div className={styles.dataPickerForm}>
            <DatePicker
              size="small"
              format="DD/MM/YYYY"
              defaultPickerValue={moment()}
              disabledDate={(current) => {
                const yearStart = moment().subtract(1, "year");
                const yearEnd = moment().add(1, "year");
                return !(yearStart.isSameOrBefore(current) && yearEnd.isAfter(current));
              }}
              onChange={handleExpirationDate} 
            />
          </div>
        </div>
      </Modal>

      <ModalSuccess
        visible={importSuccess || successEdit}
        buttons={[{
          text: "Fechar",
          styles: "buttonDefault",
          handleClick: importSuccess ? handleCloseModalSuccessImport : handleCloseModalSuccessEdit,
        }]}
        onCloseModal={importSuccess ? handleCloseModalSuccessImport : handleCloseModalSuccessEdit}
      >
        {successEdit && (<ContentModalSuccessEdit />)}
        {importSuccess && (<ContentModalSuccessImport data={resultImportStudents} />)}
      </ModalSuccess>

      <ModalError
        visible={importError || errorEdit}
        buttons={[{
          text: "Fechar",
          styles: "buttonDefault",
          handleClick: importError ? handleCloseModalErrorImport : handleCloseModalErrorEdit,
        }]}
        onCloseModal={importError ? handleCloseModalErrorImport : handleCloseModalErrorEdit}
      >
        {errorEdit && (<ContentModalErrorEdit />)}
        {importError && (<ContentModalErrorImport />)}
      </ModalError>
    </div>
  );
}

export default StudentList;
