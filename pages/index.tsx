import React, { useContext, useState } from "react"

type Product = {
  id: number
  category: string
  title: string
  description: string
  price: number
  rating: number
  stock: number
  brand: string
  images: string[]
  discountPercentage: number
}


function Products({ products }: { products: Product[] }) {

  return (<>
    <style jsx>{`
    .wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      justifyItems: 'center';
    }

    article {
      transition: all 0.6s;
      cursor: pointer;
    }

    article:hover {
      border: solid red !important
    }
      div div:nth-child(1) {
        color: blue;
        margin: auto;

      }

      div div:nth-child(2) {
        color: black
      }

      div div:nth-child(4) {
        color: black;
        padding: 5px 0 5px 0;
        display: block;
      }

      div div:nth-child(4) b:nth-child(1) {
        color: white;
        font-size: 23px;
        padding: 3px;
        background: black;
      }

      div div:nth-child(4) b:nth-child(2) {
        color: white;
        background: red;
        padding: 2px;
        font-size: 14px;
      }

      div div:nth-child(4) b::before {
        content: '$'
      }

      div div:nth-child(2) {
        color: gray;
      }

      div div:nth-child(6):hover {
        color: blue;
      }

      @media (max-width: 865px) {
        .wrapper {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 680px) {
        .wrapper {
          grid-template-columns: 1fr;
        }
      }

      @media (min-width: 1172px) {
        .wrapper {
          grid-template-columns: 1fr 1fr 1fr 1fr;
        }
      }

      @media (min-width: 1457px) {
        .wrapper {
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        }
      }
      `}</style>
    <div className="wrapper">
      {products.map((product) => {


        const { category, brand, description, id, images: img, price, rating, stock, title, discountPercentage } = product
        return (
          <article key={id} style={{
            border: 'solid lightblue',
            padding: '16px',
            margin: '16px',
            textAlign: 'center',
            display: 'grid',
            maxWidth: '300px'
          }}>
            <div>{title} <span>{brand}</span></div>
            <div>{description}</div>
            <img src={img[0]} alt={brand} style={
              {
                maxWidth: '200px',
                margin: 'auto',
                alignContent: 'revert'
              }
            }></img>
            <div><b>{price}</b><b>-{discountPercentage}%</b></div>
            <div>🌔 Rating: <b>{rating}</b> 📃 Stock:<b>{stock}</b> </div>
            <div>📌 Category <b>{category}</b> </div>

          </article>)
      })}
    </div></>)
}

type CustomFilter = {
  name: string
  label: string
  filter: (find: string | number, products: Product[]) => Product[]
  type: 'select' | 'checkbox' | 'range' | 'input'
  knownTypes?: string[]
  rangeTypes?: {
    min: number
    max: number
    step: number
    defaultValue: number
    placeholder: (value: string) => string
  }
}

type CurrentFilter = {
  name: CustomFilter['name']
  find?: string | number
}

const ProductContext = React.createContext({
  filters: [] as CurrentFilter[],
  setFilters: (_filter: CurrentFilter[]): void => {
    throw 'error'
  }
})






function ProductFilter({ filters: filtersProperties, products }: { filters: CustomFilter[], products: Product[] }) {

  const { filters, setFilters } = useContext(ProductContext)

  const updateFilter = (newFilter: CurrentFilter) => {

    const newFilters = newFilter.find !== 'none' ? [newFilter] : [] as CurrentFilter[]

    for (const eachFilter of filters) {
      if (eachFilter.name !== newFilter.name) {
        newFilters.push(eachFilter)
      }
    }

    setFilters(newFilters)
  }

  return (<>
    <style jsx>{`
    h1 {
      font-size: 21px;
      text-align: center;
      color: gray;
    }

    .uiBar {
      margin: auto;
      padding: 25px;
    }

    .uiBar label {
      padding: 5px
    }

    .filters {
      display: grid;
      grid-template-areas: "1fr 1fr"

      text-align: center;
    }

    .uiBar .filters select {
      background: lightblue;
    }

    .filter {
      padding: 7px;
    }
      `}</style>
    <h1>Products ({products.length})</h1>
    <div className="uiBar">
      <div className="filters">
        {
          filtersProperties.map((each) => <>
            {each.type === 'select' ? (<div className="filter">
              <label htmlFor={each.name}>{each.label}</label>
              <select id={each.name} name={each.name} onChange={(event) => {
                const value = event.target.value

                updateFilter({
                  name: each.name,
                  find: value.toLowerCase() === 'none' ? 'none' : value
                })
              }}>
                {
                  each.knownTypes?.map((each) =>
                    <option value={each}>{(each[0].toLocaleUpperCase() + each.substring(1))}</option>
                  )
                }
              </select>
            </div>

            ) : each.type === 'checkbox' ? (
              <div className="filter">
                <input name={each.name} type={"checkbox"} onClick={() => {
                  updateFilter({
                    name: each.name
                  })
                }} />
                <label htmlFor={each.name}>{each.label}</label>
              </div>
            ) : each.type === 'range' ? (
              <div className="filter">
                <input name={each.name} step={each.rangeTypes?.step} min={each.rangeTypes?.min} defaultValue={each.rangeTypes?.defaultValue} max={each.rangeTypes?.max} type={"range"} onChange={(event) => {
                  updateFilter({
                    name: each.name,
                    find: event.target.value
                  })

                  const element = document.getElementById(each.name)

                  element && (element.textContent = each.rangeTypes?.placeholder(event.target.value) ?? 'null')
                }}/>
                <label htmlFor={each.name}>{each.label}<b id={each.name}>?</b></label>
              </div>
            ) : each.type === 'input' ? (
              <div className="filter">
              <input name={each.name}type={"text"} onChange={(event) => {
                  updateFilter({
                    name: each.name,
                    find: event.target.value
                  })
              }}></input>
              <label htmlFor={each.name}>{each.label}</label>
              </div>
            ) : (<></>)}

          </>)
        }
      </div>
    </div>
  </>
  )
}

