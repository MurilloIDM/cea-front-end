import { useState } from "react";
import { CSVLink } from "react-csv";

import { LeadService } from "../../services";

const ButtonCSV = ({ textButton, iconButton }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const headers = [
    {
      label: "Nome",
      key: "name",
    },
    {
      label: "E-mail",
      key: "email",
    },
    {
      label: "Telefone",
      key: "phone",
    },
    {
      label: "Data de Criação",
      key: "createdAt",
    },
  ];

  const getData = async (_event, done) => {
    try {
      setLoading(true);

      const { data } = await LeadService.listAll();
      setData(data);
      
      done(true);
    } catch (e) {
      done(false);
    } finally {
      setLoading(false);
    }
  };
  
  const textButtonValue = loading ? "Gerando CSV..." : textButton;

  return (
    <CSVLink
      data={data}
      headers={headers}
      onClick={getData}
      asyncOnClick={true}
      className="button exportButton"
    >
      {iconButton}
      {textButtonValue}
    </CSVLink>
  );
}

export default ButtonCSV;
