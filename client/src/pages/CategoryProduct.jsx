import React,{useEffect,useState} from 'react'
import {useParams,Link,useLocation} from 'react-router-dom'
import {Checkbox,Radio} from 'antd'
import {FaAngleLeft,FaAngleRight} from 'react-icons/fa'
import Card from '../components/Layout/Card.jsx'
import {prices} from './../components/prices.js'
import toast from 'react-hot-toast'
import axios from 'axios'
import Layout from '../components/Layout/Layout'

const CategoryProduct = () => {
   const [category,setCategory]=useState('')
   const [loading,setLoading]=useState(true)
   const [totalProducts,setTotalProducts]=useState(null)
   const location=useLocation()
   const perPage=3;
   const [brands,setBrands]=useState([])
   const [brandFilters,setBrandFilters]=useState([])
   const [priceFilters,setPriceFilters]=useState([0,100000])
   const [subcategoryFilters,setSubCategoryFilters]=useState([])
   const [products,setProducts]=useState([])
   const [currentPage,setCurrentPage]=useState(1)
    const [totalPages,setTotalPages]=useState(null)
   const params=useParams()
   const getCategory=async()=>{
    try{
      setLoading(true)
       const {data}=await axios.get(`http://localhost:5000/api/categories/get-category/${params.slug}`)
       if(data.success)
       {
          setCategory(data.category)
       }
       else{
        toast.error(data.message)
       }
       setLoading(false)
    }
    catch(error)
    {
       toast.error('Something went wrong')
    }
   }

   const getAllCategoryProducts=async()=>{
    try{
      setLoading(true)
       const {data}=await axios.get(`http://localhost:5000/api/products/get-products-by-category-paginated/${params.slug}`,{
        params:{
          perPage:perPage,
          currentPage:currentPage
        }
       })
      //  console.log(data)
       if(data.success)
       {
           setProducts(data.products)
       }
       else
       {
        toast.error(data.message)
       }
       setLoading(false)
    }catch(error)
    {
        toast.error('Something went wrong')
    }
   }

    const getAllBrands=async()=>{
    try{
      const {data}=await axios.get('http://localhost:5000/api/brands/get-all-brands')
      if(data.success)
      setBrands(data.brands)
    }catch(error)
    {

    }
  }

  const getFilterProducts=async()=>{
    try{
      setLoading(true)
       const {data}=await axios.get('http://localhost:5000/api/products/get-all-products-based-on-category-filters',
       {
        params:{
         priceFilters:JSON.stringify(priceFilters),
         slug:params.slug,
         subcategoryFilters:JSON.stringify(subcategoryFilters),
         brandFilters:JSON.stringify(brandFilters)
        }
       })
       if(data.success)
       setProducts(data.products)
       setLoading(false)
    }
    catch(error)
    {
        toast.error('Something went wrong')
    }
  }

  const getTotalProducts=async()=>{
    try{
      
      const {data}=await axios.get(`http://localhost:5000/api/products/get-total-products-in-category-page/${params.slug}`)
      if(data.success)
      {
        setTotalProducts(data.count)
        
      }
      
    }catch(error)
    {
      toast.error('Something went wrong')
    }
   }


   const handleFilterBrand = (value, id) => {
    let all = [...brandFilters];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setBrandFilters(all);
  };

  const handleFilterSubCategory = (value, subcategory_name) => {
    let allSubcat = [...subcategoryFilters];
    if (value) {
      allSubcat.push(subcategory_name);
    } else {
      allSubcat = allSubcat.filter((c) => c!== subcategory_name);
    }
    setSubCategoryFilters(allSubcat);
  };

   const handleForward=()=>{
       if(currentPage===totalPages)
       setCurrentPage(1)
       else
       setCurrentPage((page)=>page+1)
   }

   const handleBackward=()=>{
       if(currentPage===1)
       setCurrentPage(totalPages)
       else
       setCurrentPage((page)=>page-1)
   }

   useEffect(()=>{
    getCategory()
    getAllCategoryProducts()
    getAllBrands()
   },[params.slug])

   useEffect(() => {
      getAllCategoryProducts()
    },[currentPage]);

   useEffect(()=>{
        getFilterProducts()
   },[priceFilters,brandFilters,subcategoryFilters])

 useEffect(()=>{
      getTotalProducts()
    },[products])

    useEffect(()=>{
       setTotalPages(Math.ceil(totalProducts/perPage))
    },[totalProducts])

    // useEffect(()=>{
    //   console.log(totalPages)
    // },[totalPages])

  return (
    <Layout title={'Products by category'}>
        <div className="row m-2">
            <div className="col-md-2 text-left p-3 bg-light">
                <h1>Filters</h1>
                {loading?<h3>Loading...</h3>:(
                <div className="cont">
                    <h4 className="text-black">{category.category_name}</h4> 
                    <div className="p-1">
                       {category && category.subcategories.map((subcat,index)=>(
                       <div key={index}>
                        <Link to={`/subcategory/${category.slug}/${subcat.subcategory_id}`} className="text-decoration-none text-secondary">
                            <p>{subcat.subcategory_name}</p>
                        </Link>
                        </div>
                       ))}
                    </div>
                </div>
                )} 

                 <div className="cont">
                  <h3>BrandFilters</h3>
                   {brands?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilterBrand(e.target.checked,c._id)}
              >
                {c.brand_name}
              </Checkbox>
            ))}

                 </div>

                  <div className="cont">
                  <h3>SubCategoryFilters</h3>
                   {category.subcategories?.map((subcat) => (
              <Checkbox
                key={subcat._id}
                onChange={(e) => handleFilterSubCategory(e.target.checked,subcat.subcategory_name)}
              >
                {subcat.subcategory_name}
              </Checkbox>
            ))}

                 </div>


                
                <div className="cont">
                  <h3>Price Filters</h3>
                  <Radio.Group>
                   {prices.map((price,index)=>(
                    <div key={index}>
                      <Radio key={index} value={price.array} onChange={(e)=>setPriceFilters(e.target.value)}
                      > <span className="h6 text-black">{price.name}</span>
                      </Radio>
                    </div>
                   ))}
                   </Radio.Group>
                </div>

                <button type="button" className="btn btn-success" onClick={()=>{
                  window.location.href = window.location.pathname;
                }}>
                      Reset Filters
                </button>
            </div>

            <div className="col-md-10 text-left">
           
                <h1>Products</h1>  
                <div className="row no-gutters">
                 {!loading && products.length!==0 && products.map((product,index)=>(
                       <>
                          <div className="col-md-3">
                            <Card {...product}/>
                          </div>
                       </>
                 ))
                  }
                  </div>

                  <br></br>
                  <br></br>
                  
                 {!loading?(
                  <>
                  <div className="pagination-container" style={{textAlign:"center"}}>
        <button type="button" className="btn btn-success"
        onClick={handleBackward}>
            <span style={{textAlign:"center",alignItems:"center"}}><FaAngleLeft/></span>
        </button>
         
           
            {Array.from(Array(totalPages), (_, index) => (
            <button
            key={index}
            type="button"
            className={`btn ${index + 1 === currentPage ? 'btn-primary' : 'btn-secondary'}`}
            style={{ margin: '3px' }}
            onClick={() => setCurrentPage(index + 1)}
             >
              {index + 1}
            </button>
            ))}

         <button type="button" className="btn btn-success"
         onClick={handleForward}>
          <span style={{textAlign:"center",alignItems:"center"}}><FaAngleRight/></span>
         </button>
      </div>
      </>):''}

      <br></br>
       <br></br>
        
                  

                  
            </div>
        </div>
    </Layout>
  )
}

export default CategoryProduct