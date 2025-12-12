import java.util.ArrayList;
import java.util.List;

class CategoryComposite implements Component {

  private String name;
  private List<Component> components = new ArrayList<>();
  private List<StockObserver> observers = new ArrayList<>();

  public CategoryComposite(String name) {
    this.name = name;
  }

  public void addComponent(Component component) {
    components.add(component);
  }

  public void removeComponent(Component component) {
    components.remove(component);
  }

  public void removeComponentByIndex(int index) {
    if (index >= 0 && index < components.size()) {
      components.remove(index);
    } else {
      throw new IndexOutOfBoundsException("Invalid component index");
    }
  }

  public Component getComponent(int index) {
    if (index >= 0 && index < components.size()) {
      return components.get(index);
    }
    throw new IndexOutOfBoundsException("Invalid component index");
  }

  public List<Component> getComponents() {
    return components;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public double getPrice() {
    return 0;
  }

  @Override
  public void display(String indent) {
    System.out.println(indent + "+ " + name.toUpperCase());

    for (Component component : components) {
      if (!(component instanceof CategoryComposite)) {
        component.display(indent + "  ");
      }
    }

    for (Component component : components) {
      if (component instanceof CategoryComposite) {
        component.display(indent + "  ");
      }
    }
  }

  public void displayForSelection(String indent) {
    System.out.println(indent + "+ " + name.toUpperCase());
    for (int i = 0; i < components.size(); i++) {
      Component component = components.get(i);
      if (component instanceof CategoryComposite) {
        System.out.print(indent + "  " + (i + 1) + ". ");
        component.displayForSelection("");
      } else {
        component.display(indent + "  ");
      }
    }
  }

  @Override
  public int getStock() {
    return 0;
  }

  @Override
  public void addObserver(StockObserver observer) {
    observers.add(observer);
    for (Component component : components) {
      component.addObserver(observer);
    }
  }

  @Override
  public void removeObserver(StockObserver observer) {
    observers.remove(observer);
    for (Component component : components) {
      component.removeObserver(observer);
    }
  }

  @Override
  public void notifyObservers(int oldStock) {}

  @Override
  public void setPricingStrategy(PricingStrategy strategy) {
    for (Component component : components) {
      component.setPricingStrategy(strategy);
    }
  }
}
