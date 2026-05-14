// Test script to identify the exact issue
const testPayload = {
  product: {
    title: "Test Custom Suit",
    body_html: "Test description",
    vendor: "Custom Vendor",
    product_type: "Suit",
    variants: [
      {
        option1: "Default",
        price: "199.00", // String format
        properties: {
          "Product Type": "Two Piece Suit (SDG 0)",
          "Suit Fabric": "Green LIne Fabric"
        }
      }
    ],
    images: [] // No image for testing
  }
};

console.log("Test payload:", JSON.stringify(testPayload, null, 2));
console.log("Payload size:", JSON.stringify(testPayload).length, "bytes");

// Test with image
const testWithImage = {
  ...testPayload,
  product: {
    ...testPayload.product,
    images: [{
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" // 1x1 pixel PNG
    }]
  }
};

console.log("Test with image size:", JSON.stringify(testWithImage).length, "bytes");
