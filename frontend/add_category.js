// 🆕 KATEGORİ EKLEME FONKSİYONLARI

window.selectedCategoryPath = [];

window.loadCategoryLevels = function () {
  const parentSelect = document.getElementById("parent-cat-select");
  const levelsContainer = document.getElementById("category-levels-container");

  if (!parentSelect || !levelsContainer) {
    console.error(
      "❌ parent-cat-select or category-levels-container not found!"
    );
    return;
  }

  const selectedParent = parentSelect.value;

  levelsContainer.innerHTML = "";
  window.selectedCategoryPath = [];

  if (!selectedParent) {
    window.updateCategoryPath();
    return;
  }

  window.selectedCategoryPath = [selectedParent];

  const state =
    window.inventoryState ||
    JSON.parse(localStorage.getItem("inventoryState")) ||
    {};
  const currentCategory = state[selectedParent];

  if (
    currentCategory &&
    typeof currentCategory === "object" &&
    !Array.isArray(currentCategory)
  ) {
    window.createCategoryLevelDropdown(currentCategory, 1, levelsContainer);
  }

  window.updateCategoryPath();
};

window.createCategoryLevelDropdown = function (categoryObj, level, container) {
  const newSelectId = `category-level-${level}`;
  const newLabel = document.createElement("label");
  newLabel.setAttribute("for", newSelectId);
  newLabel.innerHTML = `<strong>Level ${level + 1}:</strong>`;

  const newSelect = document.createElement("select");
  newSelect.id = newSelectId;
  newSelect.className = "dynamic-category-level-select";
  newSelect.setAttribute("data-level", level);
  newSelect.style.cssText =
    "width: 100%; padding: 8px; margin-bottom: 10px; font-size: 14px;";
  newSelect.innerHTML = '<option value="">-- Select Subcategory --</option>';

  for (const subCatName in categoryObj) {
    // Sadece Composite Node'ları (alt kategori barındırabilen objeleri) listele
    if (
      typeof categoryObj[subCatName] === "object" &&
      !Array.isArray(categoryObj[subCatName])
    ) {
      const option = document.createElement("option");
      option.value = subCatName;
      option.textContent = `${"└─".repeat(level)} ${subCatName}`;
      newSelect.appendChild(option);
    }
  }

  newSelect.addEventListener("change", function () {
    window.handleCategoryLevelChange(this, level, categoryObj, container);
  });

  container.appendChild(newLabel);
  container.appendChild(newSelect);
};

window.handleCategoryLevelChange = function (
  selectElement,
  level,
  parentCategoryObj,
  container
) {
  const selectedValue = selectElement.value;

  if (!selectedValue) {
    window.selectedCategoryPath = window.selectedCategoryPath.slice(0, level);
    window.removeCategoryLevelsAfter(level, container);
    window.updateCategoryPath();
    return;
  }

  window.selectedCategoryPath[level] = selectedValue;
  window.selectedCategoryPath = window.selectedCategoryPath.slice(0, level + 1);

  window.removeCategoryLevelsAfter(level, container);

  const nextCategory = parentCategoryObj[selectedValue];

  if (
    nextCategory &&
    typeof nextCategory === "object" &&
    !Array.isArray(nextCategory)
  ) {
    window.createCategoryLevelDropdown(nextCategory, level + 1, container);
  }

  window.updateCategoryPath();
};

window.removeCategoryLevelsAfter = function (level, container) {
  const allLevels = container.querySelectorAll(
    ".dynamic-category-level-select"
  );

  allLevels.forEach((select) => {
    const selectLevel = parseInt(select.getAttribute("data-level"));

    if (selectLevel > level) {
      const label = select.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        label.remove();
      }
      select.remove();
    }
  });
};

window.updateCategoryPath = function () {
  const pathDisplay = document.getElementById("selected-cat-path");
  if (!pathDisplay) {
    return;
  }

  let path =
    window.selectedCategoryPath.length > 0
      ? window.selectedCategoryPath.join(" → ")
      : "Root (Top-Level)";

  pathDisplay.textContent = path;
  pathDisplay.style.color =
    window.selectedCategoryPath.length > 0 ? "#28a745" : "#0066cc";
};

