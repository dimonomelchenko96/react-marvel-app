import img from './error.gif'

const ErrorMessage = () => {
  return (
    <img style={{display: 'block', objectFit: 'contain',margin: '0 auto',width: '250px', height: '250px'}} src={img} alt="error" />
  )
}

export default ErrorMessage;