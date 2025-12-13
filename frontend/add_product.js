// frontend/add_product.js

window.initializeSampleData = function () {
  const existingState = JSON.parse(localStorage.getItem("inventoryState"));

  if (existingState && Object.keys(existingState).length > 0) {
    const confirm = window.confirm(
      "⚠️ Data already exists!\n\nDo you want to RESET and lose all added products?\n\n✅ YES = Reset to sample data\n❌ NO = Keep current data"
    );

    if (!confirm) {
      console.log("ℹ️ User cancelled reset");
      alert("✅ Your existing data is safe!");
      window.inventoryState = existingState;
      return;
    }
  }

  window.inventoryState = {
    ELECTRONICS: {
      COMPUTERS: {
        LAPTOPS: [
          {
            id: 1,
            name: "Gamer Pro X (i9/32GB)",
            basePrice: 1499.99,
            finalPrice: 1199.99,
            stock: 4,
            isDecorated: true,
            categoryPath: "ELECTRONICS.COMPUTERS.LAPTOPS",
          },
          {
            id: 2,
            name: "Business Ultra",
            basePrice: 999.99,
            finalPrice: 999.99,
            stock: 8,
            isDecorated: false,
            categoryPath: "ELECTRONICS.COMPUTERS.LAPTOPS",
          },
        ],
        DESKTOPS: [],
      },
      PHONES: [
        {
          id: 3,
          name: "Smartphone",
          basePrice: 799.99,
          finalPrice: 879.99,
          stock: 15,
          isDecorated: true,
          categoryPath: "ELECTRONICS.PHONES",
        },
      ],
    },
    CLOTHING: [
      {
        id: 5,
        name: "T-Shirt",
        basePrice: 29.99,
        finalPrice: 29.99,
        stock: 50,
        isDecorated: false,
        categoryPath: "CLOTHING",
      },
    ],
  };

  localStorage.setItem("inventoryState", JSON.stringify(window.inventoryState));
  console.log("✅ Sample data initialized!");
  alert("✅ Sample data loaded! (Previous data was reset)");
  window.loadParentCategories();
};

window.selectedCategoryPath = [];

window.loadParentCategories = function () {
  const state = JSON.parse(localStorage.getItem("inventoryState")) || {};
  const parentSelect = document.getElementById("parent-category");

  if (!parentSelect) return;

  console.log("📦 inventoryState:", state);

  window.selectedCategoryPath = [];
  removeDynamicDropdowns();

  while (parentSelect.options.length > 0) {
    parentSelect.remove(0);
  }

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Select a Category --";
  parentSelect.appendChild(defaultOption);

  for (const categoryName in state) {
    const option = document.createElement("option");
    option.value = categoryName;

    const categoryContent = state[categoryName];
    const isProductList = Array.isArray(categoryContent);
    const prefix = isProductList ? "📄 " : "📦 "; // Leaf vs. Composite

    option.textContent = `${prefix}${categoryName}`;
    parentSelect.appendChild(option);
    console.log("✅ Added top-level category:", categoryName);
  }

  window.updateSelectedPath();
};

window.loadSubcategories = function () {
  const parentName = document.getElementById("parent-category").value;

  if (!parentName) {
    removeDynamicDropdowns();
    window.selectedCategoryPath = [];
    window.updateSelectedPath();
    return;
  }

  window.selectedCategoryPath = [parentName];

  removeDynamicDropdowns();

  const state =
    window.inventoryState ||
    JSON.parse(localStorage.getItem("inventoryState")) ||
    {};
  const currentCategory = state[parentName];

  console.log(
    "🔍 Selected:",
    parentName,
    "Type:",
    typeof currentCategory,
    "isArray:",
    Array.isArray(currentCategory)
  );

  if (
    currentCategory &&
    typeof currentCategory === "object" &&
    !Array.isArray(currentCategory)
  ) {
    createNextLevelDropdown(currentCategory, 1);
  } else if (Array.isArray(currentCategory)) {
    console.log("✅ This is a product list (array), no more dropdowns needed");
  }

  window.updateSelectedPath();
};

