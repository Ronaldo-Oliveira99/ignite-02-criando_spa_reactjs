// criado este componente temporariamente para testar CONTEXT API
import { createContext, useContext, useState } from 'react'

const CyclesContext = createContext({} as any)

export function NewCycleForm() {
  const { activeCycle, setActiveCycle } = useContext(CyclesContext)

  return (
    <h1>
      NewCycleForm: {activeCycle}
      <button
        onClick={() => {
          setActiveCycle(2)
        }}
      >
        Alterar Ciclo ativo
      </button>{' '}
    </h1>
  )
}

export function Countdown() {
  const { activeCycle } = useContext(CyclesContext)
  return <h1>Countdown:{activeCycle}</h1>
}

export function Home() {
  const [activeCycle, setActiveCycle] = useState(0)
  return (
    <CyclesContext.Provider value={{ activeCycle, setActiveCycle }}>
      <div>
        <NewCycleForm />
        <Countdown />
      </div>
    </CyclesContext.Provider>
  )
}
