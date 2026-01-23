import './style.css'

let allCards = []; // Store all cards for filtering
let activeFilters = new Set(); // Store active filter tags

// Fetch and populate Index page content
async function fetchIndexPageContent() {
  try {
    const response = await fetch('/api/getIndexPage');
    const data = await response.json();

    if (response.ok) {
      // Update index_title with Name field (can contain HTML like <img> tags)
      const indexTitle = document.querySelector('.index_title');
      if (indexTitle && data.name) {
        indexTitle.innerHTML = data.name;
      }

      // Update title image if provided separately
      if (data.titleImage) {
        const existingImage = document.querySelector('.nameLogo');
        if (existingImage) {
          existingImage.src = data.titleImage;
          existingImage.alt = data.name || 'Leilei Xia';
        }
      }

      // Update website title in nav (extract text only, no HTML)
      const navLogo = document.querySelector('.nav__logo');
      if (navLogo && data.name) {
        // Create a temporary div to strip HTML tags for nav title
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data.name;
        navLogo.textContent = tempDiv.textContent || tempDiv.innerText || data.name;
      }

      // Update page title (extract text only, no HTML)
      if (data.name) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data.name;
        const plainText = tempDiv.textContent || tempDiv.innerText || data.name;
        document.title = `${plainText} - Artist`;
      }

      // Update hero title accent (from slug)
      const heroTitleAccent = document.querySelector('.hero__title--accent');
      if (heroTitleAccent && data.slug) {
        heroTitleAccent.innerHTML = data.slug.replace(/\n/g, '<br>');
      }

      // Update hero subtitle (from description)
      const heroSubtitle = document.querySelector('.hero__subtitle');
      if (heroSubtitle && data.description) {
        heroSubtitle.innerHTML = data.description.replace(/\n/g, '<br>');
      }

      // Update About section with page content
      if (data.content && data.content.length > 0) {
        const aboutText = document.querySelector('.about__text .about__intro');
        if (aboutText) {
          aboutText.innerHTML = renderNotionBlocks(data.content);
        }
      }

      console.log('Index page content loaded successfully');
    } else {
      console.warn('Index page not found in database. Using default content.');
    }
  } catch (error) {
    console.error('Error fetching Index page:', error);
    // Silently fail and use existing HTML content
  }
}

// Render Notion blocks to HTML
function renderNotionBlocks(blocks) {
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        const text = block.paragraph?.rich_text?.map(rt => {
          let html = rt.plain_text || '';
          if (rt.annotations?.bold) html = `<strong>${html}</strong>`;
          if (rt.annotations?.italic) html = `<em>${html}</em>`;
          if (rt.annotations?.code) html = `<code>${html}</code>`;
          if (rt.href) html = `<a href="${rt.href}" target="_blank" rel="noopener noreferrer">${html}</a>`;
          return html;
        }).join('') || '';
        return `<p>${text}</p>`;

      case 'heading_1':
        const h1Text = block.heading_1?.rich_text?.map(rt => rt.plain_text).join('') || '';
        return `<h1>${h1Text}</h1>`;

      case 'heading_2':
        const h2Text = block.heading_2?.rich_text?.map(rt => rt.plain_text).join('') || '';
        return `<h2>${h2Text}</h2>`;

      case 'heading_3':
        const h3Text = block.heading_3?.rich_text?.map(rt => rt.plain_text).join('') || '';
        return `<h3>${h3Text}</h3>`;

      case 'bulleted_list_item':
        const liText = block.bulleted_list_item?.rich_text?.map(rt => rt.plain_text).join('') || '';
        return `<li>${liText}</li>`;

      default:
        return '';
    }
  }).join('');
}

async function fetchTagOptions() {
  try {
    const response = await fetch('/api/getTagOptions');
    const data = await response.json();
    return data.tagOptions || [];
  } catch (error) {
    console.error('Error fetching tag options:', error);
    return [];
  }
}

