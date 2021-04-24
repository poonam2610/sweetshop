import React, { useEffect, useState } from "react";
import "./ProductDetails.scss";
import * as data from "../../data/data.json";
import { useParams } from "react-router";
import SizeOptions from "./SizeOptions";
import AddToBagButton from "./AddToBagButton";
import Quantity from "./Quantity";
import { useStateValue } from "../../context-management/StateProvider";
import { ACTIONS } from "../../context-management/constants";
import StarRating from "../../helper-components/Star-rating/StarRating";
import Modal from "../Modal/Modal";
import Carousel from "../../helper-components/Carousel/Carousel";
import SimilarProducts from "../SimilarProducts/SimilarProducts";
import AlertBox from "../../helper-components/AlertBox/AlertBox";


function ProductDetails() {
  const [product, setProduct] = useState({ image: ["", ""] });
  const [size, setSize] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { id } = useParams();
  const [isLoginClicked, setIsLoginClicked] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [{ user }, dispatch] = useStateValue();
  const [isProductAdded , setIsProductAdded] = useState(false)

  useEffect(() => {
    const filteredProduct = data.default.filter(
      (value) => value.id === parseInt(id)
    );
    const prod = Object.assign({}, filteredProduct[0]);
    setProduct(prod);
  }, [id]);

  useEffect(() => {
    if (size) {
      setErrorMessage("");
    }
  }, [size]);

  const handleClick = () => {
    if (!!user) {
      if (product.category === "accessories") {
        setErrorMessage("");
        setIsProductAdded(true)
        setTimeout(()=>{ setIsProductAdded(false)}, 2000)
        for (let i = 0; i < itemQuantity; i++) {
          dispatch({
            type: ACTIONS.ADD_TO_BASKET,
            item: {
              id: id,
              image: product.image,
              title: product.title,
              price: product.price,
              rating: product.rating,
              category: product.category,
              size: "M",
            },
          });
        }
      } else if (!size) {
        setErrorMessage("Please Select Size");
      } else {
        setIsProductAdded(true)
        setTimeout(()=>{ setIsProductAdded(false)}, 2000)
        for (let i = 0; i < itemQuantity; i++) {
          dispatch({
            type: ACTIONS.ADD_TO_BASKET,
            item: {
              id: id,
              image: product.image,
              title: product.title,
              price: product.price,
              rating: product.rating,
              category: product.category,
              size: size,
            },
          });
        }

      }
    } else {
      setIsLoginClicked(true);
    }
  };
  return (
    <>
      <div className="alertbox" style ={isProductAdded? {transform : "translateY(30vh)",transition: "all 0.7s ease"}: {transform : "translateY(-1000px)"}}>
        <AlertBox product = {product} message = {"Added to bag!"}/>
      </div>
      <div className="productDisplayContainer">
        <div className="productImage">
          <Carousel arrayOfImagesUrl={product.image}></Carousel>
        </div>
        <div className="productDetail">
          <div className="product__description">
            <h3>{product.title}</h3>
            <p>
              Description lorem ipsum is good when you dont know what to write
              and want to fill the area with some text.
            </p>
            <hr />

            <div className="rating__container">
              <StarRating rating={product.rating} />
            </div>
            <p className="price">{`Rs ${product.price}`}</p>
          </div>

          {product.category !== "accessories" && (
            <SizeOptions sizes={product?.availableSize} setSize={setSize} />
          )}
          <Quantity
            itemQuantity={itemQuantity}
            setItemQuantity={setItemQuantity}
          />
          <div id="addItemToBag">
            <AddToBagButton content="ADD TO BAG" handleClick={handleClick} />
          </div>
          {!!errorMessage && (
            <div className="error__message">{errorMessage}</div>
          )}
        </div>
      </div>
      {isLoginClicked && (
        <Modal type="productDetails" setIsModalOpen={setIsLoginClicked} />
      )}
      <SimilarProducts category = {product.category} id = {product.id}></SimilarProducts>
    </>
  );
}

export default ProductDetails;