function productFilter(products: Product[]) {
  const products_categories = products.reduce((array, each) => {

    const { category } = each

    for (const aEach of array) {
      if (aEach === category) {
        return array
      }
    }

    array.push(each.category)

    return array
  }, [] as Product['category'][])

  const products_brand = products.reduce((array, each) => {

    const { brand } = each

    for (const aEach of array) {
      if (aEach === brand) {
        return array
      }
    }

    array.push(each.brand)

    return array
  }, [] as Product['brand'][])

  const products_price_range = products.reduce((array, product) => {
    array.push(product.price)

    return array
  }, [] as number[]).sort((a, b) => a-b)

  const products_stock_range = products.reduce((array, product) => {
    array.push(product.stock)

    return array
  }, [] as number[]).sort((a, b) => a-b)



  return [
    {
      name: 'category',
      label: 'Categories',
      filter: (find, products) => products.filter((each) => {
        if (find === each.category) {
          return find
        }
      }),
      knownTypes: ['none', ...products_categories],
      type: 'select'
    },
    {
      name: 'brand',
      label: 'Brand',
      filter: (find, products) => products.filter((each) => {
        if (find === each.brand) {
          return find
        }
      }),
      knownTypes: ['none', ...products_brand],
      type: 'select'
    },
    {
      name: 'discount',
      label: 'Discount',
      filter: (find, products) => products.filter((each) => {
        if (each.discountPercentage > 0) {
          return each
        }
      }),
      knownTypes: ['none', ...products_brand],
      type: 'checkbox'
    },
    {
      name: 'price',
      label: 'Price',
      filter: (find, products) => products.filter((each) => {
        if (each.price <= find) {
          return each
        }
      }),
      rangeTypes: {
        step: 1,
        defaultValue: products_price_range.at(-1) ?? 1,
        max: products_price_range.at(-1) ?? 1,
        min: products_price_range.at(0) ?? 0,
        placeholder: (value) => `$ ${value}`
      },
      type: 'range'
    },
    {
      name: 'rating',
      label: 'Rating',
      filter: (find, products) => products.filter((each) => {
        if (each.rating >= find) {
          return each
        }
      }),
      rangeTypes: {
        step: 0.1,
        defaultValue: 1,
        max: 5,
        min: 1,
        placeholder: (value) => value
      },
      type: 'range'
    },
    {
      name: 'stock',
      label: 'Stock',
      filter: (find, products) => products.filter((each) => {
        if (each.stock >= find) {
          return each
        }
      }),
      rangeTypes: {
        step: 1,
        defaultValue: 1,
        max: products_stock_range.at(-1),
        min: 1,
        placeholder: (value) => value
      },
      type: 'range'
    },
    {
      name: 'search',
      label: 'Search',
      filter: (find, products) => products.filter((each) => {
        const productSearch = (each.title + each.description).toLocaleLowerCase()

        if (productSearch.includes((find as string).toLowerCase())) {
          return each
        }
      }),
      type: 'input'
    }
  ] as CustomFilter[]
}



export default function Home({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState([] as CurrentFilter[])

  const filterProperties = productFilter(products)

  let resultProducts = [...products]

  for (const filter of filters) {

    for (const customFilter of filterProperties) {
      if (filter.name === customFilter.name) {
        resultProducts = customFilter.filter(filter.find ?? '', resultProducts)
        break
      }
    }

  }

  return (<>
    <style jsx>{`
    .wrapper_filter {
      margin: 5%;
      border: gray solid 1px;
      border-radius: 15px
    }

      `}</style>

    <ProductContext.Provider value={{ filters, setFilters }}>
      <div className="wrapper_filter">
        <ProductFilter filters={filterProperties} products={resultProducts} />
        <Products products={resultProducts} />
      </div>
    </ProductContext.Provider>
  </>)
}


export async function getStaticProps() {
  const json = await fetch('https://dummyjson.com/products?limit=100').then((res) => res.json())
  return { props: json }
}