function createNextLevelDropdown(categoryObj, level) {
  const container = document.querySelector(".catalog");
  const categorySelectionDiv = container.querySelector(
    'div[style*="background-color: #f8f9fa"]'
  );

  if (!categorySelectionDiv) {
    console.error("❌ Category selection div not found");
    return;
  }

  const newSelectId = `category-level-${level}`;
  const newLabel = document.createElement("label");
  newLabel.setAttribute("for", newSelectId);
  newLabel.innerHTML = `<strong>Level ${level + 1}:</strong>`;

  const newSelect = document.createElement("select");
  newSelect.id = newSelectId;
  newSelect.className = "dynamic-category-select";
  newSelect.setAttribute("data-level", level);
  newSelect.style.cssText =
    "width: 100%; padding: 8px; margin-bottom: 10px; font-size: 14px;";
  newSelect.innerHTML = '<option value="">-- Select Subcategory --</option>';

  for (const subCatName in categoryObj) {
    const categoryContent = categoryObj[subCatName];
    if (typeof categoryContent === "object" && categoryContent !== null) {
      const isProductList = Array.isArray(categoryContent);
      const prefix = isProductList ? "📄 " : "📦 ";

      const option = document.createElement("option");
      option.value = subCatName;
      option.textContent = `${"└─".repeat(level)} ${prefix}${subCatName}`;
      newSelect.appendChild(option);
    }
  }

  newSelect.addEventListener("change", function () {
    handleDynamicDropdownChange(this, level, categoryObj);
  });

  const pathDisplay = document.getElementById("selected-path")?.parentElement;
  if (pathDisplay) {
    categorySelectionDiv.insertBefore(newLabel, pathDisplay); // Önce label'ı ekle
    categorySelectionDiv.insertBefore(newSelect, pathDisplay); // Sonra select'i ekle
  } else {
    categorySelectionDiv.appendChild(newLabel);
    categorySelectionDiv.appendChild(newSelect);
  }

  console.log(`✅ Created dropdown for level ${level}`);
}

function handleDynamicDropdownChange(selectElement, level, parentCategoryObj) {
  const selectedValue = selectElement.value;

  console.log(`🔍 Dropdown changed at level ${level}:`, selectedValue);

  if (!selectedValue) {
    window.selectedCategoryPath = window.selectedCategoryPath.slice(0, level);
    removeDropdownsAfterLevel(level);
    window.updateSelectedPath();
    return;
  }

  window.selectedCategoryPath[level] = selectedValue;
  window.selectedCategoryPath = window.selectedCategoryPath.slice(0, level + 1);

  removeDropdownsAfterLevel(level);

  const nextCategory = parentCategoryObj[selectedValue];

  console.log(
    `🔍 Level ${level} selected:`,
    selectedValue,
    "Type:",
    typeof nextCategory,
    "isArray:",
    Array.isArray(nextCategory)
  );

  if (
    nextCategory &&
    typeof nextCategory === "object" &&
    !Array.isArray(nextCategory)
  ) {
    createNextLevelDropdown(nextCategory, level + 1);
  } else if (Array.isArray(nextCategory)) {
    console.log("✅ Reached product list (array), no more dropdowns");
  }

  window.updateSelectedPath();
}

function removeDropdownsAfterLevel(level) {
  const allDynamicSelects = document.querySelectorAll(
    ".dynamic-category-select"
  );

  console.log(
    `🗑️ Removing dropdowns after level ${level}, found ${allDynamicSelects.length} dropdowns`
  );

  allDynamicSelects.forEach((select) => {
    const selectLevel = parseInt(select.getAttribute("data-level"));

    if (selectLevel > level) {
      const label = select.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        label.remove();
      }
      select.remove();
      console.log(`🗑️ Removed dropdown at level ${selectLevel}`);
    }
  });
}

function removeDynamicDropdowns() {
  const allDynamicSelects = document.querySelectorAll(
    ".dynamic-category-select"
  );

  console.log(`🗑️ Removing all ${allDynamicSelects.length} dynamic dropdowns`);

  allDynamicSelects.forEach((select) => {
    const label = select.previousElementSibling;
    if (
      label &&
      label.tagName === "LABEL" &&
      label.htmlFor.startsWith("category-level-")
    ) {
      label.remove();
    }
    select.remove();
  });
}

