import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'

const CREATE_PRODUCT = gql`
mutation CreateProduct($name: String, $price: Int, $category: String, $tags: [String], $image: String, $headline: String, $description: String, $inventory: Int , $instock: Boolean, $featured: Boolean) {
  createProduct(name: $name, price: $price, category: $category, tags: $tags, image: $image, headline: $headline, description: $description, inventory: $inventory , instock: $instock, featured: $featured) {
    _id
  }
}
`
const GET_CATEGORIES = gql`{
  categories {
    _id
    category
  }
}`

class Admin extends React.Component {
  componentWillMount() {
    if (!localStorage["TestApp.token"]) {
      this.props.history.push("/admin/login")
    }
  }

  state = {
    name: "",
    price: "",
    category: "",
    tags: "",
    headline: "",
    inventory: "",
    featured: false,
    instock: true,
    description: "",
    image: false,
    errMsg: false
  }


  onChange = e => {
    // e.target.value = e.target.value.trim();
    this.setState({ [e.target.name]: e.target.value, errMsg: false });
  }

  randomImage = () => {
    this.setState({image: `https://picsum.photos/260/200?image=${Math.floor(Math.random() * 1000)}`, errMsg: false })
  }

  render() {
    const {name, price, category, tags, headline, inventory, featured, instock, description, image} = this.state

    return (
      <div className="pv4 w-100 flex justify-center items-start f6">

        <div className="w-30 dib pr4">
          <div className="w-100 ba b--black-10 bg-white">
            <p className="dim pointer flex justify-between items-center pa3 bb b--black-05 mv0 red">Add Product <ion-icon name="arrow-dropright" size="small"></ion-icon></p>
            <p className="dim pointer flex justify-between items-center pa3 bb b--black-05 mv0">Manage Categories</p>
            <p className="dim pointer flex justify-between items-center pa3 bb b--black-05 mv0">Orders</p>
            <p className="dim pointer flex justify-between items-center pa3 bb b--black-05 mv0">Users</p>
          </div>
        </div>

        <div className="w-70 dib bg-white pa4 ba b--black-10">

          <Mutation mutation={CREATE_PRODUCT}>
            {(triggerCreateProduct, {data, loading, error}) => (
              <form className="w-60 dib v-top gray" onSubmit={async e => {
                e.preventDefault()

                if (!name) { this.setState({errMsg: "Name field is required"}); return false; }
                if (!price) { this.setState({errMsg: "Price field is required"}); return false; }
                if (!category) { this.setState({errMsg: "Category field is required"}); return false; }
                if (!image) { this.setState({errMsg: "An Image is required"}); return false; }

                const {data: {createProduct}} = await triggerCreateProduct({
                  variables: {name, price: Number(price), category, image, tags, headline, inventory: Number(inventory), featured: Boolean(featured), instock: Boolean(instock), description}
                })
                this.props.history.push(`/productdetail/${createProduct._id}`)
              }}>
                <div className="w-100 flex justify-between items-center">
                  <p className="w-25">Name*</p>
                  <input name="name" value={name} onChange={this.onChange} className="w-75 reset-input ba b--black-10 pa2"/>
                </div>
                <div className="w-100 flex justify-between items-center">
                  <p className="w-25">Price*</p>
                  <input name="price" value={price} onChange={this.onChange} className="w-75 reset-input ba b--black-10 pa2"/>
                </div>
                <div className="w-100 flex justify-between items-center">
                  <p className="w-25">Category*</p>
                  <select name="category" value={category} onChange={this.onChange} className="w-75 reset-input ba b--black-10 pa2 h2 bg-white">
                    <option value="default">Select</option>
                    <Query query={GET_CATEGORIES}>
                      {({ loading, error, data }) => {
                        if (data.categories) {
                          return data.categories.map((item) => (
                            <option key={item._id} value={item.category}>{item.category}</option>
                          ))
                        } else {
                          return null
                        }
                      }}
                    </Query>
                  </select>
                </div>
                <div className="w-100 flex justify-between items-center">
                  <p className="w-25">Tags</p>
                  <input name="tags" value={tags} onChange={this.onChange} className="w-75 reset-input ba b--black-10 pa2"/>
                </div>
                <div className="w-100 flex justify-between items-center">
                  <p className="w-25">Headline</p>
                  <input name="headline" value={headline} onChange={this.onChange} className="w-75 reset-input ba b--black-10 pa2"/>
                </div>
                <div className="w-100 flex justify-between items-center">
                  <p className="w-25">Inventory</p>
                  <input name="inventory" value={inventory} onChange={this.onChange} className="w-75 reset-input ba b--black-10 pa2"/>
                </div>
                <div className="w-100 flex justify-between items-center">
                  <p className="w-25">Featured</p>
                  <select name="featured" value={featured} onChange={this.onChange} className="w-75 reset-input ba b--black-10 pa2 h2 bg-white">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="w-100 flex justify-between items-center">
                  <p className="w-25">In Stock</p>
                  <select name="instock" value={instock} onChange={this.onChange} className="w-75 reset-input ba b--black-10 pa2 h2 bg-white">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="w-100 flex justify-between items-center pt1">
                  <p className="w-25">Description</p>
                  <textarea name="description" value={description} onChange={this.onChange} className="w-75 reset-input ba b--black-10 pa2"/>
                </div>
                <div className="w-100 tc">
                  <button className="w5 bg-light-red pa2 reset-button bw0 mt4 white pointer dim" type="submit" disabled={loading}>{loading ? "Processing..." : "SAVE"}</button>
                </div>
                {error && <p className="tc red f6">{error.graphQLErrors.map(({ message }, i) => (
                  <span key={i}>{message}</span>
                ))}</p>}
                {this.state.errMsg && <p className="red mt3 tc f6">{this.state.errMsg}</p>}
              </form>

            )}
          </Mutation>

          <div className="w-40 pl4 dib">
            <div className="w-100 h5 bg-near-white flex justify-center items-center flex-column light-red pointer" onClick={this.randomImage}>
              {image ? (
                <img className="w-100 h-100 obj-cover" src={image} alt="" onError={e => {this.setState({image: false})}} />
              ) : (
                <React.Fragment>
                  <ion-icon name="images" size="large"></ion-icon>
                  <p className="gray mv1">Click to upload picture*</p>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Admin
