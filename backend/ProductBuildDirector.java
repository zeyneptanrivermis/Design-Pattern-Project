class ProductBuildDirector {

  private ProductBuilder builder;

  public ProductBuildDirector(ProductBuilder builder) {
    this.builder = builder;
  }

  public Product buildSimpleItem(String name, double price, int stock) {
    return builder.setName(name).setBasePrice(price).setStock(stock).build();
  }

  public Product buildComplexLaptop(
    String modelName,
    double basePrice,
    int initialStock,
    String cpu,
    int ramGB
  ) {
    System.out.println("🔧 Complex Product Being Built: " + modelName);
    System.out.println("  -> CPU: " + cpu + ", RAM: " + ramGB + "GB");

    String finalName = modelName + " (" + cpu + "/" + ramGB + "GB)";

    return builder
      .setName(finalName)
      .setBasePrice(basePrice * (1 + 0.15))
      .setStock(initialStock)
      .build();
  }
}
