import Inputs from '../../components/inputs'
import Buttons from '../../components/buttons'
import { useState } from 'react'
import { registerAPI } from '../../API/RegisterAPI'
import HandlingApiStatus from '../../components/handlingApiStatus'
import styles from './register.module.css';
import logo from '../../assets/Logo.svg'
import {
    Link,
    Navigate,
  } from "react-router-dom";

export default function Register(){
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [showElement, setShowElement] = useState(false)
  const [responseAPI, setResponseAPI] = useState('')
  const [navigate, setNavigate] = useState(false)
  const REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const minPwdLength = 6
  const minNameLength = 2 
  
  function onSubmitForm(e) {
    e.preventDefault()

    const object = {
      email,
      name,
      role,
      password, 
    }

    registerAPI(object).then((response) => {
      const hasError = response.code
      let message = ''
      let show = false
      let navigateLogin = false
      let time = 0

      if(hasError){
        message = response.message;
        show = true
        time = 10000
      }

      if(!hasError){
        navigateLogin = true
        message = 'successRegister'
        time = 3000
        show = true
      }

      setResponseAPI(message)
      setShowElement(show)
      setTimeout(() => {
        setShowElement(false)
        setNavigate(navigateLogin)
      }, time)

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
      <img className={styles.LogoImg} src={logo} alt='logo'/>
      <form onSubmit={onSubmitForm} className={styles.FormLogin}>
        { showElement ? <HandlingApiStatus message={responseAPI}/> : null }   
        <h1>Registro</h1>
        <Inputs type='text' placeholder='Nome' autoComplete='off' required value={name} onChange={(e) => setName(e.target.value)} />
        <Inputs type='email' placeholder='Email' autoComplete='off' required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Inputs type='password' placeholder='Senha' autoComplete='current-password' required value={password} onChange={(e) => setPassword(e.target.value)} />
        <label>Selecione um cargo:
          <select className={styles.select} data-testid={'select'} defaultValue='cargo' placeholder='Cargo' onChange={(e) => setRole(e.target.value)}>
            <option value='cargo' disabled hidden>Cargo</option>
            <option value='atendimento'>Atendimento</option>
            <option value='cozinha'>Cozinha</option>
          </select>
        </label>
        <Buttons type='submit' disabled={!REGEX_EMAIL.test(email) || password.length < minPwdLength || name.length < minNameLength || role == null } >{'Cadastrar'}</Buttons>
        <p className={styles.register}>Tem uma conta? <Link className={styles.link} to="/">Vá para o Login</Link></p>
      </form>
      { navigate ? <Navigate to="/" /> : null }
    </section>    
  )
}