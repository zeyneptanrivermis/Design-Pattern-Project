// 🆕 GÜNCELLENMIŞ: Sınırsız derinlik destekli

window.initializeSampleData = function() {
  // 🔧 DÜZELTME: Eğer zaten veri varsa, üzerine yazma!
  const existingState = JSON.parse(localStorage.getItem('inventoryState'));
  
  if (existingState && Object.keys(existingState).length > 0) {
    const confirm = window.confirm('⚠️ Data already exists!\n\nDo you want to RESET and lose all added products?\n\n✅ YES = Reset to sample data\n❌ NO = Keep current data');
    
    if (!confirm) {
      console.log('ℹ️ User cancelled reset');
      alert('✅ Your existing data is safe!');
      window.inventoryState = existingState;
      window.loadParentCategories();
      return;
    }
  }
  
  // index.html'deki DEFAULT_STATE ile aynı yapıyı kullan
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

  localStorage.setItem('inventoryState', JSON.stringify(window.inventoryState));
  console.log('✅ Sample data initialized!');
  alert('✅ Sample data loaded! (Previous data was reset)');
  window.loadParentCategories();
};

// 🆕 Global değişken: Seçilen kategori yolu
window.selectedCategoryPath = [];

window.loadParentCategories = function() {
  const state = window.inventoryState || JSON.parse(localStorage.getItem('inventoryState')) || {};
  const parentSelect = document.getElementById('parent-category');
  
  if (!parentSelect) return;

  console.log('📦 inventoryState:', state);

  // Reset
  window.selectedCategoryPath = [];
  
  // 🔧 DÜZELTME: Önce dynamic dropdown'ları temizle
  removeDynamicDropdowns();
  
  while (parentSelect.options.length > 1) {
    parentSelect.remove(1);
  }

  // Ana kategorileri ekle
  for (const categoryName in state) {
    const option = document.createElement('option');
    option.value = categoryName;
    option.textContent = `📦 ${categoryName}`;
    parentSelect.appendChild(option);
    console.log('✅ Added top-level category:', categoryName);
  }
  
  // 🔧 DÜZELTME: Path'i güncelle
  window.updateSelectedPath();
};

window.loadSubcategories = function() {
  const parentName = document.getElementById('parent-category').value;
  
  if (!parentName) {
    // Tüm dynamic dropdown'ları temizle
    removeDynamicDropdowns();
    window.selectedCategoryPath = [];
    window.updateSelectedPath();
    return;
  }

  // Yolu güncelle
  window.selectedCategoryPath = [parentName];
  
  // Dynamic dropdown'ları temizle ve yeniden oluştur
  removeDynamicDropdowns();
  
  const state = window.inventoryState || JSON.parse(localStorage.getItem('inventoryState')) || {};
  const currentCategory = state[parentName];

  console.log('🔍 Selected:', parentName, 'Type:', typeof currentCategory, 'isArray:', Array.isArray(currentCategory));

  // 🔧 DÜZELTME: Sadece obje ise (array değilse) dropdown ekle
  if (currentCategory && typeof currentCategory === 'object' && !Array.isArray(currentCategory)) {
    createNextLevelDropdown(currentCategory, 1);
  } else if (Array.isArray(currentCategory)) {
    console.log('✅ This is a product list (array), no more dropdowns needed');
  }

  window.updateSelectedPath();
};

// 🆕 YENİ: Dynamic dropdown oluştur
function createNextLevelDropdown(categoryObj, level) {
  const container = document.querySelector('.catalog');
  const categorySelectionDiv = container.querySelector('div[style*="background-color: #f8f9fa"]');
  
  if (!categorySelectionDiv) {
    console.error('❌ Category selection div not found');
    return;
  }
  
  // Yeni select oluştur
  const newSelectId = `category-level-${level}`;
  const newLabel = document.createElement('label');
  newLabel.setAttribute('for', newSelectId);
  newLabel.innerHTML = `<strong>Level ${level + 1}:</strong>`;
  
  const newSelect = document.createElement('select');
  newSelect.id = newSelectId;
  newSelect.className = 'dynamic-category-select';
  newSelect.setAttribute('data-level', level); // 🔧 DÜZELTME: Level bilgisi ekle
  newSelect.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 10px; font-size: 14px;';
  newSelect.innerHTML = '<option value="">-- Select Subcategory --</option>';
  
  // Alt kategorileri ekle
  for (const subCatName in categoryObj) {
    const option = document.createElement('option');
    option.value = subCatName;
    option.textContent = `${'└─'.repeat(level)} ${subCatName}`;
    newSelect.appendChild(option);
  }
  
  // Event listener
  newSelect.addEventListener('change', function() {
    handleDynamicDropdownChange(this, level, categoryObj);
  });
  
  // Seçilen yol gösteriminden ÖNCE ekle
  const pathDisplay = document.getElementById('selected-path')?.parentElement;
  if (pathDisplay) {
    categorySelectionDiv.insertBefore(newSelect, pathDisplay);
    categorySelectionDiv.insertBefore(newLabel, newSelect);
  }
  
  console.log(`✅ Created dropdown for level ${level}`);
}

