export const getProductTextByBarcode = async (barcode: string) => {
  const resultJson = await fetch(
    `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
  );
  const result = await resultJson.json();

  const product = result.product;
  if (
    !Object.keys(product.nutriments).find((k) =>
      ["fat", "carbohydrates", "proteins"].includes(k)
    )
  ) {
    return undefined;
  } else {
    let text = "";
    if (product.brands && typeof product.brands === "string") {
      text += product.brands + " - ";
    }
    if (product.product_name) {
      text += product.product_name + ". ";
    }
    if (product.product_quantity) {
      text += `${product.product_quantity}${
        product.product_quantity_unit ?? ""
      }. `;
    }
    text += `Белков: ${product.nutriments.proteins ?? 0} г. Жиров: ${
      product.nutriments.fat ?? 0
    }. Углеводов: ${product.nutriments.carbohydrates ?? 0}. Калорий: ${
      product.nutriments["energy-kcal_100g"] ?? ""
    }`;
    return text;
  }
};
