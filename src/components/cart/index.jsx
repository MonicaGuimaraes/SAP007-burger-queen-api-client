import Vector from '../../assets/Vector.svg'
import Inputs from '../inputs'
import { useState, useEffect } from 'react'
import styles from './Cart.module.css'
import ProductsCart from '../productsCart'
import { createOrderAPI } from '../../API/CreateOrder'
import { deleteItemFromCart, removeProductFromCart, addProductToCart, sumTotalPrice } from '../functions/changesOnCart'
import HandlingApiStatus from '../handlingApiStatus'


export default function Cart({arrList, setArrList}) {
  const [name, setName] = useState('')
  const [total, setTotal] = useState(0)
  const [table, setTable] = useState(1)
  const [responseAPI, setResponseAPI] = useState('')
  const [showElement, setShowElement] = useState(false)
  const [classButton, setClassButton] = useState("false")
 
  function closeAndOpen(){
    setClassButton(!classButton)
  }

  useEffect(()=>{ 
    setTotal(sumTotalPrice(arrList))
  }, [total, arrList])

  function sendOrder(e){
    e.preventDefault()

    const list = arrList.map((product) => {
       return {id: product.id, qtd: product.qtd}
    })

    const obj = {
      inputName: name,
      inputTable: table,
      arrProducts: list,
    }
  
    createOrderAPI(obj)
    .then((response) => {
      const hasError = response.code
      let message = ''
      let show = false
      let resetName = name
      let resetTotal = total
      let resetTable = table
      let resetArrList = arrList

      if(hasError){
        message = response.message;
        show = true
      } else {
        show = true
        message = 'successOrder'
        resetName = ''
        resetTable = 1
        resetTotal = 0
        resetArrList = []
      }

      setResponseAPI(message)
      setShowElement(show)
      setTimeout(() => {
        setShowElement(false)
      }, 5000)

      setArrList(resetArrList)
      setName(resetName)
      setTable(resetTable)
      setTotal(resetTotal)
    }).catch(()=> {
      setResponseAPI('')
      setShowElement(true)
      setTimeout(() => {
        setShowElement(false)
      }, 10000)
    })
  }

  return (
  <> 
    <section 
    className={classButton ? styles.sectionClosed : styles.sectionOpen}> 
    {showElement ? <HandlingApiStatus message={responseAPI}/> : null}
      <div className={styles.DivbuttonOpenAndClosed}>
        <button 
        className={styles.buttonOpenAndClosed} 
        onClick={closeAndOpen}>
          <img 
          className={styles.ImgOpenAndClosed} 
          src={Vector} 
          alt="CloseAndOpenCart" />
        </button>
        <p className={styles.qtdProducts}>Adicionados:  {arrList.length}</p>
      </div>
      <div className={styles.divCart}>
        <ul className={styles.ulProducts}>
          { arrList.length !== 0 ? arrList.map((product, index) => {
              return ( 
              <ProductsCart
              product={product}
              key={index}
              dataId={index}
              onClickPlus={() => setArrList(addProductToCart(arrList, product))}
              qtd={product.qtd}
              onClickLess={() => setArrList(removeProductFromCart(arrList, product))}
              onclickTrash={() => setArrList(deleteItemFromCart(arrList, product.id))}/>   
            )}) 
            :
            <p className={styles.paragraph}>Ainda não tem nada no carrinho!</p> 
          }
        </ul>
        <form className={styles.formCart}>
          <label className={styles.DivName}>Nome do Cliente
            <Inputs 
              className={styles.InputName} 
              maxLength='20' 
              type='text' 
              placeholder='Cliente' 
              required 
              autoComplete='off' 
              value={name} 
              onChange={(e) => setName(e.target.value.trim())} 
            />
          </label>
          <label className={styles.DivName}>Número Mesa
            <Inputs className={styles.InputName} 
              required 
              max='10' 
              min='1' 
              type='number' 
              placeholder='Mesa' 
              autoComplete='off' 
              value={table} 
              onChange={(e) => setTable(e.target.value)} 
            />
          </label>
          <div className={styles.TotalDiv} >
            <p>Total:{total.toFixed(2)}</p>
            <button disabled={name.length === 0 || arrList.length === 0} className={styles.BntPronto} onClick={sendOrder}>
              Pronto
            </button>
          </div>
        </form>
      </div>
    </section>
  </>
  )
}