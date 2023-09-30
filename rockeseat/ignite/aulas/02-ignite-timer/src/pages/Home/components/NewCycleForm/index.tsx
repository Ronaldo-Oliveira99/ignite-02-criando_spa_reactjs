import { FormContainer, MinuteAmountInput } from './styles'

import { useForm } from 'react-hook-form'

// intergra bibiliotecas hook de forms com bibliotecas de validação (zod)
import { zodResolver } from '@hookform/resolvers/zod'
// bibilioteca de validação ( tem typescript)
// * as quando nao tem (export default) na biblioteca => importa tudo (*)
import * as zod from 'zod'

export function NewCycleForm() {
  // zod.Object => formato objeto => data:any => de handleCreateNewCycle(data:any)
  //  schema de validação => um formato para validar os dados dos formularios
  const newCicleFormValidationSchema = zod.object({
    // é uma string , min 1 caracter , msg de erro(segundo paramentro_)
    task: zod.string().min(1, 'Informe a tarefa'),
    // mé um numero , min 5  , max 60 , msg de erro
    minutesAmount: zod
      .number()
      .min(1, 'O ciclo precisa ser de no minimo 5 minutos')
      .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
  })

  // tipagem para o objeto data
  // interface NewCicleFormData {
  //   task: string
  //   minutesAmount: number
  // }

  // INFERIR : automatizando um processo de uma tipagem (substitui a interface acima) as duas formas estão corretas
  // zod.infer extrai a tipagem do form de dentro do schema de validação (zod.object) => INFERIR automaticamente para um type
  type NewCicleFormData = zod.infer<typeof newCicleFormValidationSchema> // (typeof) para passar o type e nao objeto javascript

  // metodos de validaçao useForm
  // formState informa os erros de validação (console.log(formState)).
  // reset => reseta inputs
  const { register, handleSubmit, watch /*, formState */, reset } =
    useForm<NewCicleFormData>({
      // para saber se é possivel usar generics em uma função, passe o mouse em cima (ex. UseForm) presisa ter "useForm<{..."
      // utiliza o resolver do zod (objeto de configuração, => resolver de validaçã)
      // passar via parametros o schema de validação => newCicleFormValidationSchema
      resolver: zodResolver(newCicleFormValidationSchema),

      // umas das opçoes para este objeto de configuração(useForm) => valor inicial de cada campo
      defaultValues: {
        task: '',
        minutesAmount: 0,
      },
    })

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
        min={1}
        disabled={!!activeCycle} // => se houver um ciclo ativo, nao liberar os inputs => !! para converter para true ou para false
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
