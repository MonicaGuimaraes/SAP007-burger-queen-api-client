import logo from '../../assets/Logo.svg'
import Buttons from '../../components/buttons'
import styles from './Home.module.css'
import { logoutUser, getPersistedUser } from '../../components/localStorage'
import { useNavigate } from 'react-router-dom'
import CarouselComponente from '../../components/carrossel'

export default function Home(){
  const navigateTo = useNavigate()
  
  const isUserAChef = getPersistedUser().role !== 'atendimento'

  async function logoutUserNav () {
    navigateTo('/')
    logoutUser()
  }

  return(
    <section className={styles.sectionHome}>
      <figure>
        <img className={styles.logo} src={logo} alt="logo" />
        <CarouselComponente/>
      </figure>
      <nav>
        {!isUserAChef? 
        <> 
          <Buttons disable={isUserAChef} type='false' onClick={() => navigateTo('/Menu') }>{'Cardápio e Carrinho'}</Buttons>
          <Buttons disable={isUserAChef} type='false' onClick={() => navigateTo('/order')}>{'Serviço'}</Buttons>
          <Buttons disable={isUserAChef} type='false' onClick={() => navigateTo('/finalized')}>{'Entregue'}</Buttons>    
        </> : <Buttons onClick={() => navigateTo('/order') }>{'Pedidos'}</Buttons>  }
        <button type='false' className={styles.buttonLogout} onClick={logoutUserNav}>{'Sair'}</button> 
      </nav>
    </section>
  )
}
