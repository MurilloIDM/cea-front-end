import { Tooltip } from "antd";

import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

import styles from "../styles.module.css";

const TableMedia = ({ data, handleView, handleDelete }) => {
  const allRemove = data && data.every((media) => media.remove);

  return (
    <table className={styles.tableMedia}>
      <thead>
        <tr>
          <th>URL's das mídias adicionadas</th>
        </tr>
      </thead>

      <tbody>
        {(allRemove || data?.length === 0) && (
          <tr>
            <td colSpan={3}>
              Nenhuma mídia foi adicionada
            </td>
          </tr>
        )}

        {data && data.map((media) => {
          const key = media.id + "-" + media.url;
          const url = media?.url;

          if (media?.remove) return null;

          return (
            <tr key={key}>
              <td className={styles.tdMediaUrl}>
                <Tooltip title={media?.url}>{url}</Tooltip>
              </td>

              <td>
                <EyeOutlined
                  className={styles.iconMedia}
                  onClick={() => handleView(url)}
                />
              </td>

              <td>
                <DeleteOutlined
                  className={styles.iconMedia}
                  onClick={() => handleDelete(url)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TableMedia;