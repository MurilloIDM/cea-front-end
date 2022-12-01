import React, { useState } from "react";

import { Form, Input } from "antd";

import Modal from "../../../components/Modal";

const { Item } = Form;

const ModalLink = ({
  visible,
  links,
  setLinks,
  handleClosed
}) => {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState(false);

  const buttons = [
    {
      text: "Fechar",
      styles: "buttonBackground",
      handleClick: handleClosedAndClean,
    },
    {
      text: "Adicionar link",
      styles: "buttonDefault buttonMarginLeft",
      disabled: error || !url || !label,
      handleClick: addLink,
    },
  ];

  function handleLabel({ target }) {
    setError(false);

    if (!target?.value) {
      setLabel(target?.value);
      return;
    }

    setLabel(target?.value?.toLowerCase());
  }

  function handleUrl({ target }) {
    setError(false);
    setUrl(target?.value);
  }

  function addLink() {
    const hasExist = links?.find((link) => link?.url === url);

    if (hasExist) {
      setError(true);
      return;
    };

    const link = { label, url };
    setLinks([...links, link]);

    handleClosedAndClean();
  }

  function clearState() {
    setUrl("");
    setLabel("");
    setError(false);
  }

  function handleClosedAndClean() {
    clearState();
    handleClosed();
  }

  return (
    <Modal
      buttons={buttons}
      visible={visible}
      onCloseModal={handleClosedAndClean}
    >
      <h3>Cadastrar novo link</h3>

      <Form name="register-link">
        <Item
          name="label"
          label="Identificador do link"
        >
          <Input
            value={label}
            onChange={handleLabel}
            placeholder="Informe o identificador do link"
          />
        </Item>

        <Item
          name="url"
          label="URL do link"
        >
          <Input
            value={url}
            onChange={handleUrl}
            placeholder="Informe a URL do link"
          />
        </Item>
      </Form>
      
      {error && (
        <p className="text-red">
          Já existe link cadastrado com essa URL!
        </p>
      )}
    </Modal>
  );
}

export default ModalLink;