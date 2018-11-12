import gql from 'graphql-tag'

const resolvers = {
  Mutation: {
    addToCart: (_, {_id}, {cache, getCacheKey}) => {
      const query = gql`
      {
        cart @client {
          _id
          quantity
        }
      }
      `
      const previous = cache.readQuery({ query })
      const ids = previous.cart.map(({_id}) => _id)

      if (ids.includes(_id)) {
        const newArray = previous.cart.map((item) => {
          if (item._id === _id) {
            return {...item, ...{quantity: item.quantity++}}
          } else {
            return item
          }
        })
        cache.writeData({data: {cart: newArray}})
        return null
      } else {
        const newItem = {
          _id,
          quantity: 1,
          __typename: 'ItemInCart'
        }
        cache.writeData({data: {cart: previous.cart.concat([newItem])}})
        return null
      }
    }
  }
}

export default resolvers
