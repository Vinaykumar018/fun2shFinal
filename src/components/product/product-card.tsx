import cn from 'classnames';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Import star icon
import { useUI } from '@contexts/ui.context';
import usePrice from '@lib/use-price';
import { Product } from '@type/index';
import { siteSettings } from '@settings/site.settings';

interface ProductProps {
  product: Product;
  className?: string;
  contactClassName?: string;
  imageContentClassName?: string;
  variant?:
    | 'grid'
    | 'gridSmall'
    | 'gridSlim'
    | 'list'
    | 'listSmall'
    | 'gridSlimLarge';
  imgLoading?: 'eager' | 'lazy';
}

const ProductCard: FC<ProductProps> = ({
  product,
  className = '',
  contactClassName = '',
  imageContentClassName = '',
  variant = 'list',
  imgLoading,
}) => {
  const { openModal, setModalView, setModalData } = useUI();
  const { name, image, min_price, max_price, product_type, description } = product ?? {};
  
  const { price, basePrice } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price!,
    baseAmount: product?.price,
  });

  const { price: minPrice } = usePrice({
    amount: min_price!
  });

  const { price: maxPrice } = usePrice({
    amount: max_price!,
  });

  const [overallRating, setOverallRating] = useState<number | null>(null);
  const [imageHighLight, setImageHighLight] = useState<String | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://fun2sh.deificindia.com/reviews?product_id=${product.id}`);
        const data = await response.json();
   
        setImageHighLight(product.product_category)
        setOverallRating(data.overall_rating);
        
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };




    fetchReviews();
  }, [product.id]);

  function handlePopupView() {
    
    if(overallRating){
      setModalData(product.slug,overallRating)
      setModalView('PRODUCT_VIEW');
    return openModal();
    }
    else{
      setModalData(product.slug,);
      setModalView('PRODUCT_VIEW');
      return openModal();

    }
   
  }

  return (
    <div
      className={cn(
        'group box-border overflow-hidden flex rounded-md cursor-pointer',
        {
          'ltr:pr-0 rtl:pl-0 pb-2 lg:pb-3 flex-col items-start bg-white transition duration-200 ease-in-out transform hover:-translate-y-1 hover:md:-translate-y-1.5 hover:shadow-product':
            variant === 'grid' || variant === 'gridSmall',
          'ltr:pr-0 rtl:pl-0 md:pb-1 flex-col items-start bg-white':
            variant === 'gridSlim' || variant === 'gridSlimLarge',
          'items-center bg-transparent border border-gray-100 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-listProduct':
            variant === 'listSmall',
          'flex-row items-center transition-transform ease-linear bg-gray-200 ltr:pr-2 ltr:lg:pr-3 ltr:2xl:pr-4 rtl:pl-2 rtl:lg:pl-3 rtl:2xl:pl-4':
            variant === 'list',
        },
        className
      )}
      onClick={handlePopupView}
      title={name}
    >
      <div
        className={cn(
          'flex relative ltr:rounded-l-md rtl:rounded-r-md ',
          {
            'mb-3 md:mb-3.5 w-full aspect-[17/22]': variant === 'grid',
            'mb-3 md:mb-3.5 w-full aspect-[1/1.3]': variant === 'gridSmall',
            'mb-3 md:mb-3.5 pb-0 aspect-square w-full rounded-md overflow-hidden':
              variant === 'gridSlim',
            'mb-3 md:mb-3.5 pb-0 aspect-[1/1.2] w-full rounded-md overflow-hidden':
              variant === 'gridSlimLarge',
            'flex-shrink-0 w-32 sm:w-44 md:w-36 lg:w-44 lg:h-44 aspect-square':
              variant === 'listSmall',
            'aspect-square': variant === 'list',
          },
          imageContentClassName
        )}
      >
       <div className="">
  <Image
    src={image?.original ?? siteSettings?.product?.placeholderImage()}
    fill
    loading={imgLoading}
    quality={100}
    alt={name || 'Product Image'}
    className={cn('bg-gray-300 object-cover', {
      'rounded-md transition duration-200 ease-in group-hover:rounded-b-none':
        variant === 'grid' || variant === 'gridSmall',
      'transition duration-150 ease-linear transform group-hover:scale-105':
        variant === 'gridSlim' || variant === 'gridSlimLarge',
      'ltr:rounded-l-md rtl:rounded-r-md transition duration-200 ease-linear transform group-hover:scale-105':
        variant === 'list',
    })}
    sizes="(max-width: 768px) 100vw"
  />

  {/* Sale Badge with Conditions */}
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
      {console.log(imageHighLight==="Most Trending")}
    </div>
  )}
