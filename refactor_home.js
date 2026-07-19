const fs = require('fs');
let c = fs.readFileSync('d:/AdHubKenya/client-react/src/pages/Home.jsx', 'utf8');

c = c.replace(
  /import \{ getTrendingSearches, getCountyCounts \} from '@\/lib\/api';/, 
  'import { getTrendingSearches, getCountyCounts } from \'@/lib/api\';\nimport HomeCategoryNav from \'@/components/HomeCategoryNav\';'
);

c = c.replace(/function CategorySidebar[\s\S]*?^}\r?\n/m, '');
c = c.replace(/<CategorySidebar[^>]*\/>/g, '<HomeCategoryNav />');

fs.writeFileSync('d:/AdHubKenya/client-react/src/pages/Home.jsx', c);
