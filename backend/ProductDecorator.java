abstract class ProductDecorator implements Component {

  protected Product product;

  public ProductDecorator(Product product) {
    this.product = product;
  }

  @Override
  public String getName() {
    return product.getName();
  }

  @Override
  public void display(String indent) {
    System.out.printf(
      "%s- %s (Base: $%.2f, Final: $%.2f, Stock: %d) [DECORATED]%n",
      indent,
      getName().toLowerCase(),
      product.basePrice,
      getPrice(),
      getStock()
    );
  }

  @Override
  public void displayForSelection(String indent) {
    display(indent);
  }

  public abstract double getPrice();

  public int getStock() {
    return product.getStock();
  }

  @Override
  public void addObserver(StockObserver observer) {
    product.addObserver(observer);
  }

  @Override
  public void removeObserver(StockObserver observer) {
    product.removeObserver(observer);
  }

  @Override
  public void notifyObservers(int oldStock) {
    product.notifyObservers(oldStock);
  }

  @Override
  public void setPricingStrategy(PricingStrategy strategy) {
    product.setPricingStrategy(strategy);
  }
}
