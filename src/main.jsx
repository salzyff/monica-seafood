import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, ShoppingBag, Menu, X, Plus, Minus, MessageCircle, MapPin, Fish, Globe2, Phone, ChevronDown, Check, Waves } from 'lucide-react';
import { products, sanitizeBasket, updateQuantity, createOrderMessage, whatsappUrl } from './order';
import './styles.css';

const chatUrl = whatsappUrl('Hi Monica! I found your website and would like to know what is available today.');
const faqs = [
  ['How do I place an order?', 'Choose the items you’re interested in and add them to your order. Open your basket, include your location and any quantities or weights you need, then send your enquiry on WhatsApp. Monica will confirm the details with you.'],
  ['Where can you deliver?', 'Monica is based in Sangotedo, Lagos. Local and international delivery enquiries are welcome. Send your location on WhatsApp to confirm whether your order can be delivered, along with the cost and timing.'],
  ['Where are the prices?', 'Prices and pack sizes are confirmed directly with Monica, so you get a quote for the items and quantities you actually need. Sending an enquiry does not place or pay for an order.'],
  ['Can I see the actual products before ordering?', 'Yes — ask Monica for current product photos and available pack sizes on WhatsApp. The website currently uses photo placeholders. You can ask for actual product photos before ordering.'],
];

