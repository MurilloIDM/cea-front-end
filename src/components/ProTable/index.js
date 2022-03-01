import ptBR from "antd/lib/locale/pt_BR";
import { enLocale } from "./utils/locale";

import { ConfigProvider } from "antd";
import ProTableAntd, { createIntl, IntlProvider } from "@ant-design/pro-table";

import Button from "../Button";
import EmptyState from "../EmptyState";
import ButtonCSV from "../ButtonCSV";

const ptBRIntl = createIntl("pt-BR", enLocale);

const ButtonAction = ({
  type,
  actionButton,
  stylesButton,
  iconButton,
  textButton,
}) => {

  if (type === 'export') {
    return (
      <ButtonCSV
        iconButton={iconButton}
        textButton={textButton}
      />
    );
  }

  return (
    <Button
      type="type"
      handleClick={actionButton}
      stylesButton={stylesButton}
    >
      {iconButton}
      {` ${textButton}`}
    </Button>
  );
}

const ProTable = ({
  columns,
  request,
  search,
  textButton,
  iconButton,
  dataSource,
  typeButton,
  stylesButton,
  actionButton,
  ...props
}) => {
  const toolbar = {
    actions: [
      (
        <ButtonAction
          actionButton={actionButton}
          iconButton={iconButton}
          stylesButton={stylesButton}
          textButton={textButton}
          type={typeButton}
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
