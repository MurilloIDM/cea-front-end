import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "antd";
import { EditOutlined, DeleteFilled, PlusOutlined } from "@ant-design/icons";

import Modal from "../../components/Modal";
import ProTable from "../../components/ProTable";
import ActionTable from "../../components/ActionTable";
import RouterBreadcrumb from "../../components/RouterBreadcrumb";

import { DATA_MOCK } from "./mocks/data";

import "./styles.css";

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
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const navigateAdministratorRegister = () => navigate("/administradores/cadastro");

  const handleEdit = (record) => navigate(`/administradores/edicao/${record.id}`);

  const handleClose = () => setOpenModal(false);
  const onOkModal = () => console.log("Finalizar com sucesso");

  const buttonsModal = [
    {
      styles: "",
      text: "Finalizar",
      handleClick: onOkModal,
    }
  ];

  const actionsTable = [
    {
      name: "Editar",
      func: handleEdit,
      icon: <EditOutlined className="iconUpdate" />,
    },
    {
      name: "Deletar",
      func: () => setOpenModal(true),
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
    },
    {
      title: "Ações",
      valueType: "option",
      width: "230px",
      render: ({ props }) => <ActionTable actions={actionsTable} record={props.record} />,
    }
  ];
  
  return (
    <div>
      <PageHeader
        title="Listagem de Administradores"
        breadcrumbRender={() => <RouterBreadcrumb routes={routes} />}
      />

      <div className="containerTable">
        <ProTable
          rowKey="id"
          columns={columns}
          dataSource={DATA_MOCK}
          textButton="Cadastrar Novo"
          stylesButton="buttonPrimary"
          iconButton={<PlusOutlined />}
          actionButton={navigateAdministratorRegister}
          request={(params) => console.log("FAZER REQUISIÇÃO", params)}
        />
      </div>

      <Modal
        visible={openModal}
        buttons={buttonsModal}
        onCloseModal={handleClose}
      >
        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in augue nibh. Praesent vulputate nulla ut urna blandit consequat. Aenean dictum nulla quis massa faucibus, et porta nisl convallis. Aliquam eleifend ligula in ante sagittis, ac rhoncus nisi eleifend. Donec mollis lacus sed facilisis accumsan. Phasellus eget neque et ex lacinia posuere at vel sem. Cras consectetur ex ac massa luctus congue. In volutpat, orci non sagittis tincidunt, quam urna egestas ipsum, at pretium nisi risus at enim. Aliquam cursus eleifend est, sed blandit lectus blandit aliquet. Curabitur at commodo turpis. Sed consectetur turpis eget pretium tincidunt. Nunc posuere tincidunt finibus. Fusce a finibus leo, ac feugiat ante.
        </p>
      </Modal>
    </div>
  );
}

export default AdministratorList;
