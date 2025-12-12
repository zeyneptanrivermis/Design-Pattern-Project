public class ConfigurationManager {

  private static ConfigurationManager instance;

  private double taxRate = 0.18;
  private int lowStockThreshold = 5;

  private ConfigurationManager() {
    System.out.println("⚙️ ConfigurationManager başlatıldı (Singleton).");
  }

  public static ConfigurationManager getInstance() {
    if (instance == null) {
      instance = new ConfigurationManager();
    }
    return instance;
  }

  public double getTaxRate() {
    return taxRate;
  }

  public void setTaxRate(double taxRate) {
    this.taxRate = taxRate;
    System.out.println(
      "✅ Vergi oranı %" + (taxRate * 100) + " olarak güncellendi."
    );
  }

  public int getLowStockThreshold() {
    return lowStockThreshold;
  }

  public void setLowStockThreshold(int lowStockThreshold) {
    this.lowStockThreshold = lowStockThreshold;
  }
}