window.updateSelectedPath = function () {
  const pathDisplay = document.getElementById("selected-path");
  if (!pathDisplay) return;

  const path = window.selectedCategoryPath.join(" → ");
  pathDisplay.textContent = path || "Not selected yet";
  pathDisplay.style.color = path ? "#28a745" : "#999";

  console.log("📍 Current path:", window.selectedCategoryPath);
};

window.simulateAddProduct = function () {
  const prodName = document.getElementById("prod-name").value;
  const prodPrice = document.getElementById("prod-price").value;
  const prodStock = document.getElementById("prod-stock").value;
  const prodCpu = document.getElementById("prod-cpu").value;
  const prodRam = document.getElementById("prod-ram").value;

  if (window.selectedCategoryPath.length === 0) {
    alert("❌ Please select a category path!");
    return;
  }

  if (!prodName || !prodPrice || !prodStock) {
    alert("❌ Please fill in all required product fields!");
    return;
  }

  const state = JSON.parse(localStorage.getItem("inventoryState")) || {};

  let current = state;
  let categoryPath = "";
  let parentObj = state; // current'in tutulduğu bir üst objeyi tutmak için
  let parentKey = null;

  for (let i = 0; i < window.selectedCategoryPath.length; i++) {
    const key = window.selectedCategoryPath[i];
    categoryPath += (i > 0 ? "." : "") + key;

    if (!current || !current[key]) {
      alert(`❌ Invalid category path: ${categoryPath}. Path not found.`);
      return;
    }
    
    parentObj = current;
    parentKey = key;
    current = current[key];
  }
  
  // 💥 KRİTİK DÜZELTME: Eğer seçilen kategori bir Composite Node (Obje) ise...
  if (typeof current === 'object' && !Array.isArray(current)) {
      // 1. İçinde 'PRODUCTS' adında bir Leaf Node (Array) var mı diye kontrol et.
      if (!current['PRODUCTS'] || !Array.isArray(current['PRODUCTS'])) {
          // 2. Yoksa, otomatik olarak Leaf Node'u oluştur.
          current['PRODUCTS'] = [];
          console.log(`ℹ️ Composite Node "${parentKey}" içinde otomatik olarak 'PRODUCTS' (Leaf Node) oluşturuldu.`);
      }
      // 3. Ürünün ekleneceği düğümü (current) 'PRODUCTS' dizisine yönlendir.
      current = current['PRODUCTS'];
  }
  
  // Eğer bu noktada hala bir dizi değilse, kural ihlali veya yapısal bir hata var demektir.
  if (!Array.isArray(current)) {
    alert(
      `❌ Cannot add product here! The selected path "${categoryPath}" is not a valid product list (Leaf Node). Check console for state structure.`
    );
    return;
  }

  // Ürün oluşturma (Builder/Factory simülasyonu)
  const newProduct = {
    id: Date.now(),
    name: prodName + (prodCpu ? ` (${prodCpu})` : ""),
    basePrice: parseFloat(prodPrice),
    // Builder Pattern: CPU varsa fiyatı %15 artırır.
    finalPrice: parseFloat(prodPrice) * (prodCpu ? 1.15 : 1), 
    stock: parseInt(prodStock),
    isDecorated: !!prodCpu,
    categoryPath: categoryPath,
    cpu: prodCpu || null,
    ram: prodRam ? parseInt(prodRam) : null,
  };

  current.push(newProduct);

  window.inventoryState = state;
  localStorage.setItem("inventoryState", JSON.stringify(state));

  console.log("✅ Product added:", newProduct);

  alert(
    `✅ Product "${prodName}" added to "${categoryPath}"!\n\n💰 Price: $${newProduct.finalPrice.toFixed(
      2
    )}\n📦 Stock: ${prodStock}\n\nRedirecting to home page...`
  );

  setTimeout(function () {
    window.location.reload();
  }, 500);
};

function attemptLoadParentCategories() {
  const parentSelect = document.getElementById("parent-category");
  if (parentSelect && typeof window.loadParentCategories === "function") {
    window.loadParentCategories();
    console.log("✅ Automatic parent category loading success.");
  } else {
    setTimeout(attemptLoadParentCategories, 100);
  }
}

attemptLoadParentCategories();