import React, { useState } from "react";
import useProducts from "../hooks/useProducts";
import { IProductDTO } from "../types/types";
import { Grid1 } from "../styles/Grids";
import {
  Modal,
  FormContainer,
  InputContainer,
  Label,
  Input,
  ButtonContainer,
} from "../styles/FormLayout";
import { Toaster } from "react-hot-toast";
import { ContentGrid, PageLayout, ProductContentBox } from "../styles/PageLayout";
import { Card2, Card2Breakline, Card2Details, Card2Title } from "../styles/Cards";
import { useAuth } from "../security/AuthProvider";

const Products: React.FC = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [newProduct, setNewProduct] = useState<Partial<IProductDTO>>({ name: "", price: 0, imageUrl: "" });
  const [editProduct, setEditProduct] = useState<Partial<IProductDTO> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { isLoggedInAs } = useAuth();

  const handleAddToCart = (productId: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[productId] > 1) {
        updatedCart[productId]--;
      } else {
        delete updatedCart[productId];
      }
      return updatedCart;
    });
  };

  const handleCreateProduct = async () => {
    await createProduct(newProduct);
    setNewProduct({ name: "", price: 0, imageUrl: "" });
  };

  const handleUpdateProduct = async () => {
    if (editProduct) {
      await updateProduct(editProduct);
      setEditProduct(null);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    await deleteProduct(productId);
    window.location.reload();
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewProduct({ name: "", price: 0, imageUrl: "" });
    setEditProduct(null);
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find((p) => p.id === parseInt(productId));
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <PageLayout>
      {isLoggedInAs(["ADMIN", "BAR", "USER"]) && (
        <button onClick={handleOpenModal} style={{
          position: 'fixed',
          top: '90px',
          left: '6%',
          transform: 'translateX(-50%)',
          backgroundColor: '#f9abab',
        }}>
          Create New Product
        </button>
      )}

      {/* Produkter */}
      <ContentGrid>
        <Toaster />
        <Grid1>
          {/* Mapping af produkter */}
          {products.map((product) => (
            <Card2 key={product.id}>
              {/* Produktinformation */}
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={(error) => console.error('Image failed to load:', error)}
              />
              <Card2Title>{product.name}</Card2Title>
              <Card2Details>{product.price} kr</Card2Details>
              <Card2Breakline />

              {/* Knapper til at håndtere produkter, kun synlig for manager og bar-medlemmer */}
              {isLoggedInAs(["ADMIN", "BAR"]) && (
                <>
                  <button onClick={() => handleAddToCart(product.id)}>Add to cart</button>
                  <button onClick={() => handleRemoveFromCart(product.id)}>Remove from cart</button>
                  <button onClick={() => { setEditProduct(product); handleOpenModal(); }}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </>
              )}
            </Card2>
          ))}
        </Grid1>

        {/* Kurven vises kun for manager og bar-medlemmer */}
        {isLoggedInAs(["ADMIN", "BAR", "USER"]) && (
          <ProductContentBox style={{
            position: 'fixed',
            top: '130px',
            right: '20px',
            padding: '20px',
          }}>
            <h2>Cart</h2>
            <div>
              {/* Visning af kurvindhold */}
              {Object.entries(cart).map(([productId, quantity]) => {
                const product = products.find((p) => p.id === parseInt(productId));
                return (
                  <div key={productId}>
                    <div><strong>{product?.name}</strong></div>
                    {product && (
                      <div> x {quantity} = {product.price * quantity} kr</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Totalen vises altid */}
            <h2>Total: {calculateTotal()} kr</h2>
          </ProductContentBox>
        )}

        {/* Modal for at oprette/redigere produkter, kun synlig for manager og bar-medlemmer */}
        {showModal && isLoggedInAs(["ADMIN", "USER", "BAR"]) && (
          <Modal>
            <FormContainer
              onSubmit={editProduct ? handleUpdateProduct : handleCreateProduct}
            >
              {/* Form til oprettelse/redigering af produkter */}
              <h2>{editProduct ? "Edit Product" : "Create Product"}</h2>

              <InputContainer>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={editProduct ? editProduct.name : newProduct.name}
                  onChange={(e) =>
                    editProduct
                      ? setEditProduct({
                          ...editProduct,
                          name: e.target.value,
                        })
                      : setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
              </InputContainer>
              <InputContainer>
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={editProduct ? editProduct.price : newProduct.price}
                  onChange={(e) =>
                    editProduct
                      ? setEditProduct({
                          ...editProduct,
                          price: parseFloat(e.target.value),
                        })
                      : setNewProduct({
                          ...newProduct,
                          price: parseFloat(e.target.value),
                        })
                  }
                  required
                />
              </InputContainer>
              <InputContainer>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={
                    editProduct ? editProduct.imageUrl : newProduct.imageUrl
                  }
                  onChange={(e) =>
                    editProduct
                      ? setEditProduct({
                          ...editProduct,
                          imageUrl: e.target.value,
                        })
                      : setNewProduct({
                          ...newProduct,
                          imageUrl: e.target.value,
                        })
                  }
                  required
                />
              </InputContainer>
              <ButtonContainer>
                <button type="submit">
                  {editProduct ? "Update" : "Create"}
                </button>
                <button type="button" onClick={handleCloseModal}>
                  Cancel
                </button>
              </ButtonContainer>
            </FormContainer>
          </Modal>
        )}
      </ContentGrid>
    </PageLayout>
  );
};

export default Products;
