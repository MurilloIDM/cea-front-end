import ptBR from "antd/lib/locale/pt_BR";
import { enLocale } from "./utils/locale";

import { ConfigProvider } from "antd";
import ProTableAntd, { createIntl, IntlProvider } from "@ant-design/pro-table";

import EmptyState from "../EmptyState";
import ButtonAction from "./components/ButtonAction";

const ptBRIntl = createIntl("pt-BR", enLocale);

const ProTable = ({
  columns,
  request,
  search,
  textButton,
  iconButton,
  dataSource,
  typeButton,
  stylesButton,
  onClick,
  ...props
}) => {
  const toolbar = {
    actions: [
      (
        <ButtonAction
          type={typeButton}
          textButton={textButton}
          iconButton={iconButton}
          stylesButton={stylesButton}
          onClick={onClick}
        />
      )
    ],
    settings: false,
  };

  return (
    <ConfigProvider locale={ptBR}>
      <IntlProvider value={{ intl: ptBRIntl }}>
        <ProTableAntd
          columns={columns}
          request={request}
          toolbar={toolbar}
          dataSource={dataSource}
          pagination={{
            showTotal: (total, range) => {
              return `${range[0]}-${range[1]} de ${total} itens`;
            }
          }}
          locale={{
            emptyText: <EmptyState />,
          }}
          search={search}
          {...props}
        />
      </IntlProvider>
    </ConfigProvider>
  );
}

ProTable.defaultProps = {
  search: true,
};

export default ProTable;
