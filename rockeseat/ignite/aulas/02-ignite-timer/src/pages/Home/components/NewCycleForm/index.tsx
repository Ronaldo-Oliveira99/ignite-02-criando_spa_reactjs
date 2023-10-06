import { FormContainer, MinuteAmountInput, TaskInput } from './styles'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { CyclesContext } from '../../../../contexts/CyclesContext'

export function NewCycleForm() {
  // buscar activeCycle no contexto provider CyclesContext
  const { activeCycle } = useContext(CyclesContext)

  // com o provider FormProvider em volta do componente em 'HOME' pode chamar 'useFormContext' para instanciar 'regiter'
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>

      <TaskInput
        id="task"
        list="task-suggestions"
        placeholder="Dê um nome para o seu projeto"
        disabled={!!activeCycle} // => se houver um ciclo ativo, nao liberar os inputs => !! para converter para true ou para false
        {...register('task')} // => register do useForm
      />

      <datalist id="task-suggestions">
        <option value="projeto 1" />
        <option value="projeto 2" />
        <option value="projeto 3" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinuteAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        // max={60}
        min={5}
        disabled={!!activeCycle} // => se houver um ciclo ativo, nao liberar os inputs => !! para converter para true ou para false
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
