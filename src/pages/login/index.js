import Inputs from '../../components/inputs'
import Buttons from '../../components/buttons'
import { loginAPI } from '../../API/LoginAPI'
import { useState } from "react"
import HandlingApiStatus from '../../components/handlingApiStatus'
import styles from './login.module.css'
import logo from '../../assets/Logo.svg'
import { setUserLocalStorage } from '../../components/localStorage'
import {
  Link,
  Navigate
} from "react-router-dom"

export default function Login(){

  const REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const minPwdLength = 6
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [showElement, setShowElement] = useState(false)
  const [responseAPI, setResponseAPI] = useState('')
  const [navigate, setNavigate] = useState(false)

  function onSubmitForm(e) {
    e.preventDefault()
    loginAPI(email, password).then((response) => {
      const hasError = response.code
      let message = ''
      let show = false
      let navigateHome = false
      let user = ''

      if(hasError){
        message = response.message;
        show = true
      }

      setResponseAPI(message)
      setShowElement(show)
      setTimeout(() => {
        setShowElement(false)
      }, 10000)

      if(!hasError){
        navigateHome = true
        user = response
      }

      setUserLocalStorage(user)
      setNavigate(navigateHome)
    }).catch(()=> {
      setResponseAPI('')
      setShowElement(true)
      setTimeout(() => {
        setShowElement(false)
      }, 10000)
    })
  }
    
  return(
    <section className={styles.SectionLogin}>
      { navigate ? <Navigate to="/home" /> : null }
      <img className={styles.LogoImgLogin} src={logo} alt="logo"/>
      <form onSubmit={onSubmitForm} className={styles.FormLogin}>
      { showElement ? <HandlingApiStatus message={responseAPI} /> : null }   
        <h1>Login</h1>
        <Inputs 
          type='email' 
          placeholder='seuemail@email.com' 
          autoComplete='username' 
          required 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          />
        <Inputs type='password' placeholder='Senha' autoComplete='current-password' required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Buttons type='submit' disabled={!REGEX_EMAIL.test(email) || password.length < minPwdLength}>{'Entrar'}</Buttons>
        <p className={styles.register}>Não tem uma conta? <Link className={styles.link} to="/register">Cadastre-se</Link></p>
      </form>
    </section>       
  )
}
