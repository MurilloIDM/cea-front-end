import { useRef, useState } from "react";
import { PageHeader } from "antd";
import { ExportOutlined  } from "@ant-design/icons"
import ProTable from "../../components/ProTable";
import RouterBreadcrumb from "../../components/RouterBreadcrumb";
import ModalError from "../../components/Modal/components/ModalError";


// import { DATA_MOCK } from "./mocks/data";
import { LeadService } from "../../services";

import "./styles.css";

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
    },
];

const LeadsList = () => {
    
    const [modalError, setModalError] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const handleCloseModalError = () => setModalError(false);
    const tableRef = useRef();
    
    const getData = async ({ current, pageSize, name }) => {
        const query = {
          direction: "ASC",
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
      }
    return (
        <div>
            <PageHeader
                title="Listagem de Leads"
                breadcrumbRender={() => <RouterBreadcrumb routes={routes} />}
            />
            <div className="containerTable">
                <ProTable
                    search={false}
                    rowKey="id"
                    columns={columns}
                    // dataSource={DATA_MOCK}
                    textButton="Exportar"
                    iconButton={<ExportOutlined className="iconPadding"/>}
                    typeButton="export"
                    request={getData}
                    actionRef={tableRef}
                />
            </div>
            <ModalError
        visible={modalError}
        buttons={[{
          text: "Fechar",
          styles: "buttonModal",
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

      
      
    </div>
    );

}
export default LeadsList