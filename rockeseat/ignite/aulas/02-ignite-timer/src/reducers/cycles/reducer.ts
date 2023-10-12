import { ActionTypes } from './actions'
import { produce } from 'immer'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  // isActive: boolean // identifica o ciclo ativo +> porem teria que percorrer para mudar os ativos e nao ativos
  // solução é criar um estado
  startDate: Date // assina uma data de inicio de um ciclo
  interrupteDate?: Date // assina uma data caso o ciclo seja interrompido => será OPCIONAL (?:) pq pode nao haver interrupção
  finishedDate?: Date // assina uma data caso o ciclo seja finalizado => será OPCIONAL (?:) pq pode nao haver finlização
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

// interface para definir qual irá ser o formato dos ciclos

export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      /* SUB:1 return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      } */
      // SUB:1 UITLIZAR O IMMER(draf será mutavel , sem comprometer a imutabilidade do react)
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })

    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      /* SUB:2 return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            // retorna todos os dados do ciclo ativo(...cycle), porem adicionar uma nova infomração (interruptDate)
            return { ...cycle, interrupteDate: new Date() }
            // senao retorna o ciclo sem alterações
          } else {
            return cycle
          }
        }),
        activeCycleId: null,
      } */

      // SUB:2 UITLIZAR O IMMER(draf será mutavel , sem comprometer a imutabilidade do react)
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if (currentCycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].interrupteDate = new Date()
      })
    }

    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      /*    SUB:3 return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            // retorna todos os dados do ciclo ativo(...cycle), porem adicionar uma nova infomração (interruptDate)
            return { ...cycle, interrupteDate: new Date() }
            // senao retorna o ciclo sem alterações
          } else {
            return cycle
          }
        }),
        activeCycleId: null,
      } */

      // SUB:3 UITLIZAR O IMMER(draf será mutavel , sem comprometer a imutabilidade do react)
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if (currentCycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].finishedDate = new Date()
      })
    }
    default:
      return state
  }
}
