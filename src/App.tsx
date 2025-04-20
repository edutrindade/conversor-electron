/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faBox,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

declare global {
  interface Window {
    electron: {
      invoke: (channel: string, data?: any) => Promise<any>;
      on: (
        channel: string,
        listener: (event: any, ...args: any[]) => void
      ) => void;
      removeListener: (
        channel: string,
        listener: (event: any, ...args: any[]) => void
      ) => void;
    };
  }
}

const App: React.FC = () => {
  const [dbPath, setDbPath] = useState<string>(""); ///Users/eduardotrindade/downloads/Resulth/RESULTH.FB
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [progress, setProgress] = useState<{ processed: number; total: number } | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const handleSelectDatabase = async () => {
    setMessage("");
    setSuccess("");
    setLoading(false);
    setProgress(null);
    setSaving(false);

    const path = await window.electron.invoke("select-database");
    console.log("path", path);
    if (path) {
      setDbPath(path);
    }
  };

  const handleCanceled = () => {
    setLoading(false);
    setSaving(false);
    setProgress(null);
    setMessage("Exportação cancelada com sucesso.");
  };

  const handleExportProducts = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setMessage("");
    setSuccess("");
    setLoading(true);
    setProgress(null);
    setSaving(false);

    try {
      // Inicia a exportação de produtos
      await window.electron.invoke("export-products-data", dbPath);
      setSuccess("Arquivo exportado com sucesso");
      setMessage("")
    } catch (error) {
      console.log('error', error);
      if (error instanceof Error) {
        if (error.message.includes('reply was never sent')) {
          setMessage("Não foi possível salvar o arquivo. Parece que você já tem um arquivo aberto com o mesmo nome. Feche o arquivo e tente novamente.");
          return;
        }
        setMessage(error.message);
      } else {
        setMessage(`Erro inesperado: ${String(error)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportCustomers = async () => {
    setMessage("");
    setSuccess("");
    setLoading(true);
    try {
      await window.electron.invoke("export-customers-data", dbPath);
    } catch (error: any) {
      setMessage(`${error.message}`);
    } finally {
      setLoading(false)
    }
  };

  const handleCancelExport = async () => {
    const cancel = await window.electron.invoke("cancel-export");
    if (cancel) {
      setLoading(false);
      setSaving(false);
      setProgress(null);
      setMessage("Exportação cancelada com sucesso.");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  }

  useEffect(() => {
    const onStart = (_e: any, total: number) => setProgress({ processed: 0, total });

    const onProgress = (_e: any, processed: number, total: number) =>
      setProgress({ processed, total });

    const onSaving = (_e: any, filePath: string) => {
      setSaving(true);
    }

    const onSuccess = (_e: any, buffer: ArrayBuffer, type: string) => {
      setLoading(false);
      setSaving(false);
      setProgress(null);
      setSuccess('Arquivo exportado com sucesso!');
    };

    const onError = (_e: any, errorMessage: string) => {
      setLoading(false);
      setSaving(false);
      setProgress(null);
      console.log('errorMessage', errorMessage);
      if (errorMessage.includes('reply was never sent')) {
        setMessage("Não foi possível salvar o arquivo. Parece que você já tem um arquivo aberto com o mesmo nome. Feche o arquivo e tente novamente.");
      }
      setMessage(`Erro: ${errorMessage}`);
    };

    window.electron.on('export-start', onStart);
    window.electron.on('export-progress', onProgress);
    window.electron.on('export-saving', onSaving);
    window.electron.on('export-success', onSuccess);
    window.electron.on('export-error', onError);
    window.electron.on('export-cancelled', handleCanceled);

    return () => {
      window.electron.removeListener('export-start', onStart);
      window.electron.removeListener('export-progress', onProgress);
      window.electron.removeListener('export-saving', onSaving);
      window.electron.removeListener('export-success', onSuccess);
      window.electron.removeListener('export-error', onError);
      window.electron.removeListener('export-cancelled', handleCanceled);
    };

  }, []);



  return (
    <div className="container">
      <img
        src="https://axxos.com.br/wp-content/uploads/2024/02/Axxos-Versao-Retangular-RGB-01-e1707965708793-2048x520.png"
        alt="Logo AXXOS"
        className="logo"
        width="150"
      />
      <h1>Exportador de Dados - Firebird para Excel</h1>
      <form onSubmit={handleExportProducts}>
        <label htmlFor="db_path">
          Informe o caminho completo do Banco de Dados:
        </label>
        <input
          type="text"
          id="db_path"
          value={dbPath}
          onChange={(e) => setDbPath(e.target.value)}
          placeholder="/caminho/para/seubanco.fb"
          required
        />
        <button
          type="button"
          onClick={handleSelectDatabase}
          className="button button-info"
          disabled={loading || saving}
        >
          <FontAwesomeIcon icon={faFolderOpen} className="icon-with-margin" />
          Selecionar Banco de Dados
        </button>
        <button
          type="submit"
          className="button button-success"
          disabled={!dbPath || loading}
        >
          <FontAwesomeIcon icon={faBox} className="icon-with-margin" />
          Exportar Produtos
        </button>
        <button
          type="button"
          onClick={handleExportCustomers}
          className="button button-success"
          disabled={!dbPath || loading}
        >
          <FontAwesomeIcon icon={faUsers} className="icon-with-margin" />
          Exportar Clientes
        </button>
        <button
          type="button"
          onClick={handleCancelExport}
          className="button button-danger"
          disabled={!loading || !saving}
        >
          <FontAwesomeIcon icon={faBox} className="icon-with-margin" />
          Cancelar
        </button>
      </form>
      <div
        id="message"
        className={message.length > 1 ? "error" : success ? "success" : ""}
      >
        {loading && (
          <div className="progress">
            {progress ? (
              <>
                {!saving ? (
                  <>
                    <span className="progress-title">
                      Exportando {progress.processed} / {progress.total} registros…
                    </span>
                    <progress
                      value={progress.processed}
                      max={progress.total}
                      className="progress-bar"
                    />
                  </>
                ) : (
                  <div className="save-box">
                    <span className="progress-title">Salvando o arquivo...</span>
                    <div className="spinner">
                      <div className="double-bounce1"></div>
                      <div className="double-bounce2"></div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <span className="progress-title">Por favor, aguarde…</span>
            )}
          </div>
        )}
        {success && <span className="message">{success}</span>}
        {message && !success && <span className="message">{message}</span>}
      </div>
    </div>
  );
};

export default App;