// 🚨 KRİTİK DÜZELTME: Leaf Node'u Composite'e dönüştürme mantığı eklendi!
window.simulateAddCategory = function () {
  const catName = document.getElementById("cat-name").value.trim();
  const catType = "composite";

  if (!catName) {
    alert("❌ Please enter a category name!");
    return;
  }

  const state =
    window.inventoryState ||
    JSON.parse(localStorage.getItem("inventoryState")) ||
    {};

  // Alt kategori ekleyebilmek için Composite Node {} olarak oluşturuyoruz.
  const newCategoryContent = {}; 

  if (window.selectedCategoryPath.length === 0) {
    // 1. Top-Level Kategori Ekleme
    const keyName = catName.toUpperCase();

    if (state[keyName]) {
      alert(`❌ Category "${catName}" already exists at top-level!`);
      return;
    }

    state[keyName] = newCategoryContent;
    console.log(`✅ Top-level category "${catName}" created as Composite Node {}`);
  } else {
    // 2. Alt Kategori Ekleme
    let parentObj = state; // 'current' kategoriyi içeren üst obje
    let parentKey = null;  // 'current' kategorinin üst objedeki anahtarı
    let current = state;
    let categoryPath = "";

    for (let i = 0; i < window.selectedCategoryPath.length; i++) {
      const key = window.selectedCategoryPath[i];
      categoryPath += (i > 0 ? "." : "") + key;

      if (!current[key]) {
        alert(`❌ Category path not found: ${categoryPath}`);
        return;
      }
      
      // Her adımda parent'ı ve key'i güncelle
      parentObj = current; 
      parentKey = key;
      current = current[key]; // current, parentObj[parentKey]'in içeriği olur
    }

    // 💥 KRİTİK DÜZELTME BAŞLANGICI: Leaf Node'u Composite'e dönüştür.
    // Kullanıcının seçtiği parent bir Array (Leaf Node) ise, onu Obje (Composite Node) yap.
    if (Array.isArray(current)) {
      const confirmTransform = confirm(
          `⚠️ WARNING: The selected category ("${parentKey}") is currently a product list (Leaf Node).\n\nTo add a subcategory, it must be converted into a container (Composite Node).\n\nProducts will be moved to a new subcategory named 'PRODUCTS' to preserve the data structure.\n\nContinue with conversion?`
      );

      if (!confirmTransform) {
        return;
      }

      const existingProducts = current; // Mevcut ürün listesini kaydet

      // ParentObj'deki Leaf Node'u Composite Node'a dönüştür.
      parentObj[parentKey] = {};
      
      // Yeni Composite Node'a referans ver
      current = parentObj[parentKey];
      
      // Mevcut ürünleri yeni oluşturulan Composite Node'un altında "PRODUCTS" adında bir Leaf Node (Array) içine taşı.
      if (existingProducts.length > 0) {
          current['PRODUCTS'] = existingProducts;
          console.log(`ℹ️ Products moved to new sub-category 'PRODUCTS' for category: ${parentKey}`);
      }
      
      console.log(`✅ Leaf Node "${parentKey}" successfully converted to Composite Node {}.`);
    }
    // 💥 KRİTİK DÜZELTME BİTİŞİ

    const subCatKeyName = catName.toUpperCase();
    if (current[subCatKeyName]) {
      alert(
        `❌ Subcategory "${catName}" already exists under "${window.selectedCategoryPath.join(
          " → "
        )}"!`
      );
      return;
    }

    current[subCatKeyName] = newCategoryContent;
    console.log(`✅ Subcategory "${catName}" created as Composite Node {}`);
  }

  window.inventoryState = state;
  localStorage.setItem("inventoryState", JSON.stringify(state));

  alert(`✅ Category "${catName}" added successfully! Redirecting to home page...`);

  setTimeout(function () {
    window.location.reload();
  }, 500);
};

// 🌟 KRİTİK DÜZELTME: Dropdown'ı temizleyip yeniden doldurma garantisi (Tüm Ana Kategorileri Listeler)
window.loadCategoryParentDropdown = function () {
  const parentSelect = document.getElementById("parent-cat-select");
  if (!parentSelect) {
    return;
  }

  const state = JSON.parse(localStorage.getItem("inventoryState")) || {};

  // 1. Tüm seçenekleri temizle (Çift Root sorununu çözer)
  while (parentSelect.options.length > 0) {
    parentSelect.remove(0);
  }

  // 2. Varsayılan Root (Top-Level) seçeneğini manuel olarak ekle
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Root (Top-Level) --";
  parentSelect.appendChild(defaultOption);

  if (Object.keys(state).length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent =
      "⚠️ No categories (Go to Add Product → Initialize Sample Data)";
    parentSelect.appendChild(option);
    return;
  }

  // 3. Ana kategorileri ekle (TÜM KATEGORİLERİ SEÇİLEBİLİR YAPIYORUZ)
  for (const categoryName in state) {
    const categoryContent = state[categoryName];
    const isProductList = Array.isArray(categoryContent);
    
    const option = document.createElement("option");
    option.value = categoryName;

    const prefix = isProductList ? "📄 " : "📦 "; // Leaf vs. Composite
    const suffix = isProductList ? " (Ürün Listesi - Dönüşüm Gerekebilir)" : "";

    option.textContent = `${prefix}${categoryName}${suffix}`;
    parentSelect.appendChild(option);
  }
};

// Otomatik yüklemeyi başlat
function attemptLoadCategories() {
  const parentSelect = document.getElementById("parent-cat-select");
  if (parentSelect && typeof window.loadCategoryParentDropdown === "function") {
    window.loadCategoryParentDropdown();
  } else {
    setTimeout(attemptLoadCategories, 100);
  }
}
attemptLoadCategories();