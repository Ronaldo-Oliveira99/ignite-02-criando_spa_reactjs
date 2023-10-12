import { HandPalm, Play } from 'phosphor-react'
import { useContext } from 'react'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'

// intergra bibiliotecas hook de forms com bibliotecas de validação (zod)
import { zodResolver } from '@hookform/resolvers/zod'
// bibilioteca de validação ( tem typescript)
// * as quando nao tem (export default) na biblioteca => importa tudo (*)
import * as zod from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { Countdown } from './components/Countdown'
import { CyclesContext } from '../../contexts/CyclesContext'

//  as CyclesContextType => qunado for chamado no <CyclesContext.Provider> vai dar a sugestão de activeCycle =>  value={{ activeCycle }}

// zod.Object => formato objeto => data:any => de handleCreateNewCycle(data:any)
//  schema de validação => um formato para validar os dados dos formularios (tipagem)
const newCicleFormValidationSchema = zod.object({
  // é uma string , min 1 caracter , msg de erro(segundo paramentro_)
  task: zod.string().min(1, 'Informe a tarefa'),
  // mé um numero , min 5  , max 60 , msg de erro
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no minimo 5 minutos')
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

export function Home() {
  const { createNewCycle, interruptCurrentCycle, activeCycle } =
    useContext(CyclesContext)
  // metodos de validaçao useForm
  // formState informa os erros de validação (console.log(formState)).
  // reset => reseta inputs

  const newCycleForm = useForm<NewCicleFormData>({
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

  const { /*  register,  */ handleSubmit, watch /*, formState */, reset } =
    newCycleForm

  // **formState tem um atributo para erros de validação
  // **retorna erros de validação
  // **console.log(formState.errors)
  // evento de form submit

  // criacao de uma nova funcao para event para chamar o reset do  hooks form
  function handlecreateNewCycle(data: NewCicleFormData) {
    createNewCycle(data)
    reset()
  }

  // fica observando task => taskInput
  const task = watch('task')
  const isSubmitDisabled = !task

  /*
   * Props Drillng => Quando tem MUITAS propriedades APENAS para comunicação entre componentes
   * Context API => Permite compartilharmos informações entre VARIOS componentes ao mesmo tempo
   *
   */
  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handlecreateNewCycle)}>
        {/* passando as variaveis via contexto CyclesContext.Provider */}

        {/* enviar o register atraves de provider 'FormProvider' para o componente NewCycleForm */}
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {/* criação de botão (StopCountdownButton) para interromper um ciclo */}
        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
