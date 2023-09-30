import { HandPalm, Play } from 'phosphor-react'

import { createContext, useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'

// interface para definir qual irá ser o formato dos ciclos
interface Cycle {
  id: string
  task: string
  minutesAmount: number
  // isActive: boolean // identifica o ciclo ativo +> porem teria que percorrer para mudar os ativos e nao ativos
  // solução é criar um estado
  startDate: Date // assina uma data de inicio de um ciclo
  interrupteDate?: Date // assina uma data caso o ciclo seja interrompido => será OPCIONAL (?:) pq pode nao haver interrupção
  finishedDate?: Date // assina uma data caso o ciclo seja finalizado => será OPCIONAL (?:) pq pode nao haver finlização
}

// interface para context
interface CyclesContextType {
  activeCycle: Cycle | undefined // => undefined para o caso se não ter uniciado nenhum ciclo, activeCycle será undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void // =>para enviar so a função
}

// criação e utilização de contexto
// export para acesso dos outros componentes
export const CyclesContext = createContext({} as CyclesContextType) //  as CyclesContextType => qunado for chamado no <CyclesContext.Provider> vai dar a sugestão de activeCycle =>  value={{ activeCycle }}

export function Home() {
  // sempre iniciar um estado com uma informação do mesmo tipo a qual ira manusear a aplicação
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // estado começa como null , nao esta ativo

  // percorrer cycles para encontrar um id igual a activeCycle
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // **formState tem um atributo para erros de validação
  // **retorna erros de validação
  // **console.log(formState.errors)

  // ao ives de enviar setCycles em context devido a complexidade da tipagem , enviar uma nova função com o retorno void
  function markCurrentCycleAsFinished() {
    setCycles(
      // qnd um estado é atualizado, e este estado depende do valor anterior , escrevar  o setCycle em formato de funçao (state) => state.map
      (state) =>
        state.map((cycle) => {
          if (cycle.id === activeCycleId) {
            // retorna todos os dados do ciclo ativo(...cycle), porem adicionar uma nova infomração (interruptDate)
            return { ...cycle, finishedDate: new Date() }
            // senao retorna o ciclo sem alterações
          } else {
            return cycle
          }
        }),
    )
  }

  // evento de form submit
  // function handleCreateNewCycle(data: NewCicleFormData) {
  //   const id = String(new Date().getTime())
  //   const newCycle: Cycle = {
  //     // grava o id em uma string com a data em milisegundos
  //     id, // => ao ives =>  id: String(new Date().getTime()),
  //     task: data.task,
  //     minutesAmount: data.minutesAmount,
  //     startDate: new Date(), // data que o ciclo iniciou
  //   }
  //   // ao alterar um estado e este estado dependa da sua informação anterior antes de alterar,
  //   // o valor deste estado ser alterado em formato de função  // CLOSURES
  //   setCycles((state) => [...state, newCycle]) // => setCycles([...cycles, newCycle])
  //   setActiveCycleId(id) // seta um id par ao cyclo

  //   setAmountSecondsPassed(0) // zerar o timer do ciclo anterior para que nao haja conflitos de timers entre o ciclo

  //   // const teste = String(new Date().getTime())
  //   // console.log(teste)

  //   // reset => useForm
  //   reset()
  // }

  function handleInterruptCycle() {
    // percorrer o ciclo ativo para alterar a data que houve a interrupção
    setCycles(
      // qnd um estado é atualizado, e este estado depende do valor anterior , escrevar  o setCycle em formato de funçao (state) => state.map
      (state) =>
        state.map((cycle) => {
          if (cycle.id === activeCycleId) {
            // retorna todos os dados do ciclo ativo(...cycle), porem adicionar uma nova infomração (interruptDate)
            return { ...cycle, interrupteDate: new Date() }
            // senao retorna o ciclo sem alterações
          } else {
            return cycle
          }
        }),
    )

    // atualiza o estado => não terá mais ciclo ativo => null
    setActiveCycleId(null)
  }

  // fica observando task => taskInput
  // const task = watch('task')
  // const isSubmitDisabled = !task

  console.log('cycles', cycles)

  /*
   * Props Drillng => Quando tem MUITAS propriedades APENAS para comunicação entre componentes
   * Context API => Permite compartilharmos informações entre VARIOS componentes ao mesmo tempo
   *
   */
  return (
    <HomeContainer>
      <form action="" /* onSubmit={handleSubmit(handleCreateNewCycle)} */>
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
          }}
        >
          {/* <NewCycleForm /> */}
          <Countdown />
        </CyclesContext.Provider>
        {/* criação de botão (StopCountdownButton) para interromper um ciclo */}
        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton /* disabled={isSubmitDisabled} */ type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
