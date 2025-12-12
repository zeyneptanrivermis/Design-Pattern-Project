import java.util.ArrayList;
import java.util.List;

class Product implements Component {

  private String name;
  protected double basePrice;
  private int stock;
  private List<StockObserver> observers = new ArrayList<>();
  private PricingStrategy pricingStrategy = new NormalPricing();

  public Product(String name, double basePrice, int stock) {
    this.name = name;
    this.basePrice = basePrice;
    this.stock = stock;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public double getPrice() {
    return pricingStrategy.calculatePrice(basePrice);
  }

  public int getStock() {
    return stock;
  }

  public void setBasePrice(double basePrice) {
    this.basePrice = basePrice;
  }

  @Override
  public void setPricingStrategy(PricingStrategy strategy) {
    this.pricingStrategy = strategy;
  }

  public void setStock(int stock) {
    int oldStock = this.stock;
    this.stock = stock;
    notifyObservers(oldStock);
  }

  public void addObserver(StockObserver observer) {
    observers.add(observer);
  }

  public void removeObserver(StockObserver observer) {
    observers.remove(observer);
  }

  @Override
  public void notifyObservers(int oldStock) {
    for (StockObserver observer : observers) {
      observer.update(name, stock, oldStock);
    }
  }

  @Override
  public void display(String indent) {
    System.out.printf(
      "%s- %s (Base: $%.2f, Final: $%.2f, Stock: %d)%n",
      indent,
      name.toLowerCase(),
      basePrice,
      getPrice(),
      stock
    );
  }

  public void displayForSelection(String indent) {
    display(indent);
  }
}
