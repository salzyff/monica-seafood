export const WHATSAPP_NUMBER = '2348157542436';
export const products = [
  { id: 'fish', name: 'Dried fish', category: 'Seafood', tag: 'For the good soups', description: 'That rich, familiar flavour for your soups, stews and everyday cooking.', image: '/images/dried-fish.svg', alt: 'Placeholder for a dried fish product photo' },
  { id: 'crayfish', name: 'Crayfish', category: 'Seafood', tag: 'A little goes a long way', description: 'The little ingredient that brings a whole pot together.', image: '/images/crayfish.svg', alt: 'Placeholder for a crayfish product photo' },
  { id: 'prawns', name: 'Dried prawns', category: 'Seafood', tag: 'Bring on the flavour', description: 'For the pots you want everyone to come back to.', image: '/images/prawns.svg', alt: 'Placeholder for a dried prawns product photo' },
  { id: 'pap', name: 'Mixed-grain pap', category: 'Pantry', tag: 'Slow morning favourites', description: 'A familiar Nigerian pantry favourite for your breakfast table.', image: '/images/pap.svg', alt: 'Placeholder for a mixed-grain pap product photo' },
];

export function sanitizeBasket(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(products.filter(p => Number.isInteger(value[p.id]) && value[p.id] > 0 && value[p.id] <= 99).map(p => [p.id, value[p.id]]));
}
export function updateQuantity(basket, id, amount) {
  if (!products.some(p => p.id === id)) return basket;
  const next = { ...basket, [id]: Math.max(0, Math.min(99, (basket[id] || 0) + amount)) };
  if (!next[id]) delete next[id];
  return next;
}
export function createOrderMessage(basket, details = {}) {
  const items = products.filter(p => basket[p.id] > 0);
  if (!items.length) return '';
  return [
    'Hi Monica! I would like to enquire about this order:',
    '',
    ...items.map(p => `• ${p.name} × ${basket[p.id]} (pack size to confirm)`),
    '',
    details.name?.trim() ? `Name: ${details.name.trim()}` : '',
    details.location?.trim() ? `Delivery location: ${details.location.trim()}` : '',
    details.notes?.trim() ? `Notes / desired weights: ${details.notes.trim()}` : '',
    '',
    'Please confirm availability, pack sizes, prices and delivery cost before I place my order. Thank you!',
  ].filter(line => line !== undefined).join('\n');
}
export function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
