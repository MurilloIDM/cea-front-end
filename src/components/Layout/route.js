import { ProfileOutlined, FormOutlined, TableOutlined } from "@ant-design/icons";

export const ROUTE = {
  path: "/",
  name: "Home",
  routes: [
    {
      name: "Administradores",
      icon: <FormOutlined />,
      routes: [
        {
          name: "Listagem",
          path: "/administradores/listagem"
        },
        {
          name: "Cadastro",
          path: "/administradores/cadastro"
        },
      ]
    },
    {
      name: "Conteúdo Gratuito",
      icon: <TableOutlined />,
      routes: [
        {
          name: "Listagem",
          path: "/conteudo-gratuito/listagem"
        },
        {
          name: "Cadastro",
          path: "/conteudo-gratuito/cadastro"
        },
      ]
    },
    {
      name: "Leads",
      icon: <ProfileOutlined />,
      routes: [
        {
          name: "Listagem",
          path: "/leads/listagem"
        },
      ]
    }
  ]
};
