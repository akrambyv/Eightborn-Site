import { useEffect, useState } from 'react'
import Main from './components/Main/Main'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout/Layout'
import MainCategory from './components/Main/MainCategory'
import Login from './components/Main/Login'
import Register from './components/Main/Register'
import Cart from './components/Header/Cart'
import ProductDetail from './components/Main/ProductDetail'
import Error from './components/Error'

function App() {

  const [data, setData] = useState(null)

  useEffect(() => {
    fetch("/data/data.json")
      .then(res => res.json())
      .then(item => setData(item))
  }, [])


  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Main />} />
          <Route path='/ust-giyim' element={<MainCategory products={data?.products} />} />
          <Route path='/ust-giyim/:category' element={<MainCategory products={data?.products} />} />
          <Route path='/account/login' element={<Login />} />
          <Route path='/account/register' element={<Register />} />
          <Route path="/:category/:product" element={<ProductDetail />} />
          <Route path='/cart' element={<Cart />} />
        </Route>

        <Route path='*' element={<Error />} />
      </Routes>
    </>
  )
}

export default App