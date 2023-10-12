import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import {
  ActionTypes,
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

// interface para definir qual irá ser o formato dos ciclos, vem de => const newCycleForm = useForm<NewCicleFormData> na HOME
// setando o tipo manualmente para caso a biblioteca zod nao existir, nao interfica no contexto
// nao trazerr o react hook form para dentro do contexto
interface CreateCycleData {
  task: string
  minutesAmount: number
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

// ReactNode => qualquer html(jsx) valido para p react
interface CyclesContextProviderProps {
  children: ReactNode
}

// funcao para agragar todoa a regra de ciclos atraves de contexto => CyclesContextProvider
// children => devido ter um componente dentro deste em APP.tsx
export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // sempre iniciar um estado com uma informação do mesmo tipo a qual ira manusear a aplicação
  // const [cycles, setCycles] = useState<Cycle[]>([]) //inicia com []

  // implementação de reduce para [cycles, setCycles]
  // setCycles(vira dispatch, substitui setCycles) agora ele dispara a action, e nao altera o valor de cycles diretamente
  const [cycleState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      // initialState = conteudo do segundo parametro do Reducer
      const storedStateAsJson = localStorage.getItem(
        '@ignite-timer:cycles-state-1.0.0',
      )

      if (storedStateAsJson) {
        return JSON.parse(storedStateAsJson)
      }

      return initialState
    },
  )
  const { cycles, activeCycleId } = cycleState

  // percorrer cycles para encontrar um id igual a activeCycle
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // [activeCycleId, setActiveCycleId] inserido no reduce
  // SUB4: const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // estado começa como null , nao esta ativo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  }) // armazena a qtd de segundos que ja se passaram desde a criação do ciclo

  // salvar em local storage do browser as informacoes de cicloa
  useEffect(() => {
    const stateJson = JSON.stringify(cycleState)
    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJson)
  }, [cycleState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }
  // ao ives de enviar setCycles em context devido a complexidade da tipagem , enviar uma nova função com o retorno void
  function markCurrentCycleAsFinished() {
    // SUB1:substituir setCycle por dispatch enviando activeCycleId
    dispatch(markCurrentCycleAsFinishedAction())

    // substituir setCycle por dispatch
    /*  SUB1: setCycles(
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
    ) */
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

    // SUB2:substituir setCycle setActiveCycleId por dispatch enviando pelo newCycle
    dispatch(addNewCycleAction(newCycle))
    // ao alterar um estado e este estado dependa da sua informação anterior antes de alterar,
    // o valor deste estado ser alterado em formato de função  // CLOSURES
    // SUB2: setCycles((state) => [...state, newCycle]) // => setCycles([...cycles, newCycle])

    // SUB2: setActiveCycleId(id) // seta um id par ao cyclo

    setAmountSecondsPassed(0) // zerar o timer do ciclo anterior para que nao haja conflitos de timers entre o ciclo

    // const teste = String(new Date().getTime())
    // console.log(teste)

    // reset => useForm
    // reset()
  }

  function interruptCurrentCycle() {
    // SUB3:substituir setCycle por dispatch enviando activeCycleId
    dispatch(interruptCurrentCycleAction())

    // percorrer o ciclo ativo para alterar a data que houve a interrupção
    /*  SUB3: setCycles(
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
    ) */

    // atualiza o estado => não terá mais ciclo ativo => null
    // SUB3:setActiveCycleId(null)
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
