import React, { useEffect, useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faCheck } from '@fortawesome/free-solid-svg-icons';

declare global {
  interface Window {
    electron: {
      invoke: (channel: string, data?: any) => Promise<any>;
      on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
      removeListener: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
    };
  }
}

const App: React.FC = () => {
  const [dbPath, setDbPath] = useState<string>(''); ///Users/eduardotrindade/downloads/Resulth/RESULTH.FB
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);
  const [success, setSuccess] = useState<string>('');

  const handleSelectDatabase = async () => {
    const path = await window.electron.invoke('select-database');
    console.log('path', path);
    if (path) {
      setDbPath(path);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setSuccess('');
    setLoading(true);
    setProgress(0);
    setCurrent(0);
    try {
      await window.electron.invoke('export-data', dbPath);
    } catch (error: any) {
      setMessage(`Erro: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleExportProgress = (
      _event: any,
      { current, total, progress }: { current: number; total: number; progress: number }
    ) => {
      setCurrent(current);
      setTotal(total);
      setProgress(progress);
    };

    const handleExportSuccess = (_event: any, buffer: ArrayBuffer) => {
      setLoading(false);
      setProgress(100);
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Produtos.xlsx';
      a.click();
      URL.revokeObjectURL(url);
      setSuccess('Arquivo exportado com sucesso');
    };

    const handleExportError = (_event: any, errorMessage: string) => {
      setMessage(`Erro: ${errorMessage}`);
      setLoading(false);
    };

    window.electron.on('export-success', handleExportSuccess);
    window.electron.on('export-error', handleExportError);
    window.electron.on('export-progress', handleExportProgress);

    return () => {
      window.electron.removeListener('export-success', handleExportSuccess);
      window.electron.removeListener('export-error', handleExportError);
      window.electron.removeListener('export-progress', handleExportProgress);
    };
  }, []);

  return (
    <div className='container'>
      <img
        src='https://axxos.com.br/wp-content/uploads/2024/02/Axxos-Versao-Retangular-RGB-01-e1707965708793-2048x520.png'
        alt='Logo AXXOS'
        className='logo'
        width='150'
      />
      <h1>Conversor de Dados Firebird para Excel</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='db_path'>Informe o caminho completo do Banco de Dados:</label>
        <input
          type='text'
          id='db_path'
          value={dbPath}
          onChange={(e) => setDbPath(e.target.value)}
          placeholder='/caminho/para/seubanco.fb'
          required
        />
        <button type='button' onClick={handleSelectDatabase} className='button button-info'>
          <FontAwesomeIcon icon={faFolderOpen} className='icon-with-margin' />
          Selecionar Banco de Dados
        </button>
        <button type='submit' className='button button-success' disabled={!dbPath || loading}>
          <FontAwesomeIcon icon={faCheck} className='icon-with-margin' />
          Exportar
        </button>
      </form>
      <div id='message' className={message ? 'error' : success ? 'success' : ''}>
        {loading && (
          <div className='progress'>
            <span>
              {current}/{total}
            </span>
            <progress value={progress} max='100'></progress>
          </div>
        )}
        {success && <span className='message'>{success}</span>}
        {message && !success && <span className='message'>{message}</span>}
      </div>
    </div>
  );
};

export default App;
