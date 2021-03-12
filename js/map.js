import { formNode, toggleDisabledOnFormNodes } from './form.js';
import { getOfferCard } from './card.js';

const L = window.L;
const mapLng = 139.83947;
const mapLat = 35.65283;
const map = L.map('map-canvas')
  .on('load', () => {
    toggleDisabledOnFormNodes();
    formNode.address.value = `${mapLat}, ${mapLng}`
  })
  .setView({
    lat: mapLat,
    lng: mapLng,
  }, 10);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: '../img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const regularPinIcon = L.icon({
  iconUrl: '../img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const mainPin = L.marker(
  {
    lat: mapLat,
    lng: mapLng,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainPin.addTo(map)

mainPin.on('drag', (evt) => {
  const coords = evt.target.getLatLng();
  const lng = coords.lng.toFixed(5);
  const lat = coords.lat.toFixed(5);
  formNode.address.value = `${lat}, ${lng}`;
});

const generateOffers = (number) => {
  const randomOffersFragment = document.createDocumentFragment();
  for (let i = 1; i <= number; i++) {
    randomOffersFragment.appendChild(getOfferCard());
  }

  return randomOffersFragment;
}

const offers = generateOffers(10);

for (let child of offers.children) {
  const address = child.querySelector('.popup__text--address').textContent;
  const regularPin = L.marker(
    {
      lat: address.substring(0, address.indexOf(',')),
      lng: address.substring(address.indexOf(' ') + 1),
    },
    {
      draggable: false,
      icon: regularPinIcon,
    },
  )

  regularPin.addTo(map).bindPopup(child);
}