function Brand({ light = false }) {
  return <a className={`brand ${light ? 'light' : ''}`} href="#home" aria-label="Monica Seafood home"><span className="brand-icon"><Fish size={34} strokeWidth={1.3}/></span><span><span className="brand-name">monica<span className="brand-dot">.</span></span><span className="brand-caption">SEAFOOD & PANTRY</span></span></a>;
}
function ChatLink({ children = 'Chat with Monica', className = 'button coral', message }) {
  return <a className={className} href={message ? whatsappUrl(message) : chatUrl} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={18}/></a>;
}
function App() {
  const [basket, setBasket] = useState(() => { try { return sanitizeBasket(JSON.parse(localStorage.getItem('monica-order') || '{}')); } catch { return {}; } });
  const [filter, setFilter] = useState('All favourites');
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [details, setDetails] = useState({ name: '', location: '', notes: '' });
  const cartButton = useRef(null);
  const dialogRef = useRef(null);
  const toastTimer = useRef(null);
  const count = Object.values(basket).reduce((sum, quantity) => sum + quantity, 0);
  useEffect(() => { try { localStorage.setItem('monica-order', JSON.stringify(basket)); } catch {} }, [basket]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    if (!cartOpen) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector('button')?.focus();
    function onKey(e) {
      if (e.key === 'Escape') setCartOpen(false);
      if (e.key !== 'Tab') return;
      const items = [...dialogRef.current.querySelectorAll('button:not(:disabled), a[href], input, textarea')];
      const first = items[0]; const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKey); previousFocus?.focus(); };
  }, [cartOpen]);
  function add(id) {
    setBasket(current => updateQuantity(current, id, 1));
    setToast(`${products.find(p => p.id === id).name} added to your order`);
    clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 2800);
  }
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <div className="announcement"><span>A little taste of home, wherever you are.</span><a href="#contact">Based in Sangotedo, Lagos <ArrowUpRight size={13}/></a></div>
    <header className="site-header"><div className="container header-inner">
      <Brand/>
      <nav className={menuOpen ? 'navigation open' : 'navigation'} aria-label="Main navigation">
        {[['Our favourites', '#favourites'], ['Our story', '#story'], ['How to order', '#how-to-order']].map(([title, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{title}</a>)}
      </nav>
      <div className="header-actions"><button className="bag-button" ref={cartButton} onClick={() => { setCartOpen(true); setMenuOpen(false); }} aria-label={`Open your order, ${count} items`}><ShoppingBag size={20}/><span className="bag-label">Your order</span><span className="bag-count">{count}</span></button><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X/> : <Menu/>}</button></div>
    </div></header>
    <main id="main">
      <section className="hero container" id="home">
        <div className="hero-copy"><div className="eyebrow"><span className="tiny-line"/> GOOD FOOD. FAMILIAR FLAVOURS.</div><h1>A little taste<br/>of <em>home.</em></h1><p>Dried seafood and Nigerian pantry favourites for the meals that bring us together. From Monica, with love.</p><div className="hero-buttons"><a href="#favourites" className="button coral">Explore our favourites <ArrowUpRight size={19}/></a><a href="#story" className="text-link">Meet Monica <ArrowRight size={17}/></a></div><div className="hero-footnote"><span className="mini-fish"><Fish size={24} strokeWidth={1.3}/></span><span>For your everyday pot.<br/><strong>And the people around it.</strong></span></div></div>
        <div className="hero-visual"><div className="hero-photo"><img src="/images/hero.svg" alt="Placeholder for a seafood photograph" fetchPriority="high"/><span className="image-label">THE GOOD STUFF, FOR YOUR POT.</span></div><div className="love-stamp"><span>FROM MONICA</span><Fish size={32} strokeWidth={1.2}/><span>WITH LOVE</span></div><div className="hero-note"><span className="note-icon"><Waves size={28} strokeWidth={1.3}/></span><div><span>A familiar favourite</span><strong>Big flavour. Good company.</strong></div></div><span className="hero-number">01 / A TASTE OF HOME</span></div>
      </section>
      <div className="ribbon"><span>Dried fish</span><span className="ribbon-star">✳</span><span>Crayfish</span><span className="ribbon-star">✳</span><span>Dried prawns</span><span className="ribbon-star">✳</span><span>Pantry favourites</span><span className="ribbon-star">✳</span><span>A taste of home</span></div>
      <section className="favourites container section" id="favourites"><div className="section-heading"><div><div className="eyebrow">THE PANTRY, SORTED</div><h2>Good things for<br/><em>great meals.</em></h2></div><p>Start with your favourites.<br/>We’ll help you take it from there.</p></div>
        <div className="shop-toolbar"><div className="filters" aria-label="Filter products">{['All favourites', 'Seafood', 'Pantry'].map(category => <button key={category} className={filter === category ? 'active' : ''} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div><span className="quote-note">Prices confirmed with Monica <ArrowUpRight size={14}/></span></div>
        <div className="product-grid">{products.filter(p => filter === 'All favourites' || p.category === filter).map(p => <article className="product" key={p.id}><div className={`product-image image-${p.id}`}><img src={p.image} alt={p.alt} loading="lazy"/><span className="product-category">{p.category}</span><button className="add-circle" onClick={() => add(p.id)} disabled={basket[p.id] >= 99} aria-label={`Add ${p.name} to your order`}><Plus size={23}/></button></div><div className="product-topline"><span>{p.tag}</span><span>0{products.findIndex(item => item.id === p.id) + 1}</span></div><h3>{p.name}</h3><p>{p.description}</p><button className="product-link" onClick={() => add(p.id)} disabled={basket[p.id] >= 99}>{basket[p.id] ? `${basket[p.id]} in your order · Add another` : 'Add to your order'} <ArrowUpRight size={16}/></button></article>)}</div>
        <p className="photo-note">Product photos are coming soon. Ask Monica for current stock, photos and pack sizes.</p>
      </section>
      <section className="story" id="story"><div className="container story-inner"><div className="story-art"><div className="story-arch"><svg viewBox="0 0 400 400" fill="none" aria-hidden="true"><path d="M78 209c50-91 166-103 225-5-66 86-176 82-225 5Zm225-5 54-50v104l-54-54Z" stroke="currentColor" strokeWidth="2.5"/><path d="M148 151c29 21 36 73 9 101M205 149c-15 22-15 79 6 107M101 315c55-21 114 23 178 2M94 331c59-23 126 22 192 0M152 119c27-36 61-29 76 1" stroke="currentColor" strokeWidth="2"/><circle cx="119" cy="192" r="6" fill="currentColor"/><path d="m246 170 27 9m-34 18 44 1m-39 25 29-9" stroke="currentColor" strokeWidth="2"/></svg><span>FOOD THAT FEELS LIKE HOME</span></div><span className="art-caption">A familiar flavour. A personal touch.</span></div><div className="story-copy"><div className="eyebrow">THE PERSON BEHIND THE PANTRY</div><h2>Meet Monica.<br/>Your next<br/><em>food plug.</em></h2><p>Monica Iornum is the founder behind Nica Foods in Sangotedo, Lagos — bringing Nigerian foods, dried fish and pantry favourites to your table.</p><p>This is a place to discover her seafood selection and start a conversation. Tell her what you’re cooking, what you need, and where you are. She’ll help with the rest.</p><a href="https://www.facebook.com/mngu.monica/" className="story-link" target="_blank" rel="noreferrer">Say hello to Monica <ArrowUpRight size={19}/></a><div className="founder-signoff"><span className="signature">Monica</span><span>MONICA IORNUM<br/>FOUNDER, NICA FOODS</span></div></div></div></section>
      <section className="how-section container section" id="how-to-order"><div className="section-heading"><div><div className="eyebrow">NO LONG STORY</div><h2>Your favourites.<br/><em>Three simple steps.</em></h2></div><ChatLink className="text-link">Let’s talk food</ChatLink></div><div className="steps">{[[ShoppingBag, 'Pick your favourites', 'Browse the selection and add what you’d like to your order. One item or a whole pantry — start wherever you like.'], [MessageCircle, 'Have a little chat', 'Send your list to Monica on WhatsApp. She’ll confirm availability, sizes and the price for your order.'], [MapPin, 'Sort the details', 'Share your location and agree delivery, timing and payment directly with Monica.']].map(([Icon, title, copy], i) => <div className="step" key={title}><div className="step-top"><Icon size={27} strokeWidth={1.3}/><span>0{i+1}</span></div><h3>{title}</h3><p>{copy}</p></div>)}</div></section>
      <section className="faq-section container"><div><div className="eyebrow">A FEW THINGS TO KNOW</div><h2>Before you<br/><em>fill your pot.</em></h2><p>Something else on your mind?<br/><a href={chatUrl} target="_blank" rel="noreferrer">Just ask Monica <ArrowUpRight size={15}/></a></p></div><div className="faqs">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20}/></summary><p>{answer}</p></details>)}</div></section>
      <section className="contact-section container" id="contact"><div className="contact-card"><div><div className="eyebrow">LET’S MAKE SOMETHING GOOD</div><h2>What’s cooking<br/><em>in your kitchen?</em></h2><p>Tell Monica what you have in mind.<br/>Good food starts with a conversation.</p><ChatLink>Order on WhatsApp</ChatLink></div><div className="contact-details"><span className="contact-script">Let’s talk food.</span><a href="tel:+2348157542436"><Phone size={21} strokeWidth={1.3}/><span><small>GIVE MONICA A CALL</small>0815 754 2436</span><ArrowUpRight size={20}/></a><div><MapPin size={21} strokeWidth={1.3}/><span><small>FROM OUR CORNER OF LAGOS</small>Sangotedo, Lagos</span></div><div><Globe2 size={21} strokeWidth={1.3}/><span><small>NEAR OR FAR</small>Ask about delivery to your location</span></div></div></div></section>
    </main>
    <footer><div className="container footer-top"><Brand light/><p>For the meals that bring us together.</p><a href="https://www.facebook.com/mngu.monica/" target="_blank" rel="noreferrer">Find Monica on Facebook <ArrowUpRight size={16}/></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Monica Seafood. From Monica, with love.</span><a href="#home">Back to the top ↑</a></div></footer>
    <a className="floating-chat" href={chatUrl} target="_blank" rel="noreferrer" aria-label="Chat with Monica on WhatsApp"><MessageCircle size={23}/></a>
    <div role="status" aria-live="polite" className={toast ? 'toast visible' : 'toast'}>{toast && <><Check size={18}/>{toast}</>}</div>
    {cartOpen && <div className="cart-overlay" onClick={e => { if (e.target === e.currentTarget) setCartOpen(false); }}><section className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" ref={dialogRef}><div className="cart-header"><div><div className="eyebrow">SOMETHING GOOD IS COOKING</div><h2 id="cart-title">Your order<span>.</span></h2></div><button className="icon-button" aria-label="Close your order" onClick={() => setCartOpen(false)}><X/></button></div>{count ? <><div className="cart-items">{products.filter(p => basket[p.id]).map(p => <div className="cart-item" key={p.id}><img src={p.image} alt=""/><div><h3>{p.name}</h3><p>Pack size & price to confirm</p><div className="quantity"><button onClick={() => setBasket(current => updateQuantity(current, p.id, -1))} aria-label={`Remove one ${p.name}`}><Minus size={15}/></button><span aria-label={`${basket[p.id]} ${p.name}`}>{basket[p.id]}</span><button disabled={basket[p.id] >= 99} onClick={() => setBasket(current => updateQuantity(current, p.id, 1))} aria-label={`Add one ${p.name}`}><Plus size={15}/></button></div></div><button className="remove-item" onClick={() => setBasket(current => { const next = {...current}; delete next[p.id]; return next; })} aria-label={`Remove ${p.name} from order`}><X size={16}/></button></div>)}</div><div className="order-details"><h3>A few details for Monica</h3><label>Your name <span>(optional)</span><input autoComplete="name" value={details.name} maxLength={100} onChange={e => setDetails({...details, name: e.target.value})} placeholder="What should Monica call you?"/></label><label>Delivery location <span>(optional)</span><input autoComplete="address-level2" value={details.location} maxLength={200} onChange={e => setDetails({...details, location: e.target.value})} placeholder="Your area, city or country"/></label><label>Anything else? <span>(optional)</span><textarea value={details.notes} maxLength={1200} onChange={e => setDetails({...details, notes: e.target.value})} placeholder="Desired weights, quantities or a question…" rows={3}/></label></div><div className="cart-checkout"><p>This sends an enquiry. Monica will confirm your quote and delivery before you pay.</p><a className="button coral" href={whatsappUrl(createOrderMessage(basket, details))} target="_blank" rel="noreferrer">Send order on WhatsApp <ArrowUpRight size={19}/></a><button className="continue-link" onClick={() => setCartOpen(false)}>Keep browsing</button></div></> : <div className="empty-cart"><ShoppingBag size={50} strokeWidth={1}/><h3>A little room for<br/>your favourites.</h3><p>Add something you’d love to cook with, then send your list to Monica.</p><button className="button coral" onClick={() => { setCartOpen(false); document.getElementById('favourites').scrollIntoView({behavior: 'smooth'}); }}>Explore the selection <ArrowRight size={18}/></button></div>}</section></div>}
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
