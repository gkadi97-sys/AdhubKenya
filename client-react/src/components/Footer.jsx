import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
              <span style={{background:'var(--primary)',color:'#fff',width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800}}>A</span>
              <span style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.2rem'}}>
                <span style={{color:'var(--primary-light)'}}>Ad</span>Hub
                <span style={{color:'var(--accent)',fontSize:'0.6rem',letterSpacing:2,textTransform:'uppercase',marginLeft:4}}>Kenya</span>
              </span>
            </div>
            <p>Kenya's fastest growing classified ads marketplace. Buy and sell anything — electronics, vehicles, property, and more.</p>
            <div style={{display:'flex',gap:10,marginTop:16}}>
              {['📘','🐦','📸','▶️'].map((icon,i) => (
                <span key={i} style={{fontSize:'1.2rem',cursor:'pointer',opacity:0.7}}>{icon}</span>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              {[['Electronics','/category/electronics'],['Vehicles','/category/vehicles'],['Property','/category/property'],['Fashion','/category/fashion'],['Services','/category/services']].map(([name,href]) => (
                <li key={name}><Link href={href}>{name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {[['Browse All Ads','/browse'],['Post Free Ad','/post-ad'],['Register','/register'],['Login','/login'],['My Ads','/my-ads']].map(([name,href]) => (
                <li key={name}><Link href={href}>{name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              {[['Help Center','#'],['Safety Tips','#'],['Report Ad','#'],['Contact Us','#'],['Terms of Use','#']].map(([name,href]) => (
                <li key={name}><Link href={href}>{name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AdHub Kenya. All rights reserved.</p>
          <p>🇰🇪 Made in Kenya</p>
        </div>
      </div>
    </footer>
  );
}
