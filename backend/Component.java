interface Component {
  String getName();

  void display(String indent);

  void displayForSelection(String indent);

  double getPrice();

  int getStock();

  void addObserver(StockObserver observer);

  void removeObserver(StockObserver observer);

  void notifyObservers(int oldStock);

  void setPricingStrategy(PricingStrategy strategy);
}
