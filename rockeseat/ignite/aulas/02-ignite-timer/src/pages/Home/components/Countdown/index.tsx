import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { CyclesContext } from '../..'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  // utiliza o contexto criado em home
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished } =
    useContext(CyclesContext)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // armazena a qtd de segundos que ja se passaram desde a criação do ciclo

  // converter o numero de minutos , inseridos pelo usuario para segundos => pega o ciclo ativo
  // para reduzir o countdown de segundo a segundo
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      const interval = setInterval(() => {
        // o setInterval pode apresentar segundos imprecisos(segundo plano, trocas de abas etc), entao a melhor forma é comparar os segundos
        // instalado o pacote "date nfs" para usar uma função de comparação differenceInSeconds
        const secodsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        // se o contado chegar a zero , o contador finaliza o ciclo
        if (secodsDifference >= totalSeconds) {
          // substitui o estado setCycles, chama esta função na home e seta o estado setCycles
          markCurrentCycleAsFinished()

          // ESTA FUNÇÃO setCycles VOLTA PARA HOME PARA VOLTAR MAIS SIMPLES
          // **semelhante ao encerramento de ciclo
          // setCycles(
          //   // qnd um estado é atualizado, e este estado depende do valor anterior , escrevar  o setCycle em formato de funçao (state) => state.map
          //   (state) =>
          //     state.map((cycle) => {
          //       if (cycle.id === activeCycleId) {
          //         // retorna todos os dados do ciclo ativo(...cycle), porem adicionar uma nova infomração (interruptDate)
          //         return { ...cycle, finishedDate: new Date() }
          //         // senao retorna o ciclo sem alterações
          //       } else {
          //         return cycle
          //       }
          //     }),
          // )

          // para ficar zerado , estava parando no 00:01
          setAmountSecondsPassed(totalSeconds)

          // parar o intervalo apos a finalização do ciclo
          clearInterval(interval)
        } else {
          // estado para controlar os segundos passados
          setAmountSecondsPassed(secodsDifference)
        }
      }, 1000)
    }

    // e possivel er um restorno dentro do useEffect => este retorno sempre vai ser uma função
    // ao criar um novo ciclo será criado um novo setInteval, gerando conflitos no timer, sendo necessário remover o setINterval anterior
    return () => {
      clearInterval(interval)
    }

    // toda variavel externa deverá ser incluida no array do use Effect
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished])

  // REGRAS SEGUNDOS E MINUTOS
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0 // será o total de segundos - o total de segundos que já se passaram

  // converter currentSeconds para ser exibido em tela ( minutos e segundos)
  // calcular quantos minutos tem no total de segundos (25 x 60) transforma 25 minutos em segundos = 1500, ao contrario converte => segundos por minutos
  const minutesAmount = Math.floor(currentSeconds / 60) // arrendonda para baixo
  const secondsAmount = currentSeconds % 60 // o resto da divisao sera os segundos

  // pad start preenche uma string ate um tamanho especifico, caso não tenha o tamanho, com algum caractere
  const minutes = String(minutesAmount).padStart(2, '0') //= > inclui um 0 ate completar 2 caracteres
  const seconds = String(secondsAmount).padStart(2, '0') //= > inclui um 0 ate completar 2 caracteres

  console.log('activeCycle', activeCycle)

  // para mostrar o timer na aba do navegador
  useEffect(() => {
    document.title = activeCycle ? `${minutes}:${seconds}` : document.title

    // toda variavel externa deverá ser incluida no array do useEffect
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
