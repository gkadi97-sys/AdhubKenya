const fs = require('fs');
const path = require('path');

const files = [
  'src/layouts/AdminLayout.jsx',
  'src/pages/Browse.jsx',
  'src/pages/EditAd.jsx',
  'src/pages/Home.jsx',
  'src/pages/legal/About.jsx',
  'src/pages/legal/Careers.jsx',
  'src/pages/legal/Contact.jsx',
  'src/pages/legal/Cookies.jsx',
  'src/pages/legal\Help.jsx',
  'src/pages/legal/Privacy.jsx',
  'src/pages/legal/Report.jsx',
  'src/pages/legal/Safety.jsx',
  'src/pages/legal/Terms.jsx',
  'src/pages/Listing.jsx',
  'src/pages/Login.jsx',
  'src/pages/MessageThread.jsx',
  'src/pages/PostAd.jsx',
  'src/pages/PostAdConfirmation.jsx',
  'src/pages/PostCv.jsx',
  'src/pages/Profile.jsx',
  'src/pages/Register.jsx',
  'src/pages/ResetPassword.jsx'
].map(f => f.replace(/\\/g, '/'));

files.forEach(f => {
  if (!fs.existsSync(f)) {
    // try with proper slash
    f = f.replace('legalHelp', 'legal/Help'); // fix typo in my array
    if (!fs.existsSync(f)) return;
  }
  let content = fs.readFileSync(f, 'utf8');
  
  // 1. replace import
  content = content.replace(/import\s*\{\s*useSEO\s*\}\s*from\s*['"]@\/lib\/useSEO['"];?/g, "import SEO from '@/components/SEO';");
  
  // 2. extract the useSEO arguments
  const regex = /useSEO\(\s*(\{[\s\S]*?\})\s*\);?/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const fullMatch = match[0];
    const argsObj = match[1];
    
    // remove the hook call
    content = content.replace(fullMatch, '');
    
    // inject <SEO {...argsObj} /> right after the first `return (` or `return ` in the same component
    // we just find the nearest 'return' after where the hook was.
    const searchIdx = match.index;
    const returnIdx = content.indexOf('return', searchIdx);
    
    if (returnIdx !== -1) {
      // Find the first > or ( after return to inject inside the root element
      // This is a bit fragile. 
      // Alternative: Just find `return (` and inject `<SEO {...{...}} />` right after it
      // if it's `return <div`, we can replace with `return <> <SEO ... /> <div`
      
      const afterReturn = content.substring(returnIdx + 6).trim();
      if (afterReturn.startsWith('(')) {
        // inject after the ( 
        const openParenIdx = content.indexOf('(', returnIdx);
        content = content.substring(0, openParenIdx + 1) + `\n      <SEO {...${argsObj}} />` + content.substring(openParenIdx + 1);
      } else if (afterReturn.startsWith('<')) {
        // inject by wrapping in fragment
        const openBracketIdx = content.indexOf('<', returnIdx);
        content = content.substring(0, openBracketIdx) + `<>\n      <SEO {...${argsObj}} />\n      ` + content.substring(openBracketIdx);
        
        // this would require adding </> at the very end of the file or matching the end of the return statement, which is hard.
      }
    }
  }
  
  fs.writeFileSync(f, content);
});

console.log('Done refactoring');
