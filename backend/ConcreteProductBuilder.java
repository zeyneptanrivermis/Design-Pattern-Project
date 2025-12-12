class ConcreteProductBuilder implements ProductBuilder {

  private String name;
  private double basePrice;
  private int stock;

  public ConcreteProductBuilder() {
    this.name = "Bilinmeyen Ürün";
    this.basePrice = 0.0;
    this.stock = 0;
  }

  @Override
  public ProductBuilder setName(String name) {
    this.name = name;
    return this;
  }

  @Override
  public ProductBuilder setBasePrice(double basePrice) {
    this.basePrice = basePrice;
    return this;
  }

  @Override
  public ProductBuilder setStock(int stock) {
    this.stock = stock;
    return this;
  }

  @Override
  public Product build() {
    return new Product(this.name, this.basePrice, this.stock);
  }
}
