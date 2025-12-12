class DiscountDecorator extends ProductDecorator {

  private double discountPercentage;

  public DiscountDecorator(Product product, double discountPercentage) {
    super(product);
    this.discountPercentage = discountPercentage;
  }

  @Override
  public double getPrice() {
    return product.getPrice() * (1 - discountPercentage);
  }
}
