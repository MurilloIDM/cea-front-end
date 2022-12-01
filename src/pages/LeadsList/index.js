import { useRef, useState } from "react";
import { PageHeader } from "antd";
import { ExportOutlined } from "@ant-design/icons"

import ProTable from "../../components/ProTable";
import RouterBreadcrumb from "../../components/RouterBreadcrumb";
import ModalError from "../../components/Modal/components/ModalError";
import ModalDateFilter from "../../components/Modal/components/ModalDateFilter"

import { LeadService } from "../../services";

import styles from "./styles.module.css";
import ColumnDateTable from "../../components/ColumnDateTable";

const routes = [
  {
    active: false,
    path: "/leads",
    breadcrumbName: "Leads"
  },
  {
    active: true,
    path: "/listagem",
    breadcrumbName: "Listagem"
  }
];

const LeadsList = () => {
  const [modalError, setModalError] = useState(false);
  const [messageError, setMessageError] = useState({});
  const [modalDateFilter, setModalDateFilter] = useState(false);

  const handleCloseModalError = () => setModalError(false);
  // const handleCloseModalDateFilter = () => console.log("teste");
  const handleCloseModalDateFilter = () => setModalDateFilter(false);
  const openModalDateFilter = () => setModalDateFilter(true)

  const tableRef = useRef();

  const getData = async ({ current, pageSize, name }) => {
    const query = {
      direction: "DESC",
      page: current - 1,
      orderBy: "createdAt",
      linesPerPage: pageSize,
    };

    if (name) query.name = name;

    try {
      const { data } = await LeadService.listPerPage(query);

      return {
        success: true,
        data: data.content,
        total: data.totalElements,
      };
    } catch (e) {
      setMessageError({
        type: "listar leads",
        text: "Erro inesperado. Tente novamente mais tarde!"
      });
      setModalError(true);
    }
  };

  const columns = [
    {
      title: "Telefone",
      dataIndex: "phone",
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: "Nome",
      key: "name",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "E-mail",
      key: "email",
      dataIndex: "email",
      ellipsis: true,
    },

    {
      title: "Data de Criação",
      dataIndex: "createdAt",
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => <ColumnDateTable date={record?.createdAt} formatDate="DD/MM/YYYY" adapt />
    },
  ];

  return (
    <div>
      <PageHeader
        title="Listagem de Leads"
        breadcrumbRender={() => <RouterBreadcrumb routes={routes} />}
      />
      <div className={styles.containerTable}>
        <ProTable
          search={false}
          rowKey="id"
          columns={columns}
          textButton="Exportar"
          typeButton="teste"
          request={getData}
          actionRef={tableRef}
          onClick={openModalDateFilter}
          stylesButton={`${styles.csvButton} ${styles.exportButton}`}
          iconButton={<ExportOutlined className={styles.iconPadding} />}
        />
      </div>
      {/* <div className={styles.containerTable}>
        <ProTable
          search={false}
          rowKey="id"
          columns={columns}
          textButton="Exportar"
          typeButton="export"
          request={getData}
          actionRef={tableRef}
          stylesButton={`${styles.csvButton} ${styles.exportButton}`}
          iconButton={<ExportOutlined className={styles.iconPadding} />}
        />
      </div> */}

      <ModalError
        iconButton={<ExportOutlined className={styles.iconPadding} />}
        textButton="Confirmar exportação"
        stylesButton={`${styles.csvButton} ${styles.exportButton}`}
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

      <ModalDateFilter
        title="Selecione o período desejado para o download."
        style={{
          top: 20,
        }}
        buttons={[{
          text: "Cancelar",
          styles: "buttonDefault",
          handleClick: handleCloseModalDateFilter,
        }]}
        visible={modalDateFilter}
        onCloseModal={handleCloseModalDateFilter}
        textButton={"textButton"}
      >

      </ModalDateFilter>
    </div>
  );
}

export default LeadsList;
