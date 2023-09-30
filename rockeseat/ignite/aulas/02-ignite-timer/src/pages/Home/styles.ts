import styled from 'styled-components'

export const HomeContainer = styled.main`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3.5rem;
  }
`

// como o boao de start e stop são parecidos criar um elementro em comum
export const /* StartCountdownButton */ BaseCountdownButton = styled.button`
    width: 100%;
    border: 0;
    padding: 1rem;
    border-radius: 8px;

    display: flex;
    justify-content: center;
    align-items: center;

    gap: 0.5rem;
    font-weight: bold;

    cursor: pointer;

    // cor do texto
    color: ${(props) => props.theme['gray-100']};

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      background: ${(props) => props.theme['green-700']};
    }
  `

// mudar stilos que tem relação com cores
export const StartCountdownButton = styled(BaseCountdownButton)`
  background: ${(props) => props.theme['green-500']};

  &:not(:disabled):hover {
    background: ${(props) => props.theme['green-700']};
  }
`
export const StopCountdownButton = styled(BaseCountdownButton)`
  background: ${(props) => props.theme['red-500']};

  &:not(:disabled):hover {
    background: ${(props) => props.theme['red-700']};
  }
`
