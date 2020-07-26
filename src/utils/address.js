export default function shorten (address) {
  return address.substring(0, 4) + '...' + address.substring(address.length - 5, address.length);
}
