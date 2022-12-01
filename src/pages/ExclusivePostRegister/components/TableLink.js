import { DeleteOutlined } from "@ant-design/icons";

import styles from "../styles.module.css";

export const TableLink = ({ data, handleDelete }) => {
  const allRemove = data?.every((media) => media?.remove);

  return (
    <table className={styles.tableLink}>
      <thead>
        <tr>
          <th>URL's dos links adicionados</th>
        </tr>
      </thead>

      <tbody>
        {(allRemove || !data?.length) && (
          <tr>
            <td>
              Nenhum link foi adicionado
            </td>
          </tr>
        )}

        {data && data.map((link) => {
          const key = link?.id + "-" + link?.url + "." + link?.label;
          
          if (link?.remove) return null;

          const url = link?.url;
          const label = link?.label;
          
          return (
            <tr>
              <td>
                {label} <a target="_blank" href={url}>({url})</a>
              </td>

              <td className={styles.containerIconDeleteLink}>
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

export default TableLink;