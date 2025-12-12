interface ProductBuilder {
  ProductBuilder setName(String name);

  ProductBuilder setBasePrice(double basePrice);

  ProductBuilder setStock(int stock);

  Product build();
}
