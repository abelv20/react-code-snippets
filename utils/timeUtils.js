import moment from 'moment-timezone';

const DEFAULT_TIME_FORMAT = 'D MMM YYYY, h:mm A z';
const DEFAULT_TIME_ZONE = 'America/New_York';

/**
 * Attempt to guess the user's timezone.  Falls back to US Eastern Time when
 * a timezone cannot be detected by the browser.
 */
export function userTimeZone() {
  return moment.tz.guess() || DEFAULT_TIME_ZONE;
}

/**
 * Parse a given date string and then reformat based on the given format string, in
 * the given time zone (or, by default, in the user's time zone).
 */
export function formatDate(date, { format = DEFAULT_TIME_FORMAT, tz = userTimeZone() } = {}) {
  return moment.tz(date, tz).format(format);
}

/**
 * Wrapper around `moment().tz(timeZone)` which allows for spying/mocking during
 * tests.  Should be used everywhere in the code, instead of `moment().tz`.
 */
export function getCurrentTime(timeZone = DEFAULT_TIME_ZONE) {
  return moment().tz(timeZone);
}

/**
 * Mapping of Rails time-zones to time-zones that JS/moment.js can understand. The
 * keys are Rails TimeZone names; the values are from the tz database.
 *
 * This is copied from Rails ActiveSupport::TimeZone::MAPPING
 * https://github.com/rails/rails/blob/master/activesupport/lib/active_support/values/time_zone.rb
 */