function setupFilterUI(tagOptions) {
  const filterTags = document.getElementById('filterTags');
  const filterToggle = document.getElementById('filterToggle');
  const filterOptions = document.getElementById('filterOptions');
  
  if (!filterTags || !filterToggle || !filterOptions) return;
  
  // Add "Show All" option
  const showAllTag = document.createElement('span');
  showAllTag.className = 'filter-tag show-all active';
  showAllTag.textContent = 'Show All';
  showAllTag.addEventListener('click', () => {
    activeFilters.clear();
    updateFilterUI();
    filterCards();
  });
  filterTags.appendChild(showAllTag);
  
  // Add tag filter options
  tagOptions.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.className = 'filter-tag';
    tagElement.textContent = tag.name;
    tagElement.addEventListener('click', () => {
      if (activeFilters.has(tag.name)) {
        activeFilters.delete(tag.name);
      } else {
        activeFilters.add(tag.name);
      }
      updateFilterUI();
      filterCards();
    });
    filterTags.appendChild(tagElement);
  });
  
  // Toggle filter visibility
  filterToggle.addEventListener('click', () => {
    const isOpen = filterOptions.classList.contains('show');
    if (isOpen) {
      filterOptions.classList.remove('show');
      filterToggle.classList.remove('active');
    } else {
      filterOptions.classList.add('show');
      filterToggle.classList.add('active');
    }
  });
}

function updateFilterUI() {
  const filterTags = document.querySelectorAll('.filter-tag');
  filterTags.forEach(tag => {
    if (tag.classList.contains('show-all')) {
      tag.classList.toggle('active', activeFilters.size === 0);
    } else {
      tag.classList.toggle('active', activeFilters.has(tag.textContent));
    }
  });
}

function filterCards() {
  const cardContainer = document.querySelector('#app');
  if (!cardContainer || !allCards.length) return;
  
  let filteredCards = allCards;
  
  // If filters are active, filter the cards
  if (activeFilters.size > 0) {
    filteredCards = allCards.filter(card => {
      const cardTags = card.properties.tag?.multi_select || [];
      return cardTags.some(tag => activeFilters.has(tag.name));
    });
  }
  
  // Re-render filtered cards
  renderCards(filteredCards);
}

function renderCards(cards) {
  const cardContainer = document.querySelector('#app');
  if (!cardContainer) return;
  
  if (cards.length === 0) {
    cardContainer.innerHTML = '<p class="section__subtitle">No projects match the selected filters.</p>';
    return;
  }
  
  cardContainer.innerHTML = cards.map((card) => {
    const imageUrl = card.properties.titleImage?.files?.[0]?.external?.url || card.properties.titleImage?.files?.[0]?.file?.url;
    const title = card.properties.Name?.title?.[0]?.plain_text || 'Untitled';
    const description = card.properties.description?.rich_text?.[0]?.plain_text || 'No description available';
    const tags = card.properties.tag?.multi_select || [];
    const type = card.properties.type?.select?.name || "Project";
    const slug = card.properties.slug?.rich_text?.[0]?.plain_text || card.id;
    
    // Generate tag HTML
    const tagHTML = tags.length > 0 
      ? tags.map(tag => `<span class="tag">${tag.name}</span>`).join('')
      : '<span class="tag">Project</span>';
    
    return `
      <article class="card">
        <a href="/generated/${slug}.html" class="card__link">
          <div class="card__image-wrapper">
            <img src="${imageUrl}" 
                 alt="${title}" class="card__image">
            <div class="card__overlay">
              <span class="card__category">${type}</span>
            </div>
          </div>
          <div class="card__content">
            <h3 class="card__title">${title}</h3>
            <p class="card__description">${description}</p>
            <div class="card__tags">
              ${tagHTML}
            </div>
          </div>
        </a>
      </article>
    `;
  }).join('');
}

async function fetchDataFromAPIEndPoint(){
  try {
    const cards = await fetch('/api/fetchNotion')
      .then((res) => res.json())
      .then((data) => data.results);
    
    console.log(cards);
    
    // Sort cards by ordering property
    allCards = cards.sort((a, b) => {
      const orderA = a.properties.ordering?.number || 999;
      const orderB = b.properties.ordering?.number || 999;
      return orderA - orderB;
    });
    
    // Render all cards initially
    renderCards(allCards);
    
    // Setup filter UI
    const tagOptions = await fetchTagOptions();
    setupFilterUI(tagOptions);
  } catch (error) {
    console.error('Error fetching data:', error);
    const cardContainer = document.querySelector('#app');
    if (cardContainer) {
      cardContainer.innerHTML = '<p>Unable to load projects at this time.</p>';
    }
  }
}

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Add smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize theme
  initTheme();

  // Fetch Index page content
  await fetchIndexPageContent();

  // Fetch data
  await fetchDataFromAPIEndPoint();
  
  // Add scroll effect to navigation
  const nav = document.querySelector('.nav');
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;
  });
});