</div>
      </div>

      <div
        className={cn(
          'w-full overflow-hidden',
          {
            'ltr:pl-0 rtl:pr-0 ltr:lg:pl-2.5 ltr:xl:pl-4 rtl:lg:pr-2.5 rtl:xl:pr-4 ltr:pr-2.5 ltr:xl:pr-4 rtl:pl-2.5 rtl:xl:pl-4':
              variant === 'grid' || variant === 'gridSmall',
            'ltr:pl-0 rtl:pr-0': variant === 'gridSlim',
            'px-4 lg:px-5 2xl:px-4': variant === 'listSmall',
          },
          contactClassName
        )}
      >
        <h2
          className={cn('text-heading font-semibold truncate mb-1', {
            'text-sm md:text-base':
              variant === 'grid' || variant === 'gridSmall',
            'md:mb-1.5 text-sm sm:text-base md:text-sm lg:text-base xl:text-lg':
              variant === 'gridSlim',
            'text-sm sm:text-base md:mb-1.5 pb-0': variant === 'listSmall',
            'text-sm sm:text-base md:text-sm lg:text-base xl:text-lg md:mb-1.5':
              variant === 'list',
          })}
        >
          {name}
        </h2>
        {description && (
          <p className="text-body text-xs md:text-[13px] lg:text-sm leading-normal xl:leading-relaxed max-w-[250px] truncate">
            {description}
          </p>
        )}

        {/* Dynamic Star Rating */}
        {overallRating > 0 && (
  <div
    className="product-rating-button"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: '4px 8px', // Reduced padding for more compact space
      borderRadius: '15px', // Smaller border radius for a more compact look
      cursor: 'pointer',
      marginTop: '10px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Subtle shadow for a cleaner look
      transition: 'background-color 0.3s', // Smooth hover effect
      fontSize: '0.75rem', // Further reduced font size
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'} // Hover effect
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'} // Revert on mouse leave
  >
    {overallRating !== null ? (
      <>
        <span
          className='fw-bold'
          style={{
            marginRight: '3px', // Reduced space between text and star
            color: '#333', // Slightly darker color for text
          }}
        >
          {overallRating.toFixed(1)}
        </span>
        <FaStar color="gold" size={14} /> {/* Reduced star size for compact display */}
      </>
    ) : (
      <span style={{ color: '#999' }}>Loading...</span> // Optional loading state with lighter color
    )}
  </div>
)}



        <div
          className={`text-heading font-semibold text-sm sm:text-base mt-1.5 space-x-1 rtl:space-x-reverse ${
            variant === 'grid' || variant === 'gridSmall'
              ? '3xl:text-lg lg:mt-2.5'
              : 'sm:text-lg md:text-base 3xl:text-xl md:mt-2.5 2xl:mt-3'
          }`}
        >
          {product_type.toLocaleLowerCase() === 'variable' ? (
            <>
              <span className="inline-block">{minPrice}</span>
              <span> - </span>
              <span className="inline-block">{maxPrice}</span>
            </>
          ) : (
            <>
              <span className="text-sm">{price}</span>

              {basePrice && (
                <>
                  <del className="text-xs text-gray-800  ">
                    {basePrice}
                  </del>
                  <span className=" text-xxs text-red-600 ">
                    {Math.round(
                      ((parseFloat(basePrice.replace('₹', '')) -
                        parseFloat(price.replace('₹', ''))) /
                        parseFloat(basePrice.replace('₹', ''))) *
                        100
                    )}
                    % off
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;




// import Counter from '@components/common/counter';
// import { ProductAttributes } from '@components/product/product-attributes';
// import VariationPrice from '@components/product/product-variant-price';
// import Button from '@components/ui/button';
// import Spinner from '@components/ui/loaders/spinner/spinner';
// import { useUI } from '@contexts/ui.context';
// import { useUser } from '@framework/auth';
// import { useProduct } from '@framework/products';
// import { getVariations } from '@framework/utils/get-variations';
// import { ROUTES } from '@lib/routes';
// import usePrice from '@lib/use-price';
// import { useCart } from '@store/quick-cart/cart.context';
// import { generateCartItem } from '@utils/generate-cart-item';
// import isEmpty from 'lodash/isEmpty';
// import isEqual from 'lodash/isEqual';
// import isMatch from 'lodash/isMatch';
// import { useTranslation } from 'next-i18next';
// import dynamic from 'next/dynamic';
// import Image from 'next/image';
// import { useRouter } from 'next/router';
// import { useCallback, useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { FaStar } from 'react-icons/fa'; // Import star icon

// const FavoriteButton = dynamic(
//   () => import('@components/product/favorite-button'),
//   { ssr: false },
// );
// import { useSanitizeContent } from '@lib/sanitize-content';

// export default function ProductPopup({ productSlug }: { productSlug: string }) {
//   const { t } = useTranslation('common');
//   const { closeModal, openSidebar } = useUI();
//   const { data: product, isLoading: loading }: any = useProduct({
//     slug: productSlug,
//   });

//   // State for overall rating
//   const [overallRating, setOverallRating] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await fetch(`https://fun2sh.deificindia.com/reviews?product_id=${product.id}`);
//         const data = await response.json();
//         // Convert rating to fixed decimal format
//         setOverallRating(parseFloat(data.overall_rating).toFixed(1));
//       } catch (error) {
//         console.error('Error fetching reviews:', error);
//       }
//     };

//     if (product?.id) {
//       fetchReviews();
//     }
//   }, [product.id]);

//   const openCart = useCallback(() => {
//     return openSidebar({
//       view: 'DISPLAY_CART',
//     });
//   }, []);
//   const router = useRouter();
//   const { addItemToCart } = useCart();
//   const [quantity, setQuantity] = useState(1);
//   const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
//   const [viewCartBtn, setViewCartBtn] = useState<boolean>(false);
//   const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
//   const { me } = useUser();

//   const { price, basePrice } = usePrice({
//     amount: product?.sale_price ? product?.sale_price : product?.price!,
//     baseAmount: product?.price,
//   });

//   const variations = getVariations(product?.variations!);

//   const isSelected = !isEmpty(variations)
//     ? !isEmpty(attributes) &&
//       Object.keys(variations).every((variation) =>
//         attributes.hasOwnProperty(variation),
//       )
//     : true;

//   let selectedVariation: any = {};
//   if (isSelected) {
//     selectedVariation = product?.variation_options?.find((o: any) =>
//       isEqual(
//         o.options.map((v: any) => v.value).sort(),
//         Object.values(attributes).sort(),
//       ),
//     );
//   }

//   function addToCart() {
//     if (!isSelected) return;
//     setAddToCartLoader(true);
//     setTimeout(() => {
//       setAddToCartLoader(false);
//       setViewCartBtn(true);
//     }, 600);
//     const item = generateCartItem(product!, selectedVariation);
//     addItemToCart(item, quantity);

//     toast(t('add-to-cart'), {
//       //@ts-ignore
//       type: 'dark',
//       progressClassName: 'fancy-progress-bar',
//       position: 'top-right',
//       autoClose: 2000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });
//   }

//   function navigateToProductPage() {
//     closeModal();
//     router.push(`${ROUTES.PRODUCT}/${productSlug}`, undefined, {
//       locale: router.locale,
//     });
//   }

//   function handleAttribute(attribute: any) {
//     if (!isMatch(attributes, attribute)) {
//       setQuantity(1);
//     }
//     setAttributes((prev) => ({
//       ...prev,
//       ...attribute,
//     }));
//   }

//   function handleClearAttribute() {
//     setAttributes(() => ({}));
//   }

//   function navigateToCartPage() {
//     closeModal();
//     setTimeout(() => {
//       openCart();
//     }, 300);
//   }

//   const content = useSanitizeContent({ description: product?.description });
  
//   if (loading) {
//     return (
//       <div className="relative flex items-center justify-center overflow-hidden bg-white w-96 h-96">
//         <Spinner />
//       </div>
//     );
//   }
  
//   const productImage = !isEmpty(selectedVariation)
//     ? isEmpty(selectedVariation?.image)
//       ? product?.image
//       : selectedVariation?.image
//     : product?.image;

//   return (
//     <div className="bg-white rounded-lg">
//       <div className="flex flex-col lg:flex-row w-full md:w-[650px] lg:w-[960px] mx-auto overflow-hidden">
//         <div className="relative flex items-center justify-center flex-shrink-0 w-full overflow-hidden bg-gray-300 lg:w-430px aspect-[1/1.3] max-h-430px lg:max-h-full">
//           <Image
//             fill
//             src={productImage?.original ?? '/assets/placeholder/products/product-thumbnail.svg'}
//             alt={product.name}
//             className="object-cover"
//             sizes="(max-width: 768px) 100vw"
//           />
//         </div>

//         <div className="flex flex-col w-full p-5 md:p-8">
//           <div className="pb-5">
//             <div className="mb-2 md:mb-2.5 -mt-1.5 flex w-full items-start justify-between space-x-8 rtl:space-x-reverse">
//               <h2
//                 className="text-lg font-semibold text-heading md:text-xl lg:text-2xl hover:text-black cursor-pointer"
//                 onClick={navigateToProductPage}
//                 role="button"
//               >
//                 {product.name}
//               </h2>

//               {me && (
//                 <div>
//                   <FavoriteButton productId={product?.id} />
//                 </div>
//               )}
//             </div>

//             {product.unit && isEmpty(variations) && (
//               <span className="block mt-2 text-sm font-normal text-body md:mt-3">
//                 {product.unit}
//               </span>
//             )}

//             {content ? (
//               <div>
//                 <div
//                   className="text-sm leading-6 md:text-body md:leading-7 react-editor-description"
//                   dangerouslySetInnerHTML={{
//                     __html:
//                       content?.length > 200
//                         ? content?.substring(0, 200) + '...'
//                         : content,
//                   }}
//                 />
//                 <div
//                   className="product-rating-button"
//                   style={{
//                     display: 'inline-flex',
//                     alignItems: 'center',
//                     backgroundColor: '#f0f0f0',
//                     padding: '5px 10px',
//                     borderRadius: '20px',
//                     cursor: 'pointer',
//                     marginTop: '10px',
//                   }}
//                 >
//                   <span style={{ marginRight: '5px' }}>{overallRating}</span> {/* Display formatted rating number */}
//                   <FaStar color="gold" /> {/* Display static star icon */}
//                 </div>
//               </div>
//             ) : (
//               ''
//             )}

//             <div className="flex items-center mt-3">
//               {!isEmpty(variations) ? (
//                 <VariationPrice
//                   selectedVariation={selectedVariation}
//                   minPrice={product.min_price}
//                   maxPrice={product.max_price}
//                 />
//               ) : (
//                 <>
//                   <div className="text-base font-semibold text-heading md:text-xl lg:text-2xl">
//                     {price}
//                   </div>

//                   {basePrice && (
//                     <>
//                       <del className="font-segoe text-gray-400 text-base lg:text-xl ltr:pl-2.5 rtl:pr-2.5 -mt-0.5 md:mt-0">
//                         {basePrice}
//                       </del>
//                       <span className="text-red-700 font-bold ltr:pl-2 rtl:pr-2">
//                         {Math.round(((parseFloat(basePrice.replace('₹', '')) - parseFloat(price.replace('₹', ''))) / parseFloat(basePrice.replace('₹', ''))) * 100)}% off
//                       </span>
//                     </>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           {Object.keys(variations).map((variation) => {
//             return (
//               <ProductAttributes
//                 key={variation}
//                 variation={variation}
//                 options={product?.variation_options}
//                 selectedVariation={selectedVariation}
//                 selectedAttributes={attributes}
//                 onSelectAttribute={handleAttribute}
//                 onClearAttribute={handleClearAttribute}
//               />
//             );
//           })}

//           <div className="flex items-center justify-between mt-7">
//             <div>
//               <Counter quantity={quantity} setQuantity={setQuantity} />
//             </div>
//             <Button
//               loading={addToCartLoader}
//               disabled={addToCartLoader || !isSelected}
//               onClick={addToCart}
//             >
//               {t('add-to-cart')}
//             </Button>
//           </div>
//           {viewCartBtn && (
//             <Button onClick={navigateToCartPage} variant="outlined" className="mt-5">
//               {t('view-cart')}
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
