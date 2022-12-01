import { Empty } from "antd";

const EmptyState = ({ description = "Ops... não há dados aqui :(" }) => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_DEFAULT}
      description={description}
    />
  );
}

export default EmptyState;