// 🆕 YENİ: Dynamic dropdown değişikliği handle et
function handleDynamicDropdownChange(selectElement, level, parentCategoryObj) {
  const selectedValue = selectElement.value;
  
  console.log(`🔍 Dropdown changed at level ${level}:`, selectedValue);
  
  if (!selectedValue) {
    // Seçim kaldırıldı, sonraki seviyeyi temizle
    window.selectedCategoryPath = window.selectedCategoryPath.slice(0, level);
    removeDropdownsAfterLevel(level);
    window.updateSelectedPath();
    return;
  }
  
  // Yolu güncelle
  window.selectedCategoryPath[level] = selectedValue;
  window.selectedCategoryPath = window.selectedCategoryPath.slice(0, level + 1);
  
  // Sonraki seviyeleri temizle
  removeDropdownsAfterLevel(level);
  
  const nextCategory = parentCategoryObj[selectedValue];
  
  console.log(`🔍 Level ${level} selected:`, selectedValue, 'Type:', typeof nextCategory, 'isArray:', Array.isArray(nextCategory));
  
  // 🔧 DÜZELTME: Sadece obje ise (array değilse) yeni dropdown ekle
  if (nextCategory && typeof nextCategory === 'object' && !Array.isArray(nextCategory)) {
    createNextLevelDropdown(nextCategory, level + 1);
  } else if (Array.isArray(nextCategory)) {
    console.log('✅ Reached product list (array), no more dropdowns');
  }
  
  window.updateSelectedPath();
}

// 🆕 YENİ: Belirli seviyeden sonraki dropdown'ları sil
function removeDropdownsAfterLevel(level) {
  const allDynamicSelects = document.querySelectorAll('.dynamic-category-select');
  
  console.log(`🗑️ Removing dropdowns after level ${level}, found ${allDynamicSelects.length} dropdowns`);
  
  allDynamicSelects.forEach((select) => {
    const selectLevel = parseInt(select.getAttribute('data-level'));
    
    if (selectLevel > level) {
      const label = select.previousElementSibling;
      if (label && label.tagName === 'LABEL') {
        label.remove();
      }
      select.remove();
      console.log(`🗑️ Removed dropdown at level ${selectLevel}`);
    }
  });
}

// 🆕 YENİ: Tüm dynamic dropdown'ları temizle
function removeDynamicDropdowns() {
  const allDynamicSelects = document.querySelectorAll('.dynamic-category-select');
  
  console.log(`🗑️ Removing all ${allDynamicSelects.length} dynamic dropdowns`);
  
  allDynamicSelects.forEach(select => {
    const label = select.previousElementSibling;
    if (label && label.tagName === 'LABEL') {
      label.remove();
    }
    select.remove();
  });
}

window.updateSelectedPath = function() {
  const pathDisplay = document.getElementById('selected-path');
  if (!pathDisplay) return;

  const path = window.selectedCategoryPath.join(' → ');
  pathDisplay.textContent = path || 'Not selected yet';
  pathDisplay.style.color = path ? '#28a745' : '#999';
  
  console.log('📍 Current path:', window.selectedCategoryPath);
};

window.simulateAddProduct = function() {
  const prodName = document.getElementById('prod-name').value;
  const prodPrice = document.getElementById('prod-price').value;
  const prodStock = document.getElementById('prod-stock').value;
  const prodCpu = document.getElementById('prod-cpu').value;
  const prodRam = document.getElementById('prod-ram').value;

  if (window.selectedCategoryPath.length === 0 || !prodName || !prodPrice || !prodStock) {
    alert('❌ Please select a category and fill in all required fields!');
    return;
  }

  const state = window.inventoryState || JSON.parse(localStorage.getItem('inventoryState')) || {};

  // Yolu takip ederek hedef array'i bul
  let current = state;
  let categoryPath = '';
  
  for (let i = 0; i < window.selectedCategoryPath.length; i++) {
    const key = window.selectedCategoryPath[i];
    categoryPath += (i > 0 ? '.' : '') + key;
    current = current[key];
    
    if (!current) {
      alert(`❌ Invalid category path: ${categoryPath}`);
      return;
    }
  }

  // Eğer current hala obje ise, ilk array'i bul
  if (typeof current === 'object' && !Array.isArray(current)) {
    let foundArray = null;
    for (const key in current) {
      if (Array.isArray(current[key])) {
        foundArray = current[key];
        categoryPath += `.${key}`;
        current = foundArray;
        break;
      }
    }
    
    if (!foundArray) {
      alert(`❌ No product array found in "${categoryPath}". Please select a deeper category.`);
      return;
    }
  }

  if (!Array.isArray(current)) {
    alert(`❌ Selected category "${categoryPath}" is not a product list.`);
    return;
  }

  // Yeni ürün oluştur
  const newProduct = {
    id: Date.now(),
    name: prodName + (prodCpu ? ` (${prodCpu})` : ''),
    basePrice: parseFloat(prodPrice),
    finalPrice: parseFloat(prodPrice) * (prodCpu ? 1.15 : 1),
    stock: parseInt(prodStock),
    isDecorated: !!prodCpu,
    categoryPath: categoryPath,
    cpu: prodCpu,
    ram: prodRam ? parseInt(prodRam) : 0
  };

  current.push(newProduct);
  
  // State'i kaydet
  window.inventoryState = state;
  localStorage.setItem('inventoryState', JSON.stringify(state));
  
  console.log('✅ Product added:', newProduct);
  
  // 🆕 BAŞARI MESAJI + ANA SAYFAYA YÖNLENDİRME
  alert(`✅ Product "${prodName}" added to "${categoryPath}"!\n\n💰 Price: $${newProduct.finalPrice.toFixed(2)}\n📦 Stock: ${prodStock}\n\nRedirecting to home page...`);
  
  // 🆕 YENİ: Ana sayfayı yeniden yükle
  setTimeout(function() {
    // SPA routing kullanıyorsanız
    if (typeof loadPage === 'function') {
      loadPage('home');
    } 
    // Veya hash routing
    else if (window.location.hash) {
      window.location.hash = '#/home';
    }
    // Veya tam sayfa yenileme
    else {
      window.location.href = '/index.html';
      window.location.reload();
    }
  }, 500);
};

// Sayfa yüklendiğinde kategorileri yükle
setTimeout(function() {
  if (document.getElementById('parent-category')) {
    window.loadParentCategories();
  }
}, 200);