const RAILS_TZ_MAPPINGS = {
  'International Date Line West': 'Pacific/Midway',
  'Midway Island': 'Pacific/Midway',
  'American Samoa': 'Pacific/Pago_Pago',
  Hawaii: 'Pacific/Honolulu',
  Alaska: 'America/Juneau',
  'Pacific Time (US & Canada)': 'America/Los_Angeles',
  Tijuana: 'America/Tijuana',
  'Mountain Time (US & Canada)': 'America/Denver',
  Arizona: 'America/Phoenix',
  Chihuahua: 'America/Chihuahua',
  Mazatlan: 'America/Mazatlan',
  'Central Time (US & Canada)': 'America/Chicago',
  Saskatchewan: 'America/Regina',
  Guadalajara: 'America/Mexico_City',
  'Mexico City': 'America/Mexico_City',
  Monterrey: 'America/Monterrey',
  'Central America': 'America/Guatemala',
  'Eastern Time (US & Canada)': 'America/New_York',
  'Indiana (East)': 'America/Indiana/Indianapolis',
  Bogota: 'America/Bogota',
  Lima: 'America/Lima',
  Quito: 'America/Lima',
  'Atlantic Time (Canada)': 'America/Halifax',
  Caracas: 'America/Caracas',
  'La Paz': 'America/La_Paz',
  Santiago: 'America/Santiago',
  Newfoundland: 'America/St_Johns',
  Brasilia: 'America/Sao_Paulo',
  'Buenos Aires': 'America/Argentina/Buenos_Aires',
  Montevideo: 'America/Montevideo',
  Georgetown: 'America/Guyana',
  'Puerto Rico': 'America/Puerto_Rico',
  Greenland: 'America/Godthab',
  'Mid-Atlantic': 'Atlantic/South_Georgia',
  Azores: 'Atlantic/Azores',
  'Cape Verde Is.': 'Atlantic/Cape_Verde',
  Dublin: 'Europe/Dublin',
  Edinburgh: 'Europe/London',
  Lisbon: 'Europe/Lisbon',
  London: 'Europe/London',
  Casablanca: 'Africa/Casablanca',
  Monrovia: 'Africa/Monrovia',
  UTC: 'Etc/UTC',
  Belgrade: 'Europe/Belgrade',
  Bratislava: 'Europe/Bratislava',
  Budapest: 'Europe/Budapest',
  Ljubljana: 'Europe/Ljubljana',
  Prague: 'Europe/Prague',
  Sarajevo: 'Europe/Sarajevo',
  Skopje: 'Europe/Skopje',
  Warsaw: 'Europe/Warsaw',
  Zagreb: 'Europe/Zagreb',
  Brussels: 'Europe/Brussels',
  Copenhagen: 'Europe/Copenhagen',
  Madrid: 'Europe/Madrid',
  Paris: 'Europe/Paris',
  Amsterdam: 'Europe/Amsterdam',
  Berlin: 'Europe/Berlin',
  Bern: 'Europe/Zurich',
  Zurich: 'Europe/Zurich',
  Rome: 'Europe/Rome',
  Stockholm: 'Europe/Stockholm',
  Vienna: 'Europe/Vienna',
  'West Central Africa': 'Africa/Algiers',
  Bucharest: 'Europe/Bucharest',
  Cairo: 'Africa/Cairo',
  Helsinki: 'Europe/Helsinki',
  Kyiv: 'Europe/Kiev',
  Riga: 'Europe/Riga',
  Sofia: 'Europe/Sofia',
  Tallinn: 'Europe/Tallinn',
  Vilnius: 'Europe/Vilnius',
  Athens: 'Europe/Athens',
  Istanbul: 'Europe/Istanbul',
  Minsk: 'Europe/Minsk',
  Jerusalem: 'Asia/Jerusalem',
  Harare: 'Africa/Harare',
  Pretoria: 'Africa/Johannesburg',
  Kaliningrad: 'Europe/Kaliningrad',
  Moscow: 'Europe/Moscow',
  'St. Petersburg': 'Europe/Moscow',
  Volgograd: 'Europe/Volgograd',
  Samara: 'Europe/Samara',
  Kuwait: 'Asia/Kuwait',
  Riyadh: 'Asia/Riyadh',
  Nairobi: 'Africa/Nairobi',
  Baghdad: 'Asia/Baghdad',
  Tehran: 'Asia/Tehran',
  'Abu Dhabi': 'Asia/Muscat',
  Muscat: 'Asia/Muscat',
  Baku: 'Asia/Baku',
  Tbilisi: 'Asia/Tbilisi',
  Yerevan: 'Asia/Yerevan',
  Kabul: 'Asia/Kabul',
  Ekaterinburg: 'Asia/Yekaterinburg',
  Islamabad: 'Asia/Karachi',
  Karachi: 'Asia/Karachi',
  Tashkent: 'Asia/Tashkent',
  Chennai: 'Asia/Kolkata',
  Kolkata: 'Asia/Kolkata',
  Mumbai: 'Asia/Kolkata',
  'New Delhi': 'Asia/Kolkata',
  Kathmandu: 'Asia/Kathmandu',
  Astana: 'Asia/Dhaka',
  Dhaka: 'Asia/Dhaka',
  'Sri Jayawardenepura': 'Asia/Colombo',
  Almaty: 'Asia/Almaty',
  Novosibirsk: 'Asia/Novosibirsk',
  Rangoon: 'Asia/Rangoon',
  Bangkok: 'Asia/Bangkok',
  Hanoi: 'Asia/Bangkok',
  Jakarta: 'Asia/Jakarta',
  Krasnoyarsk: 'Asia/Krasnoyarsk',
  Beijing: 'Asia/Shanghai',
  Chongqing: 'Asia/Chongqing',
  'Hong Kong': 'Asia/Hong_Kong',
  Urumqi: 'Asia/Urumqi',
  'Kuala Lumpur': 'Asia/Kuala_Lumpur',
  Singapore: 'Asia/Singapore',
  Taipei: 'Asia/Taipei',
  Perth: 'Australia/Perth',
  Irkutsk: 'Asia/Irkutsk',
  Ulaanbaatar: 'Asia/Ulaanbaatar',
  Seoul: 'Asia/Seoul',
  Osaka: 'Asia/Tokyo',
  Sapporo: 'Asia/Tokyo',
  Tokyo: 'Asia/Tokyo',
  Yakutsk: 'Asia/Yakutsk',
  Darwin: 'Australia/Darwin',
  Adelaide: 'Australia/Adelaide',
  Canberra: 'Australia/Melbourne',
  Melbourne: 'Australia/Melbourne',
  Sydney: 'Australia/Sydney',
  Brisbane: 'Australia/Brisbane',
  Hobart: 'Australia/Hobart',
  Vladivostok: 'Asia/Vladivostok',
  Guam: 'Pacific/Guam',
  'Port Moresby': 'Pacific/Port_Moresby',
  Magadan: 'Asia/Magadan',
  Srednekolymsk: 'Asia/Srednekolymsk',
  'Solomon Is.': 'Pacific/Guadalcanal',
  'New Caledonia': 'Pacific/Noumea',
  Fiji: 'Pacific/Fiji',
  Kamchatka: 'Asia/Kamchatka',
  'Marshall Is.': 'Pacific/Majuro',
  Auckland: 'Pacific/Auckland',
  Wellington: 'Pacific/Auckland',
  "Nuku'alofa": 'Pacific/Tongatapu',
  'Tokelau Is.': 'Pacific/Fakaofo',
  'Chatham Is.': 'Pacific/Chatham',
  Samoa: 'Pacific/Apia',
};

/**
 * Given a Rails-style time zone (e.g. 'Pacific Time (US & Canada)'), get the equivalent
 * time-zone name that moment.tz can understand (e.g. 'America/Los_Angeles').
 */
export function convertRailsTz(railsTz) {
  return RAILS_TZ_MAPPINGS[railsTz] || railsTz;
}
