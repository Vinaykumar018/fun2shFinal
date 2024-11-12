import { useEffect, useState, useCallback } from 'react';
import Counter from '@components/common/counter';
import { ProductAttributes } from '@components/product/product-attributes';
import VariationPrice from '@components/product/product-variant-price';
import Button from '@components/ui/button';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { useUI } from '@contexts/ui.context';
import { useUser } from '@framework/auth';
import { useProduct } from '@framework/products';
import { getVariations } from '@framework/utils/get-variations';
import { ROUTES } from '@lib/routes';
import usePrice from '@lib/use-price';
import { useCart } from '@store/quick-cart/cart.context';
import { generateCartItem } from '@utils/generate-cart-item';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isMatch from 'lodash/isMatch';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { PiHandsClapping } from "react-icons/pi";
import { FaStar } from 'react-icons/fa';
const FavoriteButton = dynamic(() => import('@components/product/favorite-button'), { ssr: false });
import { useSanitizeContent } from '@lib/sanitize-content';
import { cn } from '@lib/cn';

export default function ProductPopup({ productSlug }: { productSlug: string }) {
 
  const { t } = useTranslation('common');
  const { closeModal, openSidebar } = useUI();
  const { data: product, isLoading: loading }: any = useProduct({ slug: productSlug });
  const openCart = useCallback(() => openSidebar({ view: 'DISPLAY_CART' }), []);
  const router = useRouter();
  const { addItemToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [viewCartBtn, setViewCartBtn] = useState(false);
  const [addToCartLoader, setAddToCartLoader] = useState(false);
  const { me } = useUser();
  const { price, basePrice } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price!,
    baseAmount: product?.price,
  });

  const variations = getVariations(product?.variations!);
  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation),
      )
    : true;

  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort(),
      ),
    );
  }

  // State to store the overall rating
  const [overallRating, setOverallRating] = useState<string | null>(null);
  const [imageHighLight, setImageHighLight] = useState<String | null>(null);
  // Fetch reviews and update overall rating
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://fun2sh.deificindia.com/reviews?product_id=${product.id}`);
       setImageHighLight(product.product_category)
       
        const data = await response.json();
        // Convert rating to fixed decimal format
        setOverallRating(parseFloat(data.overall_rating).toFixed(1));
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    if (product?.id) {
      fetchReviews();
    }
  }, [product?.id]);

  function addToCart() {
    if (!isSelected) return;
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
      setViewCartBtn(true);
    }, 600);
    const item = generateCartItem(product!, selectedVariation);
    addItemToCart(item, quantity);

    toast(t('add-to-cart'), {
      type: 'dark',
      progressClassName: 'fancy-progress-bar',
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  function navigateToProductPage() {
    closeModal();
    router.push(`${ROUTES.PRODUCT}/${productSlug}`, undefined, { locale: router.locale });
  }

  function handleAttribute(attribute: any) {
    if (!isMatch(attributes, attribute)) {
      setQuantity(1);
    }

    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
  }

  function handleClearAttribute() {
    setAttributes(() => ({}));
  }

  function navigateToCartPage() {
    closeModal();
    setTimeout(() => {
      openCart();
    }, 300);
  }

  const content = useSanitizeContent({ description: product?.description });

  if (loading) {
    return (
      <div className="relative flex items-center justify-center overflow-hidden bg-white w-96 h-96">
        <Spinner />
      </div>
    );
  }

  const productImage = !isEmpty(selectedVariation)
    ? isEmpty(selectedVariation?.image)
      ? product?.image
      : selectedVariation?.image
    : product?.image;

  return (
    <div className="bg-white rounded-lg">
      <div className="flex flex-col lg:flex-row w-full md:w-[650px] lg:w-[960px] mx-auto overflow-hidden">
        <div className="relative flex items-center justify-center flex-shrink-0 w-full overflow-hidden bg-gray-300 lg:w-430px aspect-[1/1.3] max-h-430px lg:max-h-full">
          <Image
            fill
            src={
              productImage?.original ?? 
              '/assets/placeholder/products/product-thumbnail.svg'
            }
            alt={product.name}
            className="object-cover"
            sizes="(max-width: 768px) 100vw"
          />
           {imageHighLight && (
           
    <div
   
      className={cn(
        "absolute top-0 left-0 text-white text-xs px-2 py-1 rounded-br-md",
        {
          "bg-blue-500": imageHighLight === "Discounted",
          "bg-green-500": imageHighLight === "Most Trending",
          "bg-red-500": imageHighLight !== "Discounted" && imageHighLight !== "Most Trending"
        }
      )}
    >


      
      {imageHighLight}
     
    </div>
   
  )}
        </div>

        <div className="flex flex-col w-full p-5 md:p-8">
          <div className="pb-5">
            <div className="mb-2 md:mb-2.5 -mt-1.5 flex w-full items-start justify-between space-x-8 rtl:space-x-reverse">
              <h2
                className="text-lg font-semibold text-heading md:text-xl lg:text-2xl hover:text-black cursor-pointer"
                onClick={navigateToProductPage}
                role="button"
              >
                {product.name}
              </h2>

              {me && (
                <div>
                  <FavoriteButton productId={product?.id} />
                </div>
              )}
            </div>

            {product.unit && isEmpty(variations) && (
              <span className="block mt-2 text-sm font-normal text-body md:mt-3">
                {product.unit}
              </span>
            )}

            {content ? (
              <div>
                <div
                  className="text-sm leading-6 md:text-body md:leading-7 react-editor-description"
                  dangerouslySetInnerHTML={{
                    __html: 
                      content?.length > 200 
                        ? content?.substring(0, 200) + '...' 
                        : content,
                  }}
                />
                {overallRating > 0 && (
  <div
    className="product-rating-button"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: '5px 10px',
      borderRadius: '20px',
      cursor: 'pointer',
      marginTop: '10px',
    }}
  >
    <span style={{ marginRight: '5px' }}>{overallRating ?? 'N/A'}</span>
    <FaStar color="gold" />
  </div>
)}

              </div>
            ) : (
              ''
            )}

<div className="flex items-center mt-3">
              {!isEmpty(variations) ? (
                <VariationPrice
                  selectedVariation={selectedVariation}
                  minPrice={product.min_price}
                  maxPrice={product.max_price}
                />
              ) : (
                <>
                  <div className="text-base font-semibold text-heading md:text-xl lg:text-2xl">
                    {price}
                   
                  </div>

                  {basePrice && (
                    <>
                    <del className="font-segoe text-gray-400 text-base lg:text-xl ltr:pl-2.5 rtl:pr-2.5 -mt-0.5 md:mt-0">
                      {basePrice}
                     
                    </del>
                     <span className="text-red-700 font-bold ltr:pl-2 rtl:pr-2">
                     {Math.round(((parseFloat(basePrice.replace('₹', '')) - parseFloat(price.replace('₹', ''))) / parseFloat(basePrice.replace('₹', ''))) * 100)}% off
                   </span>
                   </>
                    
                  )}
                  
                </>
              )}
            </div>
            <div className="flex flex-row items-center mt-4">
  <div className="text-sm font-semibold text-heading md:text-base lg:text-lg mr-2">
    You are Saving:
  </div>

  {/* Saved Amount */}
<div className="text-sm font-semibold text-green-600 md:text-base lg:text-lg mr-2">
  {basePrice && price ? (
    `₹${(
      parseFloat(basePrice.replace('₹', '')) - 
      parseFloat(price.replace('₹', ''))
    ).toFixed(2)}`
  ) : (
    "N/A" // Fallback text if either basePrice or price is missing
  )}
</div>

  {/* Clap Icon */}
  <div className="text-yellow-500">
    {/* Font Awesome Clap Icon */}
    <PiHandsClapping size={25}></PiHandsClapping>
  </div>
</div>

          </div>

          {Object.keys(variations).map((variation) => {
            return (
              <ProductAttributes
                key={`popup-attribute-key${variation}`}
                title={variation}
                attributes={variations[variation]}
                active={attributes[variation]}
                onClick={handleAttribute}
                clearAttribute={handleClearAttribute}
              />
            );
          })}

          <div className="pt-2 md:pt-4">
            <div className="flex items-center justify-between mb-4 space-x-3 sm:space-x-4 rtl:space-x-reverse">
              {isEmpty(variations) && (
                <>
                  {Number(product.quantity) > 0 ? (
                    <Counter
                      quantity={quantity}
                      onIncrement={() => setQuantity((prev) => prev + 1)}
                      onDecrement={() =>
                        setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                      }
                      disableDecrement={quantity === 1}
                      disableIncrement={Number(product.quantity) === quantity}
                    />
                  ) : (
                    <div className="text-base text-red-500 whitespace-nowrap ltr:lg:ml-7 rtl:first:-mr-4">
                      {t('text-out-stock')}
                    </div>
                  )}
                </>
              )}

              {!isEmpty(selectedVariation) && (
                <>
                  {selectedVariation?.is_disable ||
                  selectedVariation.quantity === 0 ? (
                    <div className="text-base text-red-500 whitespace-nowrap ltr:lg:ml-7 rtl:first:-mr-4">
                      {t('text-out-stock')}
                    </div>
                  ) : (
                    <Counter
                      quantity={quantity}
                      onIncrement={() => setQuantity((prev) => prev + 1)}
                      onDecrement={() =>
                        setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                      }
                      disableDecrement={quantity === 1}
                      disableIncrement={
                        Number(selectedVariation.quantity) === quantity
                      }
                    />
                  )}
                </>
              )}

              <Button
                onClick={addToCart}
                variant="slim"
                className={`w-full lg:w-6/12 xl:w-full ${
                  !isSelected && 'bg-gray-400 hover:bg-gray-400'
                }`}
                disabled={
                  !isSelected ||
                  !product?.quantity ||
                  (!isEmpty(selectedVariation) &&
                    !selectedVariation?.quantity) ||
                  (!isEmpty(selectedVariation) && selectedVariation?.is_disable)
                }
                loading={addToCartLoader}
              >
                <span className="py-2 3xl:px-8">
                  {product?.quantity ||
                  (!isEmpty(selectedVariation) && selectedVariation?.quantity)
                    ? t('text-add-to-cart')
                    : t('text-out-stock')}
                </span>
              </Button>
            </div>

            {viewCartBtn && (
              <button
                onClick={navigateToCartPage}
                className="w-full mb-4 text-sm transition-colors bg-gray-100 border border-gray-300 rounded h-11 md:h-12 text-heading focus:outline-none hover:bg-gray-50 focus:bg-gray-50 xl:text-base"
              >
                {t('text-view-cart')}
              </button>
            )}

            <Button
              onClick={navigateToProductPage}
              variant="flat"
              className="w-full h-11 md:h-12"
            >
              {t('text-view-details')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}