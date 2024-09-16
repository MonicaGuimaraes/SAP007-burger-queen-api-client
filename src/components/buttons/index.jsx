import styles from './buttons.module.css'
export default function Buttons({disabled, children, onClick, type}){
   return(
      <button disabled={disabled} onClick={onClick} type={type} className={styles.Buttons}>{children}</button>
   )
}
