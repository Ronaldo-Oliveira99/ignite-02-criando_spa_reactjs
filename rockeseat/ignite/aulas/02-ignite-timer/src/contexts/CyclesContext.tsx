import { ReactNode, createContext, useState } from 'react'

// interface para definir qual irá ser o formato dos ciclos
interface CreateCycleData {
  task: string
  minutesAmount: number
}

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
  cycles: Cycle[]
  activeCycle: Cycle | undefined // => undefined para o caso se não ter uniciado nenhum ciclo, activeCycle será undefined
  activeCycleId: string | null
  amountSecondsPassed: number //
  markCurrentCycleAsFinished: () => void // =>para enviar so a função
  setSecondsPassed: (seconds: number) => void // =>para enviar so a função
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

// criação e utilização de contexto CyclesContext
// export para acesso dos outros componentes
export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
  // ReactNode => qualquer html(jsx) valido para p react
}

// children => devido ter um componente dentro deste em APP.tsx
export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // sempre iniciar um estado com uma informação do mesmo tipo a qual ira manusear a aplicação
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // estado começa como null , nao esta ativo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // armazena a qtd de segundos que ja se passaram desde a criação do ciclo

  // percorrer cycles para encontrar um id igual a activeCycle
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }
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

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      // grava o id em uma string com a data em milisegundos
      id, // => ao ives =>  id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(), // data que o ciclo iniciou
    }
    // ao alterar um estado e este estado dependa da sua informação anterior antes de alterar,
    // o valor deste estado ser alterado em formato de função  // CLOSURES
    setCycles((state) => [...state, newCycle]) // => setCycles([...cycles, newCycle])
    setActiveCycleId(id) // seta um id par ao cyclo

    setAmountSecondsPassed(0) // zerar o timer do ciclo anterior para que nao haja conflitos de timers entre o ciclo

    // const teste = String(new Date().getTime())
    // console.log(teste)

    // reset => useForm
    // reset()
  }

  function interruptCurrentCycle() {
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
  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished, // envia uma função para que usa setCycle ao ives de enviar o hook "set" por contexto
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
