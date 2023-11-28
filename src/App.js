import React, { useState } from 'react'
import uploadFile from './utils/uploadFile.ts'
import { ToastContainer } from 'react-toastify'
import notify from './utils/sistemaNotificacao.ts'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

function App () {
  const [valorOtimo, setValorOtimo] = useState()
  const [dados, setDados] = useState(null)
  const [diasAtendidos, setDiasAtendidos] = useState()
  const [diasNaoAtendidos, setDiasNaoAtendidos] = useState([])
  const [diasCalulados, setDiasCalculados] = useState([])
  const [diasEscolhidos, setDiasEscolhidos] = useState([])
  const [tipoCalculo, setTipoCalculo] = useState('A')
  const feriadosEDomingos = [2, 5, 12, 15, 19, 20, 26]
  const [diasTotais, setDiasTotais] = useState()
  const [quantidadeDeRestricoes, setQuantidadeDeRestricoes] = useState()

  const getArchive = async event => {
    try {
      const result = await uploadFile(event, tipoCalculo)
      if (result != false) {
        setDados(event)
        setValorOtimo(result[0].ValorOtimo)
        setDiasAtendidos(result[1].DiasAtendidos)
        setDiasTotais(
          parseInt(
            result[4].DiasCalculados.length *
              result[4].DiasCalculados[0].value.length
          )
        )
        setDiasNaoAtendidos(result[2].DiasNaoAtendidos)
        setQuantidadeDeRestricoes(result[3].QuantidadeRestricoes)
        setDiasCalculados(result[4].DiasCalculados)
        setDiasEscolhidos(result[5].DiasEscolhidos)
        notify('Arquivo processado com sucesso!', 'success')
      }
    } catch (error) {
      console.error('Erro ao processar o arquivo:', error)
    }
  }
  const printContent = () => {
    window.print()
  }
  const diasDoMes = Array.from({ length: 33 }, (_, i) => ((i + 28) % 31) + 1)

  const handleCalcularNovamente = async () => {
    try {
      const item = await uploadFile(dados, tipoCalculo)
      setValorOtimo(item[0].ValorOtimo)
      setDiasAtendidos(item[1].DiasAtendidos)
      setDiasTotais(
        parseInt(
          item[4].DiasCalculados.length * item[4].DiasCalculados[0].value.length
        )
      )
      setDiasNaoAtendidos(item[2].DiasNaoAtendidos)
      setQuantidadeDeRestricoes(item[3].QuantidadeRestricoes)
      setDiasCalculados(item[4].DiasCalculados)
      setDiasEscolhidos(item[5].DiasEscolhidos)
      notify('Arquivo processado com sucesso!', 'success')
    } catch (error) {
      console.error('Erro ao calcular novamente:', error)
    }
  }

  const seriaDiaSelecionado = (funcionario, dia) => {
    return funcionario.value.includes(dia)
  }
  return (
    <div className='App'>
      <div className='file-upload-header'>
        <div className='form-control' id='JSON'>
          <input
            className='input-file'
            id='inputFile'
            type='file'
            onChange={getArchive}
          />
          <label htmlFor='inputFile' className='input-file-trigger'>
            Subir TXT
          </label>
        </div>
        <button className='print-btn' onClick={printContent}>
          Imprimir
        </button>
      </div>
      <div className='content-to-print'>
        <div className='container'>
          <div className='row'>
            <div className='info'>
              Valor Ótimo: <span id='valorOtimo'>{valorOtimo}</span>
            </div>
            <div className='info'>
              Folgas não atendidas:{' '}
              <span id='diasAtendidos'>{diasNaoAtendidos}</span>
            </div>
          </div>
          <div className='row'>
            <div className='info'>
              Dias Totais: <span id='diasTotais'>{diasTotais}</span>
            </div>
            <div className='info'>
              N° de Restrições:{' '}
              <span id='quantidadeDeRestricoes'>{quantidadeDeRestricoes}</span>
            </div>
          </div>
          <div className='row'>
            <div className='info'>
              Feriados e Domingos:{' '}
              <span id='diasTotais'>{feriadosEDomingos.join(', ')} </span>
            </div>
            <div className='info'>
              Tipo de Cálculo:
              <label>
                <input
                  type='radio'
                  value='A'
                  checked={tipoCalculo === 'A'}
                  onChange={() => setTipoCalculo('A')}
                />
                A
              </label>
              <label>
                <input
                  type='radio'
                  value='B'
                  checked={tipoCalculo === 'B'}
                  onChange={() => setTipoCalculo('B')}
                />
                B
              </label>
            </div>
          </div>
          <div className='row-center'>
            <button onClick={handleCalcularNovamente} disabled={!dados}>
              Calcular Novamente
            </button>
          </div>
        </div>
        <div className='grid-Container'>
          <div className='grid-Content'>
            {diasCalulados.map((funcionario, index) => (
              <div key={index}>
                <p>Funcionario N°{index + 1}</p>
                <p>Dias Calculado: {funcionario.value.join(', ')}</p>
                <p>Dias Escolhidos: {diasEscolhidos[index].value.join(', ')}</p>
                <div className='calendar'>
                  <div className='column-header'>Dom</div>
                  <div className='column-header'>Seg</div>
                  <div className='column-header'>Ter</div>
                  <div className='column-header'>Qua</div>
                  <div className='column-header'>Qui</div>
                  <div className='column-header'>Sex</div>
                  <div className='column-header'>Sáb</div>
                  {diasDoMes.map((dia, diaIndex) => (
                    <span
                      key={diaIndex}
                      className={`${
                        diaIndex >= 3 && seriaDiaSelecionado(funcionario, dia)
                          ? 'sorted'
                          : ''
                      } ${
                        (seriaDiaSelecionado(funcionario, dia) &&
                          seriaDiaSelecionado(diasEscolhidos[index], dia)) ||
                        (funcionario.value.includes(dia) &&
                          feriadosEDomingos.includes(dia))
                          ? 'selected'
                          : ''
                      }`}
                      data-day={diaIndex}
                    >
                      {dia}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default App
