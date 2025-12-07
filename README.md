✨ Design Patterns Project: Inventory Management System (Java & Frontend Sim)
This project demonstrates the practical application and integration of six crucial design patterns within a console-based Inventory Management System implemented in Java. The accompanying HTML/CSS/JS frontend acts as a Single Page Application (SPA) simulation to visualize the interaction with the core logic. Key Design Patterns IntegratedThe architecture leverages Creational, Structural, and Behavioral patterns for a robust and maintainable system:PatternCategoryRole in ProjectCompositeStructuralManages the hierarchical structure of Categories (CategoryComposite) and Products (Product).DecoratorStructuralDynamically adds responsibilities (e.g., price increase or discount) to a Product without altering its base class.ObserverBehavioralImplemented for stock tracking, triggering alerts (LowStockObserver) when a Product's stock level changes.StrategyBehavioralAllows dynamic switching between different pricing methods (e.g., Normal vs. Tax Included Pricing) at runtime.SingletonCreationalEnsures a single instance of ConfigurationManager to manage global settings like tax rates and low stock thresholds.BuilderCreationalProvides a clean, step-by-step API (ProductBuildDirector) for constructing complex product objects (e.g., Laptops with specific CPU/RAM configurations). Project Structure and Execution File OrganizationThe project is cleanly separated into two main domains: DESIGNPATTERN
├── 📁 backend           <-- Java Core Logic (Design Patterns)
│   ├── Main.java        <-- Java Backend Coordinator
│   ├── Product.java     
│   ├── CategoryComposite.java 
│   └── (All other pattern classes: Builder, Decorator, Strategy, etc.)
└── 📁 frontend          <-- Frontend SPA Simulation (HTML/CSS/JS)
    ├── index.html       <-- Main SPA Router and Global JS Logic
    ├── style.css
    └── 📁 pages         <-- Dynamic HTML views (e.g., add_product.html)
 How to Run the ApplicationSince the frontend relies on dynamic file loading (fetch), and the backend is a separate Java console application, you need to follow a two-step process:Step 1: Run the Java Backend (Console)Navigate to the backend directory in your command line:Bashcd backend
Compile all Java source files:Bashjavac *.java
Start the main Java application. This will initiate the core logic and wait for input:Bashjava Main
Step 2: Run the Frontend (Web Server)The web frontend must be served via HTTP to bypass browser security errors (Failed to fetch).Open a new command line window and navigate to the frontend directory (or use your Java SimpleHttpServer if you placed it there).Using Python (Easiest): If Python is installed, run:Bashpython -m http.server 8000
Access the App: Open your browser and go to: http://localhost:8000/index.html. You can now interact with the web interface, and the resulting actions (Simulations) will reflect the commands and outputs you would see in the running Java Console.
