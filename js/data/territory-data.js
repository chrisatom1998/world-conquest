/* ============================================================
   WORLD CONQUEST — Territory (Subdivision) Data
   Real-world states/provinces for each country
   Each territory has: id, name, lat, lng, pop (fraction 0-1)
   ============================================================ */

const TERRITORY_DATA = {
  USA: [
    {id:"USA-AL",name:"Alabama",lat:32.81,lng:-86.79,pop:.015},
    {id:"USA-AK",name:"Alaska",lat:64.20,lng:-152.49,pop:.002},
    {id:"USA-AZ",name:"Arizona",lat:34.05,lng:-111.09,pop:.022},
    {id:"USA-AR",name:"Arkansas",lat:34.80,lng:-92.20,pop:.009},
    {id:"USA-CA",name:"California",lat:36.78,lng:-119.42,pop:.118},
    {id:"USA-CO",name:"Colorado",lat:39.55,lng:-105.78,pop:.017},
    {id:"USA-CT",name:"Connecticut",lat:41.60,lng:-72.76,pop:.011},
    {id:"USA-DE",name:"Delaware",lat:39.16,lng:-75.52,pop:.003},
    {id:"USA-FL",name:"Florida",lat:27.66,lng:-81.52,pop:.065},
    {id:"USA-GA",name:"Georgia",lat:33.04,lng:-83.64,pop:.032},
    {id:"USA-HI",name:"Hawaii",lat:19.90,lng:-155.58,pop:.004},
    {id:"USA-ID",name:"Idaho",lat:44.07,lng:-114.74,pop:.006},
    {id:"USA-IL",name:"Illinois",lat:40.63,lng:-89.40,pop:.038},
    {id:"USA-IN",name:"Indiana",lat:39.77,lng:-86.16,pop:.020},
    {id:"USA-IA",name:"Iowa",lat:42.01,lng:-93.21,pop:.010},
    {id:"USA-KS",name:"Kansas",lat:38.53,lng:-98.77,pop:.009},
    {id:"USA-KY",name:"Kentucky",lat:37.84,lng:-84.27,pop:.013},
    {id:"USA-LA",name:"Louisiana",lat:31.17,lng:-91.87,pop:.014},
    {id:"USA-ME",name:"Maine",lat:45.25,lng:-69.45,pop:.004},
    {id:"USA-MD",name:"Maryland",lat:39.05,lng:-76.64,pop:.018},
    {id:"USA-MA",name:"Massachusetts",lat:42.41,lng:-71.38,pop:.021},
    {id:"USA-MI",name:"Michigan",lat:44.31,lng:-85.60,pop:.030},
    {id:"USA-MN",name:"Minnesota",lat:46.73,lng:-94.69,pop:.017},
    {id:"USA-MS",name:"Mississippi",lat:32.75,lng:-89.68,pop:.009},
    {id:"USA-MO",name:"Missouri",lat:38.46,lng:-92.29,pop:.018},
    {id:"USA-MT",name:"Montana",lat:46.88,lng:-110.36,pop:.003},
    {id:"USA-NE",name:"Nebraska",lat:41.49,lng:-99.90,pop:.006},
    {id:"USA-NV",name:"Nevada",lat:38.80,lng:-116.42,pop:.009},
    {id:"USA-NH",name:"New Hampshire",lat:43.19,lng:-71.57,pop:.004},
    {id:"USA-NJ",name:"New Jersey",lat:40.06,lng:-74.41,pop:.028},
    {id:"USA-NM",name:"New Mexico",lat:34.52,lng:-105.87,pop:.006},
    {id:"USA-NY",name:"New York",lat:42.17,lng:-74.95,pop:.059},
    {id:"USA-NC",name:"North Carolina",lat:35.76,lng:-79.02,pop:.031},
    {id:"USA-ND",name:"North Dakota",lat:47.55,lng:-101.00,pop:.002},
    {id:"USA-OH",name:"Ohio",lat:40.42,lng:-82.91,pop:.035},
    {id:"USA-OK",name:"Oklahoma",lat:35.47,lng:-97.52,pop:.012},
    {id:"USA-OR",name:"Oregon",lat:43.80,lng:-120.55,pop:.013},
    {id:"USA-PA",name:"Pennsylvania",lat:41.20,lng:-77.19,pop:.039},
    {id:"USA-RI",name:"Rhode Island",lat:41.58,lng:-71.48,pop:.003},
    {id:"USA-SC",name:"South Carolina",lat:33.84,lng:-81.16,pop:.015},
    {id:"USA-SD",name:"South Dakota",lat:43.97,lng:-99.90,pop:.003},
    {id:"USA-TN",name:"Tennessee",lat:35.52,lng:-86.58,pop:.021},
    {id:"USA-TX",name:"Texas",lat:31.97,lng:-99.90,pop:.087},
    {id:"USA-UT",name:"Utah",lat:39.32,lng:-111.09,pop:.010},
    {id:"USA-VT",name:"Vermont",lat:44.56,lng:-72.58,pop:.002},
    {id:"USA-VA",name:"Virginia",lat:37.43,lng:-78.66,pop:.026},
    {id:"USA-WA",name:"Washington",lat:47.75,lng:-120.74,pop:.023},
    {id:"USA-WV",name:"West Virginia",lat:38.60,lng:-80.45,pop:.005},
    {id:"USA-WI",name:"Wisconsin",lat:43.78,lng:-88.79,pop:.018},
    {id:"USA-WY",name:"Wyoming",lat:43.08,lng:-107.29,pop:.002}
  ],
  CAN: [
    {id:"CAN-AB",name:"Alberta",lat:53.93,lng:-116.58,pop:.116},
    {id:"CAN-BC",name:"British Columbia",lat:53.73,lng:-127.65,pop:.134},
    {id:"CAN-MB",name:"Manitoba",lat:53.76,lng:-98.81,pop:.037},
    {id:"CAN-NB",name:"New Brunswick",lat:46.50,lng:-66.16,pop:.021},
    {id:"CAN-NL",name:"Newfoundland",lat:53.14,lng:-57.66,pop:.013},
    {id:"CAN-NS",name:"Nova Scotia",lat:44.68,lng:-63.74,pop:.026},
    {id:"CAN-ON",name:"Ontario",lat:51.25,lng:-85.32,pop:.387},
    {id:"CAN-PE",name:"Prince Edward Island",lat:46.51,lng:-63.42,pop:.004},
    {id:"CAN-QC",name:"Quebec",lat:52.94,lng:-73.55,pop:.228},
    {id:"CAN-SK",name:"Saskatchewan",lat:52.94,lng:-106.45,pop:.031},
    {id:"CAN-NT",name:"Northwest Territories",lat:64.27,lng:-119.18,pop:.001},
    {id:"CAN-NU",name:"Nunavut",lat:70.30,lng:-86.00,pop:.001},
    {id:"CAN-YT",name:"Yukon",lat:64.28,lng:-135.00,pop:.001}
  ],
  MEX: [
    {id:"MEX-AGU",name:"Aguascalientes",lat:21.88,lng:-102.29,pop:.010},
    {id:"MEX-BCN",name:"Baja California",lat:30.00,lng:-115.17,pop:.027},
    {id:"MEX-BCS",name:"Baja California Sur",lat:26.04,lng:-111.67,pop:.006},
    {id:"MEX-CAM",name:"Campeche",lat:18.93,lng:-90.32,pop:.007},
    {id:"MEX-CHP",name:"Chiapas",lat:16.75,lng:-92.64,pop:.043},
    {id:"MEX-CHH",name:"Chihuahua",lat:28.63,lng:-106.09,pop:.029},
    {id:"MEX-COA",name:"Coahuila",lat:27.06,lng:-101.71,pop:.024},
    {id:"MEX-COL",name:"Colima",lat:19.24,lng:-103.72,pop:.006},
    {id:"MEX-DUR",name:"Durango",lat:24.03,lng:-104.65,pop:.014},
    {id:"MEX-GUA",name:"Guanajuato",lat:21.02,lng:-101.26,pop:.047},
    {id:"MEX-GRO",name:"Guerrero",lat:17.44,lng:-99.55,pop:.028},
    {id:"MEX-HID",name:"Hidalgo",lat:20.09,lng:-98.76,pop:.023},
    {id:"MEX-JAL",name:"Jalisco",lat:20.66,lng:-103.35,pop:.064},
    {id:"MEX-MEX",name:"México",lat:19.36,lng:-99.63,pop:.131},
    {id:"MEX-MIC",name:"Michoacán",lat:19.57,lng:-101.71,pop:.037},
    {id:"MEX-MOR",name:"Morelos",lat:18.76,lng:-99.07,pop:.015},
    {id:"MEX-NAY",name:"Nayarit",lat:21.75,lng:-104.85,pop:.010},
    {id:"MEX-NLE",name:"Nuevo León",lat:25.59,lng:-99.99,pop:.043},
    {id:"MEX-OAX",name:"Oaxaca",lat:17.07,lng:-96.73,pop:.032},
    {id:"MEX-PUE",name:"Puebla",lat:19.05,lng:-97.90,pop:.050},
    {id:"MEX-QUE",name:"Querétaro",lat:20.59,lng:-100.39,pop:.017},
    {id:"MEX-ROO",name:"Quintana Roo",lat:19.18,lng:-88.00,pop:.014},
    {id:"MEX-SLP",name:"San Luis Potosí",lat:22.15,lng:-100.98,pop:.022},
    {id:"MEX-SIN",name:"Sinaloa",lat:24.81,lng:-107.39,pop:.024},
    {id:"MEX-SON",name:"Sonora",lat:29.07,lng:-110.96,pop:.023},
    {id:"MEX-TAB",name:"Tabasco",lat:17.84,lng:-92.62,pop:.019},
    {id:"MEX-TAM",name:"Tamaulipas",lat:24.27,lng:-98.84,pop:.028},
    {id:"MEX-TLA",name:"Tlaxcala",lat:19.32,lng:-98.24,pop:.011},
    {id:"MEX-VER",name:"Veracruz",lat:19.44,lng:-96.92,pop:.065},
    {id:"MEX-YUC",name:"Yucatán",lat:20.71,lng:-89.09,pop:.017},
    {id:"MEX-ZAC",name:"Zacatecas",lat:22.77,lng:-102.58,pop:.013},
    {id:"MEX-CMX",name:"Ciudad de México",lat:19.43,lng:-99.13,pop:.071}
  ],
  BRA: [
    {id:"BRA-AC",name:"Acre",lat:-9.02,lng:-70.81,pop:.004},
    {id:"BRA-AL",name:"Alagoas",lat:-9.57,lng:-36.78,pop:.015},
    {id:"BRA-AP",name:"Amapá",lat:1.41,lng:-51.77,pop:.004},
    {id:"BRA-AM",name:"Amazonas",lat:-3.42,lng:-65.86,pop:.019},
    {id:"BRA-BA",name:"Bahia",lat:-12.58,lng:-41.70,pop:.069},
    {id:"BRA-CE",name:"Ceará",lat:-5.20,lng:-39.45,pop:.042},
    {id:"BRA-DF",name:"Distrito Federal",lat:-15.79,lng:-47.88,pop:.014},
    {id:"BRA-ES",name:"Espírito Santo",lat:-19.18,lng:-40.31,pop:.019},
    {id:"BRA-GO",name:"Goiás",lat:-15.83,lng:-49.84,pop:.033},
    {id:"BRA-MA",name:"Maranhão",lat:-5.07,lng:-45.28,pop:.033},
    {id:"BRA-MT",name:"Mato Grosso",lat:-12.68,lng:-56.92,pop:.017},
    {id:"BRA-MS",name:"Mato Grosso do Sul",lat:-20.77,lng:-54.79,pop:.013},
    {id:"BRA-MG",name:"Minas Gerais",lat:-18.51,lng:-44.55,pop:.098},
    {id:"BRA-PA",name:"Pará",lat:-3.79,lng:-52.48,pop:.040},
    {id:"BRA-PB",name:"Paraíba",lat:-7.24,lng:-36.78,pop:.019},
    {id:"BRA-PR",name:"Paraná",lat:-24.89,lng:-51.55,pop:.054},
    {id:"BRA-PE",name:"Pernambuco",lat:-8.38,lng:-37.86,pop:.044},
    {id:"BRA-PI",name:"Piauí",lat:-7.72,lng:-42.73,pop:.015},
    {id:"BRA-RJ",name:"Rio de Janeiro",lat:-22.91,lng:-43.17,pop:.081},
    {id:"BRA-RN",name:"Rio Grande do Norte",lat:-5.79,lng:-36.51,pop:.017},
    {id:"BRA-RS",name:"Rio Grande do Sul",lat:-30.03,lng:-51.23,pop:.053},
    {id:"BRA-RO",name:"Rondônia",lat:-10.83,lng:-63.34,pop:.008},
    {id:"BRA-RR",name:"Roraima",lat:2.74,lng:-62.07,pop:.003},
    {id:"BRA-SC",name:"Santa Catarina",lat:-27.24,lng:-50.22,pop:.035},
    {id:"BRA-SP",name:"São Paulo",lat:-23.55,lng:-46.63,pop:.215},
    {id:"BRA-SE",name:"Sergipe",lat:-10.57,lng:-37.38,pop:.011},
    {id:"BRA-TO",name:"Tocantins",lat:-10.18,lng:-48.33,pop:.007}
  ],
  ARG: [
    {id:"ARG-BA",name:"Buenos Aires",lat:-36.68,lng:-60.96,pop:.390},
    {id:"ARG-CT",name:"Catamarca",lat:-27.34,lng:-66.95,pop:.009},
    {id:"ARG-CC",name:"Chaco",lat:-26.39,lng:-60.77,pop:.028},
    {id:"ARG-CH",name:"Chubut",lat:-43.79,lng:-68.53,pop:.014},
    {id:"ARG-CB",name:"Córdoba",lat:-32.14,lng:-63.80,pop:.087},
    {id:"ARG-CR",name:"Corrientes",lat:-28.77,lng:-57.80,pop:.025},
    {id:"ARG-ER",name:"Entre Ríos",lat:-32.06,lng:-59.20,pop:.032},
    {id:"ARG-FO",name:"Formosa",lat:-24.89,lng:-59.95,pop:.014},
    {id:"ARG-JY",name:"Jujuy",lat:-23.32,lng:-65.76,pop:.017},
    {id:"ARG-LP",name:"La Pampa",lat:-37.13,lng:-65.45,pop:.008},
    {id:"ARG-LR",name:"La Rioja",lat:-29.69,lng:-67.49,pop:.009},
    {id:"ARG-MZ",name:"Mendoza",lat:-34.63,lng:-68.58,pop:.046},
    {id:"ARG-MI",name:"Misiones",lat:-27.43,lng:-54.74,pop:.029},
    {id:"ARG-NQ",name:"Neuquén",lat:-38.95,lng:-68.11,pop:.015},
    {id:"ARG-RN",name:"Río Negro",lat:-40.41,lng:-67.23,pop:.017},
    {id:"ARG-SA",name:"Salta",lat:-24.23,lng:-64.98,pop:.032},
    {id:"ARG-SJ",name:"San Juan",lat:-30.87,lng:-68.89,pop:.018},
    {id:"ARG-SL",name:"San Luis",lat:-33.76,lng:-66.03,pop:.011},
    {id:"ARG-SC",name:"Santa Cruz",lat:-48.81,lng:-69.96,pop:.008},
    {id:"ARG-SF",name:"Santa Fe",lat:-31.59,lng:-60.72,pop:.083},
    {id:"ARG-SE",name:"Santiago del Estero",lat:-27.78,lng:-64.26,pop:.023},
    {id:"ARG-TF",name:"Tierra del Fuego",lat:-54.28,lng:-68.30,pop:.004},
    {id:"ARG-TU",name:"Tucumán",lat:-26.82,lng:-65.22,pop:.038},
    {id:"ARG-CF",name:"Ciudad de Buenos Aires",lat:-34.60,lng:-58.38,pop:.069}
  ],
  CHL: [
    {id:"CHL-AI",name:"Aysén",lat:-46.62,lng:-72.11,pop:.006},
    {id:"CHL-AN",name:"Antofagasta",lat:-23.85,lng:-69.33,pop:.033},
    {id:"CHL-AP",name:"Arica y Parinacota",lat:-18.48,lng:-69.63,pop:.013},
    {id:"CHL-AT",name:"Atacama",lat:-27.57,lng:-70.05,pop:.016},
    {id:"CHL-BI",name:"Biobío",lat:-37.47,lng:-72.36,pop:.079},
    {id:"CHL-CO",name:"Coquimbo",lat:-30.44,lng:-70.99,pop:.042},
    {id:"CHL-AR",name:"La Araucanía",lat:-38.95,lng:-72.33,pop:.050},
    {id:"CHL-LI",name:"O'Higgins",lat:-34.17,lng:-70.74,pop:.049},
    {id:"CHL-LL",name:"Los Lagos",lat:-41.47,lng:-72.93,pop:.044},
    {id:"CHL-LR",name:"Los Ríos",lat:-40.23,lng:-72.33,pop:.021},
    {id:"CHL-MA",name:"Magallanes",lat:-52.36,lng:-70.97,pop:.009},
    {id:"CHL-ML",name:"Maule",lat:-35.43,lng:-71.66,pop:.056},
    {id:"CHL-NB",name:"Ñuble",lat:-36.62,lng:-72.10,pop:.025},
    {id:"CHL-RM",name:"Santiago",lat:-33.45,lng:-70.67,pop:.415},
    {id:"CHL-TA",name:"Tarapacá",lat:-20.21,lng:-69.33,pop:.019},
    {id:"CHL-VS",name:"Valparaíso",lat:-33.04,lng:-71.44,pop:.097}
  ],
  COL: [
    {id:"COL-ANT",name:"Antioquia",lat:7.20,lng:-75.34,pop:.130},
    {id:"COL-BOL",name:"Bolívar",lat:8.67,lng:-74.96,pop:.042},
    {id:"COL-BOY",name:"Boyacá",lat:5.90,lng:-73.36,pop:.025},
    {id:"COL-CAL",name:"Caldas",lat:5.30,lng:-75.52,pop:.019},
    {id:"COL-CAU",name:"Cauca",lat:2.45,lng:-76.59,pop:.028},
    {id:"COL-CUN",name:"Cundinamarca",lat:5.03,lng:-74.03,pop:.056},
    {id:"COL-DC",name:"Bogotá D.C.",lat:4.71,lng:-74.07,pop:.157},
    {id:"COL-HUI",name:"Huila",lat:2.54,lng:-75.53,pop:.022},
    {id:"COL-MAG",name:"Magdalena",lat:10.41,lng:-74.41,pop:.025},
    {id:"COL-NAR",name:"Nariño",lat:1.29,lng:-77.36,pop:.035},
    {id:"COL-NDS",name:"Norte de Santander",lat:7.95,lng:-72.50,pop:.027},
    {id:"COL-RIS",name:"Risaralda",lat:5.32,lng:-75.99,pop:.019},
    {id:"COL-SAN",name:"Santander",lat:6.65,lng:-73.65,pop:.042},
    {id:"COL-SUC",name:"Sucre",lat:9.30,lng:-75.39,pop:.017},
    {id:"COL-TOL",name:"Tolima",lat:4.09,lng:-75.22,pop:.028},
    {id:"COL-VAC",name:"Valle del Cauca",lat:3.80,lng:-76.64,pop:.092},
    {id:"COL-ATL",name:"Atlántico",lat:10.69,lng:-75.00,pop:.050},
    {id:"COL-CES",name:"Cesar",lat:9.34,lng:-73.44,pop:.021},
    {id:"COL-COR",name:"Córdoba",lat:8.75,lng:-75.88,pop:.035},
    {id:"COL-MET",name:"Meta",lat:3.27,lng:-73.09,pop:.020}
  ],
  PER: [
    {id:"PER-AMA",name:"Amazonas",lat:-6.23,lng:-77.86,pop:.013},
    {id:"PER-ANC",name:"Áncash",lat:-9.53,lng:-77.53,pop:.035},
    {id:"PER-APU",name:"Apurímac",lat:-14.05,lng:-73.09,pop:.014},
    {id:"PER-ARE",name:"Arequipa",lat:-15.52,lng:-72.09,pop:.042},
    {id:"PER-AYA",name:"Ayacucho",lat:-13.16,lng:-74.22,pop:.021},
    {id:"PER-CAJ",name:"Cajamarca",lat:-7.16,lng:-78.51,pop:.046},
    {id:"PER-CUS",name:"Cusco",lat:-13.53,lng:-71.98,pop:.042},
    {id:"PER-HUV",name:"Huancavelica",lat:-12.79,lng:-74.97,pop:.015},
    {id:"PER-HUC",name:"Huánuco",lat:-9.93,lng:-76.24,pop:.026},
    {id:"PER-ICA",name:"Ica",lat:-14.07,lng:-75.73,pop:.028},
    {id:"PER-JUN",name:"Junín",lat:-11.50,lng:-75.00,pop:.042},
    {id:"PER-LAL",name:"La Libertad",lat:-8.11,lng:-78.97,pop:.060},
    {id:"PER-LAM",name:"Lambayeque",lat:-6.70,lng:-79.91,pop:.040},
    {id:"PER-LIM",name:"Lima",lat:-12.05,lng:-77.04,pop:.330},
    {id:"PER-LOR",name:"Loreto",lat:-4.00,lng:-75.00,pop:.032},
    {id:"PER-MDD",name:"Madre de Dios",lat:-11.77,lng:-70.81,pop:.005},
    {id:"PER-PIU",name:"Piura",lat:-5.18,lng:-80.65,pop:.060},
    {id:"PER-PUN",name:"Puno",lat:-15.50,lng:-70.01,pop:.044},
    {id:"PER-SAM",name:"San Martín",lat:-7.48,lng:-76.46,pop:.027},
    {id:"PER-TAC",name:"Tacna",lat:-17.60,lng:-70.25,pop:.011},
    {id:"PER-TUM",name:"Tumbes",lat:-3.57,lng:-80.44,pop:.008},
    {id:"PER-UCA",name:"Ucayali",lat:-9.83,lng:-73.09,pop:.016}
  ],
  GBR: [
    {id:"GBR-ENG-LN",name:"London",lat:51.51,lng:-0.13,pop:.133},
    {id:"GBR-ENG-SE",name:"South East",lat:51.30,lng:-0.74,pop:.137},
    {id:"GBR-ENG-NW",name:"North West",lat:53.80,lng:-2.60,pop:.110},
    {id:"GBR-ENG-EM",name:"East Midlands",lat:52.83,lng:-1.33,pop:.072},
    {id:"GBR-ENG-WM",name:"West Midlands",lat:52.48,lng:-1.89,pop:.089},
    {id:"GBR-ENG-YH",name:"Yorkshire",lat:53.96,lng:-1.08,pop:.083},
    {id:"GBR-ENG-EE",name:"East England",lat:52.24,lng:0.90,pop:.094},
    {id:"GBR-ENG-SW",name:"South West",lat:50.72,lng:-3.53,pop:.084},
    {id:"GBR-ENG-NE",name:"North East",lat:55.00,lng:-1.87,pop:.040},
    {id:"GBR-SCT",name:"Scotland",lat:56.49,lng:-4.20,pop:.082},
    {id:"GBR-WLS",name:"Wales",lat:52.13,lng:-3.78,pop:.047},
    {id:"GBR-NIR",name:"Northern Ireland",lat:54.79,lng:-6.49,pop:.029}
  ],
  FRA: [
    {id:"FRA-IDF",name:"Île-de-France",lat:48.85,lng:2.35,pop:.185},
    {id:"FRA-ARA",name:"Auvergne-Rhône-Alpes",lat:45.44,lng:4.39,pop:.121},
    {id:"FRA-NAQ",name:"Nouvelle-Aquitaine",lat:45.71,lng:0.63,pop:.090},
    {id:"FRA-OCC",name:"Occitanie",lat:43.59,lng:2.34,pop:.089},
    {id:"FRA-HDF",name:"Hauts-de-France",lat:49.96,lng:2.77,pop:.091},
    {id:"FRA-PAC",name:"Provence-Alpes-Côte d'Azur",lat:43.94,lng:6.07,pop:.077},
    {id:"FRA-GES",name:"Grand Est",lat:48.58,lng:5.80,pop:.084},
    {id:"FRA-PDL",name:"Pays de la Loire",lat:47.38,lng:-0.69,pop:.058},
    {id:"FRA-BRE",name:"Brittany",lat:48.20,lng:-2.93,pop:.051},
    {id:"FRA-NOR",name:"Normandy",lat:49.18,lng:0.37,pop:.050},
    {id:"FRA-BFC",name:"Bourgogne-Franche-Comté",lat:47.28,lng:4.81,pop:.043},
    {id:"FRA-CVL",name:"Centre-Val de Loire",lat:47.75,lng:1.68,pop:.039},
    {id:"FRA-COR",name:"Corsica",lat:42.04,lng:9.01,pop:.005}
  ],
  DEU: [
    {id:"DEU-NW",name:"North Rhine-Westphalia",lat:51.43,lng:7.66,pop:.215},
    {id:"DEU-BY",name:"Bavaria",lat:48.79,lng:11.50,pop:.158},
    {id:"DEU-BW",name:"Baden-Württemberg",lat:48.66,lng:9.35,pop:.134},
    {id:"DEU-NI",name:"Lower Saxony",lat:52.64,lng:9.85,pop:.096},
    {id:"DEU-HE",name:"Hesse",lat:50.65,lng:9.16,pop:.076},
    {id:"DEU-SN",name:"Saxony",lat:51.10,lng:13.20,pop:.049},
    {id:"DEU-RP",name:"Rhineland-Palatinate",lat:49.91,lng:7.45,pop:.049},
    {id:"DEU-BE",name:"Berlin",lat:52.52,lng:13.41,pop:.044},
    {id:"DEU-SH",name:"Schleswig-Holstein",lat:54.22,lng:9.70,pop:.035},
    {id:"DEU-BB",name:"Brandenburg",lat:52.41,lng:13.06,pop:.030},
    {id:"DEU-TH",name:"Thuringia",lat:50.98,lng:11.03,pop:.026},
    {id:"DEU-ST",name:"Saxony-Anhalt",lat:51.95,lng:11.69,pop:.026},
    {id:"DEU-MV",name:"Mecklenburg-Vorpommern",lat:53.61,lng:12.43,pop:.019},
    {id:"DEU-HH",name:"Hamburg",lat:53.55,lng:9.99,pop:.022},
    {id:"DEU-SL",name:"Saarland",lat:49.40,lng:7.04,pop:.012},
    {id:"DEU-HB",name:"Bremen",lat:53.08,lng:8.81,pop:.008}
  ],
  ITA: [
    {id:"ITA-LOM",name:"Lombardy",lat:45.47,lng:9.19,pop:.170},
    {id:"ITA-LAZ",name:"Lazio",lat:41.90,lng:12.50,pop:.099},
    {id:"ITA-CAM",name:"Campania",lat:40.83,lng:14.25,pop:.096},
    {id:"ITA-SIC",name:"Sicily",lat:37.60,lng:14.02,pop:.083},
    {id:"ITA-VEN",name:"Veneto",lat:45.44,lng:12.32,pop:.082},
    {id:"ITA-EMR",name:"Emilia-Romagna",lat:44.49,lng:11.34,pop:.075},
    {id:"ITA-PIE",name:"Piedmont",lat:44.69,lng:7.62,pop:.073},
    {id:"ITA-PUG",name:"Apulia",lat:41.13,lng:16.87,pop:.067},
    {id:"ITA-TOS",name:"Tuscany",lat:43.77,lng:11.25,pop:.062},
    {id:"ITA-CAL",name:"Calabria",lat:38.91,lng:16.52,pop:.032},
    {id:"ITA-SAR",name:"Sardinia",lat:40.12,lng:9.01,pop:.027},
    {id:"ITA-LIG",name:"Liguria",lat:44.41,lng:8.93,pop:.025},
    {id:"ITA-MAR",name:"Marche",lat:43.62,lng:13.52,pop:.025},
    {id:"ITA-ABR",name:"Abruzzo",lat:42.35,lng:13.39,pop:.022},
    {id:"ITA-FVG",name:"Friuli Venezia Giulia",lat:46.07,lng:13.24,pop:.020},
    {id:"ITA-UMB",name:"Umbria",lat:42.71,lng:12.39,pop:.014},
    {id:"ITA-BAS",name:"Basilicata",lat:40.64,lng:15.97,pop:.009},
    {id:"ITA-MOL",name:"Molise",lat:41.56,lng:14.66,pop:.005},
    {id:"ITA-TAA",name:"Trentino-Alto Adige",lat:46.07,lng:11.12,pop:.018},
    {id:"ITA-VDA",name:"Aosta Valley",lat:45.74,lng:7.32,pop:.002}
  ],
  ESP: [
    {id:"ESP-AN",name:"Andalusia",lat:37.39,lng:-4.23,pop:.181},
    {id:"ESP-CT",name:"Catalonia",lat:41.59,lng:1.52,pop:.164},
    {id:"ESP-MD",name:"Madrid",lat:40.42,lng:-3.70,pop:.143},
    {id:"ESP-VC",name:"Valencia",lat:39.47,lng:-0.38,pop:.107},
    {id:"ESP-GA",name:"Galicia",lat:42.57,lng:-8.17,pop:.057},
    {id:"ESP-CL",name:"Castile and León",lat:41.38,lng:-4.45,pop:.051},
    {id:"ESP-PV",name:"Basque Country",lat:42.99,lng:-2.62,pop:.047},
    {id:"ESP-CM",name:"Castilla-La Mancha",lat:39.29,lng:-2.96,pop:.043},
    {id:"ESP-MU",name:"Murcia",lat:37.99,lng:-1.13,pop:.032},
    {id:"ESP-AR",name:"Aragon",lat:41.60,lng:-0.88,pop:.028},
    {id:"ESP-EX",name:"Extremadura",lat:39.21,lng:-6.36,pop:.023},
    {id:"ESP-IB",name:"Balearic Islands",lat:39.57,lng:2.65,pop:.025},
    {id:"ESP-CN",name:"Canary Islands",lat:28.12,lng:-15.43,pop:.046},
    {id:"ESP-NC",name:"Navarre",lat:42.70,lng:-1.68,pop:.014},
    {id:"ESP-AS",name:"Asturias",lat:43.36,lng:-5.86,pop:.021},
    {id:"ESP-CB",name:"Cantabria",lat:43.18,lng:-3.99,pop:.012},
    {id:"ESP-RI",name:"La Rioja",lat:42.29,lng:-2.54,pop:.007}
  ],
  POL: [
    {id:"POL-MZ",name:"Masovia",lat:52.23,lng:21.01,pop:.144},
    {id:"POL-SL",name:"Silesia",lat:50.26,lng:19.03,pop:.117},
    {id:"POL-WP",name:"Greater Poland",lat:52.41,lng:16.93,pop:.093},
    {id:"POL-MA",name:"Lesser Poland",lat:50.06,lng:19.94,pop:.090},
    {id:"POL-LB",name:"Lublin",lat:51.25,lng:22.57,pop:.055},
    {id:"POL-DS",name:"Lower Silesia",lat:51.11,lng:17.04,pop:.076},
    {id:"POL-PM",name:"Pomerania",lat:54.35,lng:18.65,pop:.062},
    {id:"POL-LD",name:"Łódź",lat:51.77,lng:19.46,pop:.064},
    {id:"POL-PK",name:"Subcarpathia",lat:49.78,lng:22.00,pop:.055},
    {id:"POL-KP",name:"Kuyavia-Pomerania",lat:53.12,lng:18.01,pop:.054},
    {id:"POL-WN",name:"Warmia-Masuria",lat:53.78,lng:20.49,pop:.037},
    {id:"POL-ZP",name:"West Pomerania",lat:53.43,lng:14.55,pop:.043},
    {id:"POL-SK",name:"Holy Cross",lat:50.87,lng:20.63,pop:.032},
    {id:"POL-LU",name:"Lubusz",lat:52.07,lng:15.51,pop:.026},
    {id:"POL-PD",name:"Podlaskie",lat:53.13,lng:23.16,pop:.030},
    {id:"POL-OP",name:"Opole",lat:50.67,lng:17.93,pop:.025}
  ],
  UKR: [
    {id:"UKR-KV",name:"Kyiv",lat:50.45,lng:30.52,pop:.068},
    {id:"UKR-DP",name:"Dnipropetrovsk",lat:48.46,lng:35.05,pop:.074},
    {id:"UKR-KH",name:"Kharkiv",lat:49.99,lng:36.23,pop:.061},
    {id:"UKR-OD",name:"Odesa",lat:46.48,lng:30.73,pop:.054},
    {id:"UKR-DO",name:"Donetsk",lat:48.00,lng:37.81,pop:.093},
    {id:"UKR-LV",name:"Lviv",lat:49.84,lng:24.03,pop:.058},
    {id:"UKR-ZP",name:"Zaporizhzhia",lat:47.84,lng:35.14,pop:.039},
    {id:"UKR-VN",name:"Vinnytsia",lat:49.23,lng:28.47,pop:.036},
    {id:"UKR-PL",name:"Poltava",lat:49.59,lng:34.55,pop:.032},
    {id:"UKR-IF",name:"Ivano-Frankivsk",lat:48.92,lng:24.71,pop:.031},
    {id:"UKR-CK",name:"Cherkasy",lat:49.44,lng:32.06,pop:.028},
    {id:"UKR-MY",name:"Mykolaiv",lat:46.97,lng:32.00,pop:.026},
    {id:"UKR-ZH",name:"Zhytomyr",lat:50.25,lng:28.66,pop:.028},
    {id:"UKR-KS",name:"Kherson",lat:46.64,lng:32.62,pop:.024},
    {id:"UKR-SM",name:"Sumy",lat:50.91,lng:34.80,pop:.024},
    {id:"UKR-CH",name:"Chernihiv",lat:51.49,lng:31.29,pop:.023},
    {id:"UKR-LH",name:"Luhansk",lat:48.57,lng:39.31,pop:.050},
    {id:"UKR-TP",name:"Ternopil",lat:49.55,lng:25.59,pop:.024},
    {id:"UKR-KR",name:"Crimea",lat:44.95,lng:34.10,pop:.043},
    {id:"UKR-RV",name:"Rivne",lat:50.62,lng:26.25,pop:.026},
    {id:"UKR-VO",name:"Volyn",lat:50.75,lng:25.33,pop:.023},
    {id:"UKR-KM",name:"Khmelnytskyi",lat:49.42,lng:26.98,pop:.029},
    {id:"UKR-CU",name:"Chernivtsi",lat:48.29,lng:25.94,pop:.020},
    {id:"UKR-ZK",name:"Zakarpattia",lat:48.62,lng:22.29,pop:.028}
  ],
  ROU: [
    {id:"ROU-BUC",name:"Bucharest",lat:44.43,lng:26.10,pop:.098},
    {id:"ROU-CLJ",name:"Cluj",lat:46.77,lng:23.60,pop:.036},
    {id:"ROU-TIM",name:"Timiș",lat:45.76,lng:21.23,pop:.035},
    {id:"ROU-ISI",name:"Iași",lat:47.16,lng:27.59,pop:.043},
    {id:"ROU-CON",name:"Constanța",lat:44.18,lng:28.63,pop:.037},
    {id:"ROU-BRS",name:"Brașov",lat:45.65,lng:25.61,pop:.030},
    {id:"ROU-PLO",name:"Prahova",lat:44.94,lng:26.02,pop:.040},
    {id:"ROU-DOL",name:"Dolj",lat:44.33,lng:23.79,pop:.034},
    {id:"ROU-SCV",name:"Suceava",lat:47.63,lng:25.90,pop:.037},
    {id:"ROU-ARG",name:"Argeș",lat:44.86,lng:24.87,pop:.033},
    {id:"ROU-BCU",name:"Bacău",lat:46.57,lng:26.91,pop:.035},
    {id:"ROU-MRS",name:"Mureș",lat:46.55,lng:24.56,pop:.028},
    {id:"ROU-HUN",name:"Hunedoara",lat:45.75,lng:22.90,pop:.022},
    {id:"ROU-SBU",name:"Sibiu",lat:45.80,lng:24.15,pop:.022},
    {id:"ROU-GAL",name:"Galați",lat:45.44,lng:28.05,pop:.028},
    {id:"ROU-ALB",name:"Alba",lat:46.07,lng:23.58,pop:.019},
    {id:"ROU-MAR",name:"Maramureș",lat:47.66,lng:24.00,pop:.025},
    {id:"ROU-BHR",name:"Bihor",lat:47.07,lng:22.08,pop:.030},
    {id:"ROU-NEA",name:"Neamț",lat:46.98,lng:26.38,pop:.024},
    {id:"ROU-DIM",name:"Dâmbovița",lat:44.93,lng:25.46,pop:.026}
  ],
  GRC: [
    {id:"GRC-ATT",name:"Attica",lat:37.98,lng:23.73,pop:.353},
    {id:"GRC-MAC",name:"Central Macedonia",lat:40.64,lng:22.94,pop:.180},
    {id:"GRC-THE",name:"Thessaly",lat:39.64,lng:22.41,pop:.068},
    {id:"GRC-WGR",name:"Western Greece",lat:38.48,lng:21.79,pop:.062},
    {id:"GRC-CRE",name:"Crete",lat:35.24,lng:24.91,pop:.059},
    {id:"GRC-EMT",name:"Eastern Macedonia & Thrace",lat:41.14,lng:24.89,pop:.056},
    {id:"GRC-PEL",name:"Peloponnese",lat:37.51,lng:22.37,pop:.055},
    {id:"GRC-WMA",name:"Western Macedonia",lat:40.30,lng:21.79,pop:.025},
    {id:"GRC-EPR",name:"Epirus",lat:39.67,lng:20.85,pop:.031},
    {id:"GRC-CGR",name:"Central Greece",lat:38.90,lng:22.43,pop:.048},
    {id:"GRC-ION",name:"Ionian Islands",lat:38.83,lng:20.71,pop:.019},
    {id:"GRC-NAE",name:"North Aegean",lat:39.10,lng:26.55,pop:.019},
    {id:"GRC-SAE",name:"South Aegean",lat:37.44,lng:25.37,pop:.032}
  ],
  NLD: [
    {id:"NLD-NH",name:"North Holland",lat:52.67,lng:4.94,pop:.165},
    {id:"NLD-ZH",name:"South Holland",lat:51.99,lng:4.41,pop:.210},
    {id:"NLD-NB",name:"North Brabant",lat:51.48,lng:5.23,pop:.149},
    {id:"NLD-GE",name:"Gelderland",lat:52.05,lng:5.87,pop:.120},
    {id:"NLD-UT",name:"Utrecht",lat:52.09,lng:5.11,pop:.082},
    {id:"NLD-OV",name:"Overijssel",lat:52.44,lng:6.50,pop:.069},
    {id:"NLD-LI",name:"Limburg",lat:51.25,lng:5.97,pop:.064},
    {id:"NLD-FR",name:"Friesland",lat:53.16,lng:5.78,pop:.037},
    {id:"NLD-GR",name:"Groningen",lat:53.22,lng:6.57,pop:.034},
    {id:"NLD-DR",name:"Drenthe",lat:52.95,lng:6.62,pop:.029},
    {id:"NLD-FL",name:"Flevoland",lat:52.53,lng:5.47,pop:.025},
    {id:"NLD-ZE",name:"Zeeland",lat:51.50,lng:3.80,pop:.022}
  ],
  SWE: [
    {id:"SWE-STK",name:"Stockholm",lat:59.33,lng:18.07,pop:.239},
    {id:"SWE-VGO",name:"Västra Götaland",lat:58.25,lng:13.06,pop:.175},
    {id:"SWE-SKA",name:"Skåne",lat:55.99,lng:13.60,pop:.139},
    {id:"SWE-OST",name:"Östergötland",lat:58.41,lng:15.63,pop:.047},
    {id:"SWE-UPP",name:"Uppsala",lat:59.86,lng:17.64,pop:.039},
    {id:"SWE-JON",name:"Jönköping",lat:57.78,lng:14.16,pop:.037},
    {id:"SWE-HAL",name:"Halland",lat:56.90,lng:12.80,pop:.034},
    {id:"SWE-NOR",name:"Norrbotten",lat:66.83,lng:20.39,pop:.025},
    {id:"SWE-GAV",name:"Gävleborg",lat:60.67,lng:17.15,pop:.028},
    {id:"SWE-DAL",name:"Dalarna",lat:61.09,lng:14.67,pop:.028},
    {id:"SWE-SOD",name:"Södermanland",lat:59.03,lng:16.75,pop:.030},
    {id:"SWE-VML",name:"Västmanland",lat:59.62,lng:16.55,pop:.028},
    {id:"SWE-VBN",name:"Västerbotten",lat:64.23,lng:19.17,pop:.028},
    {id:"SWE-VNR",name:"Värmland",lat:59.73,lng:13.51,pop:.028},
    {id:"SWE-ORB",name:"Örebro",lat:59.28,lng:15.21,pop:.031},
    {id:"SWE-KAL",name:"Kalmar",lat:57.08,lng:16.36,pop:.025},
    {id:"SWE-BLE",name:"Blekinge",lat:56.28,lng:15.18,pop:.016},
    {id:"SWE-KRO",name:"Kronoberg",lat:56.88,lng:14.81,pop:.020},
    {id:"SWE-JAM",name:"Jämtland",lat:63.17,lng:14.64,pop:.013},
    {id:"SWE-GBG",name:"Gotland",lat:57.63,lng:18.29,pop:.006}
  ],
  NOR: [
    {id:"NOR-OSL",name:"Oslo",lat:59.91,lng:10.75,pop:.129},
    {id:"NOR-VIK",name:"Viken",lat:59.87,lng:10.23,pop:.226},
    {id:"NOR-ROG",name:"Rogaland",lat:59.03,lng:6.25,pop:.089},
    {id:"NOR-VES",name:"Vestland",lat:60.39,lng:5.32,pop:.115},
    {id:"NOR-TRO",name:"Trøndelag",lat:63.43,lng:10.40,pop:.088},
    {id:"NOR-INN",name:"Innlandet",lat:61.12,lng:10.47,pop:.067},
    {id:"NOR-VTF",name:"Vestfold og Telemark",lat:59.27,lng:9.60,pop:.077},
    {id:"NOR-AGD",name:"Agder",lat:58.46,lng:8.77,pop:.057},
    {id:"NOR-NOR",name:"Nordland",lat:67.28,lng:14.40,pop:.044},
    {id:"NOR-TFS",name:"Troms og Finnmark",lat:69.65,lng:18.96,pop:.045},
    {id:"NOR-MRO",name:"Møre og Romsdal",lat:62.47,lng:6.15,pop:.049}
  ],
  PRT: [
    {id:"PRT-LIS",name:"Lisbon",lat:38.72,lng:-9.14,pop:.281},
    {id:"PRT-POR",name:"Porto",lat:41.15,lng:-8.61,pop:.176},
    {id:"PRT-BRA",name:"Braga",lat:41.55,lng:-8.43,pop:.085},
    {id:"PRT-SET",name:"Setúbal",lat:38.52,lng:-8.89,pop:.088},
    {id:"PRT-AVR",name:"Aveiro",lat:40.64,lng:-8.65,pop:.073},
    {id:"PRT-LEI",name:"Leiria",lat:39.74,lng:-8.81,pop:.047},
    {id:"PRT-FAR",name:"Faro",lat:37.02,lng:-7.93,pop:.044},
    {id:"PRT-COI",name:"Coimbra",lat:40.21,lng:-8.43,pop:.041},
    {id:"PRT-SAN",name:"Santarém",lat:39.24,lng:-8.69,pop:.043},
    {id:"PRT-VIS",name:"Viseu",lat:40.66,lng:-7.91,pop:.037},
    {id:"PRT-VCT",name:"Vila Real",lat:41.30,lng:-7.74,pop:.020},
    {id:"PRT-EVR",name:"Évora",lat:38.57,lng:-7.91,pop:.016},
    {id:"PRT-MAD",name:"Madeira",lat:32.76,lng:-16.96,pop:.025},
    {id:"PRT-AZR",name:"Azores",lat:37.74,lng:-25.68,pop:.024}
  ],
  FIN: [
    {id:"FIN-UUS",name:"Uusimaa",lat:60.17,lng:24.94,pop:.306},
    {id:"FIN-PIR",name:"Pirkanmaa",lat:61.50,lng:23.79,pop:.098},
    {id:"FIN-VSU",name:"Southwest Finland",lat:60.45,lng:22.27,pop:.086},
    {id:"FIN-POH",name:"North Ostrobothnia",lat:65.01,lng:25.47,pop:.074},
    {id:"FIN-HAM",name:"Häme",lat:61.00,lng:24.44,pop:.065},
    {id:"FIN-KYM",name:"Kymenlaakso",lat:60.87,lng:26.70,pop:.031},
    {id:"FIN-ESA",name:"South Savo",lat:61.69,lng:27.27,pop:.027},
    {id:"FIN-PSA",name:"North Savo",lat:62.89,lng:27.68,pop:.045},
    {id:"FIN-PKA",name:"North Karelia",lat:62.60,lng:29.76,pop:.030},
    {id:"FIN-KSU",name:"Central Finland",lat:62.24,lng:25.75,pop:.050},
    {id:"FIN-EPO",name:"South Ostrobothnia",lat:62.79,lng:23.76,pop:.035},
    {id:"FIN-OPO",name:"Ostrobothnia",lat:63.10,lng:21.62,pop:.033},
    {id:"FIN-KAI",name:"Kainuu",lat:64.23,lng:28.01,pop:.013},
    {id:"FIN-LAP",name:"Lapland",lat:66.50,lng:25.75,pop:.033},
    {id:"FIN-SAT",name:"Satakunta",lat:61.49,lng:21.80,pop:.040},
    {id:"FIN-PAH",name:"Päijät-Häme",lat:60.98,lng:25.66,pop:.038}
  ],
  RUS: [
    {id:"RUS-MOW",name:"Moscow",lat:55.76,lng:37.62,pop:.087},
    {id:"RUS-SPE",name:"St. Petersburg",lat:59.93,lng:30.32,pop:.038},
    {id:"RUS-CEN",name:"Central Federal District",lat:54.20,lng:37.62,pop:.200},
    {id:"RUS-NWE",name:"Northwestern",lat:61.00,lng:34.00,pop:.055},
    {id:"RUS-SOU",name:"Southern",lat:46.00,lng:42.00,pop:.080},
    {id:"RUS-NCA",name:"North Caucasus",lat:43.50,lng:44.70,pop:.070},
    {id:"RUS-VLG",name:"Volga",lat:55.80,lng:49.10,pop:.145},
    {id:"RUS-URA",name:"Urals",lat:56.84,lng:60.60,pop:.060},
    {id:"RUS-SIB",name:"Siberia",lat:55.00,lng:82.90,pop:.095},
    {id:"RUS-FAR",name:"Far East",lat:50.00,lng:130.00,pop:.040},
    {id:"RUS-KAL",name:"Kaliningrad",lat:54.71,lng:20.51,pop:.007},
    {id:"RUS-TAT",name:"Tatarstan",lat:55.80,lng:49.10,pop:.027},
    {id:"RUS-KDA",name:"Krasnodar",lat:45.04,lng:38.98,pop:.039},
    {id:"RUS-NSK",name:"Novosibirsk",lat:55.03,lng:82.92,pop:.019},
    {id:"RUS-SVE",name:"Sverdlovsk",lat:56.84,lng:60.60,pop:.030},
    {id:"RUS-BA",name:"Bashkortostan",lat:54.74,lng:55.97,pop:.028}
  ],
  TUR: [
    {id:"TUR-IST",name:"Istanbul",lat:41.01,lng:28.98,pop:.191},
    {id:"TUR-ANK",name:"Ankara",lat:39.93,lng:32.86,pop:.068},
    {id:"TUR-IZM",name:"Izmir",lat:38.42,lng:27.13,pop:.054},
    {id:"TUR-BUR",name:"Bursa",lat:40.19,lng:29.06,pop:.037},
    {id:"TUR-ANT",name:"Antalya",lat:36.90,lng:30.69,pop:.030},
    {id:"TUR-ADN",name:"Adana",lat:37.00,lng:35.32,pop:.027},
    {id:"TUR-KON",name:"Konya",lat:37.87,lng:32.48,pop:.027},
    {id:"TUR-GAZ",name:"Gaziantep",lat:37.06,lng:37.38,pop:.025},
    {id:"TUR-MER",name:"Mersin",lat:36.80,lng:34.63,pop:.023},
    {id:"TUR-DYB",name:"Diyarbakır",lat:37.91,lng:40.22,pop:.021},
    {id:"TUR-KAY",name:"Kayseri",lat:38.73,lng:35.48,pop:.017},
    {id:"TUR-SAM",name:"Samsun",lat:41.29,lng:36.33,pop:.016},
    {id:"TUR-MAN",name:"Manisa",lat:38.61,lng:27.43,pop:.017},
    {id:"TUR-BAL",name:"Balıkesir",lat:39.65,lng:27.89,pop:.015},
    {id:"TUR-TRB",name:"Trabzon",lat:41.00,lng:39.72,pop:.010},
    {id:"TUR-ESK",name:"Eskişehir",lat:39.78,lng:30.52,pop:.010},
    {id:"TUR-VAN",name:"Van",lat:38.49,lng:43.38,pop:.014},
    {id:"TUR-MAL",name:"Malatya",lat:38.35,lng:38.31,pop:.010},
    {id:"TUR-ERZ",name:"Erzurum",lat:39.91,lng:41.28,pop:.009},
    {id:"TUR-HAT",name:"Hatay",lat:36.40,lng:36.35,pop:.019}
  ],
  CHN: [
    {id:"CHN-GD",name:"Guangdong",lat:23.13,lng:113.26,pop:.089},
    {id:"CHN-SD",name:"Shandong",lat:36.67,lng:117.02,pop:.072},
    {id:"CHN-HEN",name:"Henan",lat:34.76,lng:113.65,pop:.070},
    {id:"CHN-JS",name:"Jiangsu",lat:32.06,lng:118.80,pop:.060},
    {id:"CHN-SC",name:"Sichuan",lat:30.57,lng:104.07,pop:.059},
    {id:"CHN-HEB",name:"Hebei",lat:38.04,lng:114.50,pop:.053},
    {id:"CHN-HUN",name:"Hunan",lat:28.23,lng:112.94,pop:.047},
    {id:"CHN-AH",name:"Anhui",lat:31.82,lng:117.23,pop:.043},
    {id:"CHN-HUB",name:"Hubei",lat:30.59,lng:114.31,pop:.041},
    {id:"CHN-ZJ",name:"Zhejiang",lat:30.27,lng:120.15,pop:.046},
    {id:"CHN-GX",name:"Guangxi",lat:22.82,lng:108.32,pop:.036},
    {id:"CHN-YN",name:"Yunnan",lat:25.04,lng:102.71,pop:.033},
    {id:"CHN-JX",name:"Jiangxi",lat:28.68,lng:115.89,pop:.032},
    {id:"CHN-LN",name:"Liaoning",lat:41.80,lng:123.43,pop:.030},
    {id:"CHN-FJ",name:"Fujian",lat:26.08,lng:119.30,pop:.029},
    {id:"CHN-SX",name:"Shaanxi",lat:34.26,lng:108.94,pop:.028},
    {id:"CHN-HL",name:"Heilongjiang",lat:45.75,lng:126.65,pop:.022},
    {id:"CHN-SHX",name:"Shanxi",lat:37.87,lng:112.55,pop:.025},
    {id:"CHN-GZ",name:"Guizhou",lat:26.65,lng:106.63,pop:.027},
    {id:"CHN-CQ",name:"Chongqing",lat:29.56,lng:106.55,pop:.023},
    {id:"CHN-JL",name:"Jilin",lat:43.88,lng:125.32,pop:.017},
    {id:"CHN-GS",name:"Gansu",lat:36.06,lng:103.83,pop:.018},
    {id:"CHN-NMG",name:"Inner Mongolia",lat:40.82,lng:111.65,pop:.017},
    {id:"CHN-XJ",name:"Xinjiang",lat:43.79,lng:87.63,pop:.018},
    {id:"CHN-SH",name:"Shanghai",lat:31.23,lng:121.47,pop:.017},
    {id:"CHN-BJ",name:"Beijing",lat:39.90,lng:116.40,pop:.015},
    {id:"CHN-TJ",name:"Tianjin",lat:39.13,lng:117.20,pop:.010},
    {id:"CHN-HAN",name:"Hainan",lat:19.20,lng:109.75,pop:.007},
    {id:"CHN-NX",name:"Ningxia",lat:38.47,lng:106.26,pop:.005},
    {id:"CHN-XZ",name:"Tibet",lat:29.65,lng:91.13,pop:.003},
    {id:"CHN-QH",name:"Qinghai",lat:36.62,lng:101.78,pop:.004}
  ],
  IND: [
    {id:"IND-UP",name:"Uttar Pradesh",lat:26.85,lng:80.91,pop:.166},
    {id:"IND-MH",name:"Maharashtra",lat:19.08,lng:72.88,pop:.093},
    {id:"IND-BR",name:"Bihar",lat:25.60,lng:85.10,pop:.088},
    {id:"IND-WB",name:"West Bengal",lat:22.57,lng:88.36,pop:.073},
    {id:"IND-MP",name:"Madhya Pradesh",lat:23.47,lng:77.95,pop:.062},
    {id:"IND-TN",name:"Tamil Nadu",lat:11.13,lng:78.66,pop:.058},
    {id:"IND-RJ",name:"Rajasthan",lat:27.02,lng:74.22,pop:.057},
    {id:"IND-KA",name:"Karnataka",lat:15.32,lng:75.71,pop:.050},
    {id:"IND-GJ",name:"Gujarat",lat:22.26,lng:71.19,pop:.050},
    {id:"IND-AP",name:"Andhra Pradesh",lat:15.91,lng:79.74,pop:.040},
    {id:"IND-OR",name:"Odisha",lat:20.94,lng:84.80,pop:.035},
    {id:"IND-TS",name:"Telangana",lat:17.36,lng:78.47,pop:.030},
    {id:"IND-KL",name:"Kerala",lat:10.85,lng:76.27,pop:.027},
    {id:"IND-JH",name:"Jharkhand",lat:23.61,lng:85.28,pop:.028},
    {id:"IND-AS",name:"Assam",lat:26.20,lng:92.94,pop:.026},
    {id:"IND-PB",name:"Punjab",lat:31.15,lng:75.34,pop:.023},
    {id:"IND-CT",name:"Chhattisgarh",lat:21.27,lng:81.87,pop:.022},
    {id:"IND-HR",name:"Haryana",lat:29.06,lng:76.09,pop:.021},
    {id:"IND-DL",name:"Delhi",lat:28.61,lng:77.21,pop:.016},
    {id:"IND-JK",name:"Jammu & Kashmir",lat:33.78,lng:76.58,pop:.010},
    {id:"IND-UK",name:"Uttarakhand",lat:30.07,lng:79.02,pop:.008},
    {id:"IND-HP",name:"Himachal Pradesh",lat:31.10,lng:77.17,pop:.006},
    {id:"IND-GA",name:"Goa",lat:15.30,lng:74.12,pop:.001}
  ],
  JPN: [
    {id:"JPN-KAN",name:"Kantō",lat:35.68,lng:139.69,pop:.347},
    {id:"JPN-KIN",name:"Kinki",lat:34.69,lng:135.50,pop:.179},
    {id:"JPN-CHU",name:"Chūbu",lat:35.18,lng:136.91,pop:.171},
    {id:"JPN-KYU",name:"Kyūshū",lat:33.59,lng:130.40,pop:.113},
    {id:"JPN-TOH",name:"Tōhoku",lat:38.27,lng:140.87,pop:.069},
    {id:"JPN-CHG",name:"Chūgoku",lat:34.40,lng:132.46,pop:.058},
    {id:"JPN-SHI",name:"Shikoku",lat:33.84,lng:133.00,pop:.030},
    {id:"JPN-HOK",name:"Hokkaidō",lat:43.06,lng:141.35,pop:.042}
  ],
  KOR: [
    {id:"KOR-SEO",name:"Seoul",lat:37.57,lng:126.98,pop:.187},
    {id:"KOR-GYG",name:"Gyeonggi",lat:37.41,lng:127.52,pop:.258},
    {id:"KOR-BSN",name:"Busan",lat:35.18,lng:129.08,pop:.066},
    {id:"KOR-ICN",name:"Incheon",lat:37.46,lng:126.71,pop:.057},
    {id:"KOR-DGU",name:"Daegu",lat:35.87,lng:128.60,pop:.047},
    {id:"KOR-DJN",name:"Daejeon",lat:36.35,lng:127.38,pop:.029},
    {id:"KOR-GWJ",name:"Gwangju",lat:35.16,lng:126.85,pop:.028},
    {id:"KOR-GSN",name:"South Gyeongsang",lat:35.46,lng:128.21,pop:.065},
    {id:"KOR-GBK",name:"North Gyeongsang",lat:36.57,lng:128.73,pop:.051},
    {id:"KOR-CNM",name:"South Chungcheong",lat:36.52,lng:126.80,pop:.041},
    {id:"KOR-CBK",name:"North Chungcheong",lat:36.64,lng:127.49,pop:.031},
    {id:"KOR-JNM",name:"South Jeolla",lat:34.82,lng:126.88,pop:.035},
    {id:"KOR-JBK",name:"North Jeolla",lat:35.82,lng:127.11,pop:.035},
    {id:"KOR-GWN",name:"Gangwon",lat:37.89,lng:127.73,pop:.030},
    {id:"KOR-JJD",name:"Jeju",lat:33.49,lng:126.53,pop:.013},
    {id:"KOR-USN",name:"Ulsan",lat:35.54,lng:129.31,pop:.022}
  ],
  PRK: [
    {id:"PRK-PYG",name:"Pyongyang",lat:39.02,lng:125.75,pop:.120},
    {id:"PRK-PHN",name:"South Pyongan",lat:39.24,lng:125.75,pop:.160},
    {id:"PRK-PHB",name:"North Pyongan",lat:40.36,lng:124.37,pop:.110},
    {id:"PRK-HWN",name:"South Hwanghae",lat:38.51,lng:125.70,pop:.090},
    {id:"PRK-HWB",name:"North Hwanghae",lat:38.67,lng:126.42,pop:.085},
    {id:"PRK-HMN",name:"South Hamgyong",lat:40.81,lng:128.19,pop:.130},
    {id:"PRK-HMB",name:"North Hamgyong",lat:41.79,lng:129.78,pop:.100},
    {id:"PRK-KWN",name:"Kangwon",lat:38.75,lng:127.55,pop:.060},
    {id:"PRK-CHA",name:"Chagang",lat:40.97,lng:126.59,pop:.055},
    {id:"PRK-RYG",name:"Ryanggang",lat:41.36,lng:128.20,pop:.030},
    {id:"PRK-KAE",name:"Kaesong",lat:37.97,lng:126.55,pop:.060}
  ],
  PAK: [
    {id:"PAK-PB",name:"Punjab",lat:31.17,lng:72.71,pop:.460},
    {id:"PAK-SD",name:"Sindh",lat:26.22,lng:68.35,pop:.210},
    {id:"PAK-KP",name:"Khyber Pakhtunkhwa",lat:34.17,lng:72.33,pop:.150},
    {id:"PAK-BA",name:"Balochistan",lat:28.49,lng:65.09,pop:.053},
    {id:"PAK-IS",name:"Islamabad",lat:33.69,lng:73.04,pop:.009},
    {id:"PAK-GB",name:"Gilgit-Baltistan",lat:35.80,lng:74.98,pop:.008},
    {id:"PAK-AK",name:"Azad Kashmir",lat:33.87,lng:73.82,pop:.018},
    {id:"PAK-TA",name:"FATA",lat:33.50,lng:70.50,pop:.022}
  ],
  IDN: [
    {id:"IDN-JW",name:"Java",lat:-7.61,lng:110.20,pop:.560},
    {id:"IDN-SU",name:"Sumatra",lat:-0.59,lng:101.34,pop:.200},
    {id:"IDN-KA",name:"Kalimantan",lat:-0.02,lng:109.33,pop:.060},
    {id:"IDN-SW",name:"Sulawesi",lat:-1.43,lng:121.45,pop:.070},
    {id:"IDN-BA",name:"Bali & Nusa Tenggara",lat:-8.41,lng:115.19,pop:.050},
    {id:"IDN-PA",name:"Papua",lat:-4.27,lng:138.08,pop:.020},
    {id:"IDN-MA",name:"Maluku",lat:-3.66,lng:128.19,pop:.015},
    {id:"IDN-JK",name:"Jakarta",lat:-6.21,lng:106.85,pop:.040}
  ],
  THA: [
    {id:"THA-BKK",name:"Bangkok",lat:13.76,lng:100.50,pop:.155},
    {id:"THA-CEN",name:"Central Thailand",lat:15.23,lng:100.47,pop:.220},
    {id:"THA-NOR",name:"Northern Thailand",lat:18.79,lng:98.98,pop:.170},
    {id:"THA-NE",name:"Northeast (Isan)",lat:16.43,lng:102.83,pop:.305},
    {id:"THA-SOU",name:"Southern Thailand",lat:8.63,lng:99.17,pop:.130},
    {id:"THA-EAS",name:"Eastern Thailand",lat:13.36,lng:101.85,pop:.070}
  ],
  VNM: [
    {id:"VNM-HN",name:"Hanoi",lat:21.03,lng:105.85,pop:.085},
    {id:"VNM-HCM",name:"Ho Chi Minh City",lat:10.82,lng:106.63,pop:.095},
    {id:"VNM-RRD",name:"Red River Delta",lat:20.86,lng:106.68,pop:.165},
    {id:"VNM-NE",name:"Northeast",lat:22.38,lng:106.05,pop:.075},
    {id:"VNM-NW",name:"Northwest",lat:21.39,lng:104.05,pop:.040},
    {id:"VNM-NCC",name:"North Central Coast",lat:18.00,lng:105.96,pop:.110},
    {id:"VNM-SCC",name:"South Central Coast",lat:13.77,lng:109.22,pop:.080},
    {id:"VNM-CH",name:"Central Highlands",lat:13.98,lng:108.00,pop:.060},
    {id:"VNM-SE",name:"Southeast",lat:11.95,lng:106.84,pop:.105},
    {id:"VNM-MKD",name:"Mekong Delta",lat:10.04,lng:105.77,pop:.185}
  ],
  MYS: [
    {id:"MYS-SEL",name:"Selangor",lat:3.07,lng:101.55,pop:.190},
    {id:"MYS-JHR",name:"Johor",lat:1.49,lng:103.74,pop:.110},
    {id:"MYS-SBH",name:"Sabah",lat:5.98,lng:116.07,pop:.110},
    {id:"MYS-SWK",name:"Sarawak",lat:1.55,lng:110.35,pop:.085},
    {id:"MYS-PRK",name:"Perak",lat:4.59,lng:101.09,pop:.075},
    {id:"MYS-KDH",name:"Kedah",lat:6.12,lng:100.37,pop:.065},
    {id:"MYS-PNG",name:"Penang",lat:5.42,lng:100.31,pop:.053},
    {id:"MYS-KTN",name:"Kelantan",lat:5.31,lng:102.14,pop:.055},
    {id:"MYS-PHG",name:"Pahang",lat:3.81,lng:103.33,pop:.050},
    {id:"MYS-TRG",name:"Terengganu",lat:5.31,lng:103.13,pop:.038},
    {id:"MYS-NSN",name:"Negeri Sembilan",lat:2.73,lng:101.94,pop:.035},
    {id:"MYS-MLK",name:"Malacca",lat:2.19,lng:102.25,pop:.028},
    {id:"MYS-PLS",name:"Perlis",lat:6.44,lng:100.20,pop:.008},
    {id:"MYS-KUL",name:"Kuala Lumpur",lat:3.14,lng:101.69,pop:.055}
  ],
  PHL: [
    {id:"PHL-NCR",name:"Metro Manila",lat:14.60,lng:120.98,pop:.130},
    {id:"PHL-CAL",name:"Calabarzon",lat:14.17,lng:121.24,pop:.145},
    {id:"PHL-CLR",name:"Central Luzon",lat:15.47,lng:120.97,pop:.110},
    {id:"PHL-WVS",name:"Western Visayas",lat:10.72,lng:122.56,pop:.075},
    {id:"PHL-CVS",name:"Central Visayas",lat:9.86,lng:124.00,pop:.070},
    {id:"PHL-DAV",name:"Davao",lat:7.19,lng:125.46,pop:.050},
    {id:"PHL-NMD",name:"Northern Mindanao",lat:8.22,lng:124.24,pop:.045},
    {id:"PHL-ILC",name:"Ilocos",lat:16.62,lng:120.32,pop:.050},
    {id:"PHL-BIC",name:"Bicol",lat:13.14,lng:123.73,pop:.060},
    {id:"PHL-EVS",name:"Eastern Visayas",lat:10.41,lng:124.96,pop:.045},
    {id:"PHL-ZAM",name:"Zamboanga",lat:6.91,lng:122.07,pop:.037},
    {id:"PHL-SOC",name:"Soccsksargen",lat:6.50,lng:124.85,pop:.045},
    {id:"PHL-CAR",name:"Cordillera",lat:16.41,lng:120.59,pop:.017},
    {id:"PHL-CAG",name:"Cagayan Valley",lat:16.98,lng:121.81,pop:.035},
    {id:"PHL-MIM",name:"Mimaropa",lat:12.88,lng:121.07,pop:.030},
    {id:"PHL-ARM",name:"Caraga",lat:8.95,lng:125.53,pop:.027},
    {id:"PHL-BAR",name:"BARMM",lat:7.33,lng:124.05,pop:.040}
  ],
  MMR: [
    {id:"MMR-YGN",name:"Yangon",lat:16.87,lng:96.20,pop:.146},
    {id:"MMR-MDY",name:"Mandalay",lat:21.97,lng:96.08,pop:.116},
    {id:"MMR-SGG",name:"Sagaing",lat:22.11,lng:95.08,pop:.107},
    {id:"MMR-AYY",name:"Ayeyarwady",lat:16.78,lng:95.00,pop:.116},
    {id:"MMR-BAG",name:"Bago",lat:17.34,lng:96.48,pop:.094},
    {id:"MMR-SHN",name:"Shan",lat:20.78,lng:97.04,pop:.107},
    {id:"MMR-MON",name:"Mon",lat:16.50,lng:97.63,pop:.040},
    {id:"MMR-KCH",name:"Kachin",lat:25.39,lng:97.40,pop:.033},
    {id:"MMR-KYN",name:"Kayin",lat:16.88,lng:97.63,pop:.029},
    {id:"MMR-CHN",name:"Chin",lat:21.50,lng:93.50,pop:.009},
    {id:"MMR-RKE",name:"Rakhine",lat:20.15,lng:92.90,pop:.060},
    {id:"MMR-MGY",name:"Magway",lat:20.15,lng:94.93,pop:.075},
    {id:"MMR-TNI",name:"Tanintharyi",lat:12.06,lng:98.98,pop:.028},
    {id:"MMR-NPT",name:"Nay Pyi Taw",lat:19.76,lng:96.07,pop:.024},
    {id:"MMR-KYH",name:"Kayah",lat:19.67,lng:97.21,pop:.006}
  ],
  TWN: [
    {id:"TWN-TPE",name:"Taipei",lat:25.03,lng:121.57,pop:.270},
    {id:"TWN-KHH",name:"Kaohsiung",lat:22.63,lng:120.30,pop:.116},
    {id:"TWN-TXG",name:"Taichung",lat:24.14,lng:120.67,pop:.117},
    {id:"TWN-TNN",name:"Tainan",lat:22.99,lng:120.21,pop:.079},
    {id:"TWN-TPQ",name:"New Taipei",lat:25.01,lng:121.46,pop:.168},
    {id:"TWN-TYC",name:"Taoyuan",lat:24.99,lng:121.31,pop:.095},
    {id:"TWN-HUA",name:"Hualien",lat:23.99,lng:121.60,pop:.014},
    {id:"TWN-ILA",name:"Yilan",lat:24.76,lng:121.75,pop:.019},
    {id:"TWN-CYI",name:"Chiayi",lat:23.48,lng:120.45,pop:.022},
    {id:"TWN-HSZ",name:"Hsinchu",lat:24.80,lng:120.97,pop:.019},
    {id:"TWN-MIA",name:"Miaoli",lat:24.57,lng:120.82,pop:.023},
    {id:"TWN-NTO",name:"Nantou",lat:23.91,lng:120.68,pop:.021},
    {id:"TWN-PIF",name:"Pingtung",lat:22.55,lng:120.49,pop:.035},
    {id:"TWN-TTT",name:"Taitung",lat:22.76,lng:121.14,pop:.009}
  ],
  KAZ: [
    {id:"KAZ-AST",name:"Astana",lat:51.17,lng:71.43,pop:.060},
    {id:"KAZ-ALA",name:"Almaty City",lat:43.24,lng:76.95,pop:.100},
    {id:"KAZ-ALM",name:"Almaty Region",lat:44.85,lng:77.87,pop:.110},
    {id:"KAZ-MAN",name:"Mangystau",lat:43.35,lng:51.85,pop:.040},
    {id:"KAZ-ATY",name:"Atyrau",lat:47.10,lng:51.92,pop:.035},
    {id:"KAZ-KAR",name:"Karaganda",lat:49.80,lng:73.10,pop:.070},
    {id:"KAZ-PAV",name:"Pavlodar",lat:52.29,lng:76.95,pop:.040},
    {id:"KAZ-KOS",name:"Kostanay",lat:53.21,lng:63.63,pop:.045},
    {id:"KAZ-AKT",name:"Aktobe",lat:50.28,lng:57.21,pop:.045},
    {id:"KAZ-SKO",name:"South Kazakhstan",lat:42.32,lng:69.60,pop:.155},
    {id:"KAZ-EKO",name:"East Kazakhstan",lat:49.95,lng:82.61,pop:.072},
    {id:"KAZ-ZHM",name:"Zhambyl",lat:42.90,lng:71.38,pop:.058},
    {id:"KAZ-NKO",name:"North Kazakhstan",lat:54.87,lng:69.16,pop:.028},
    {id:"KAZ-KYZ",name:"Kyzylorda",lat:44.85,lng:65.52,pop:.042},
    {id:"KAZ-WKO",name:"West Kazakhstan",lat:50.24,lng:51.37,pop:.035},
    {id:"KAZ-SHY",name:"Shymkent",lat:42.32,lng:69.60,pop:.055}
  ],
  IRN: [
    {id:"IRN-TEH",name:"Tehran",lat:35.70,lng:51.42,pop:.156},
    {id:"IRN-ISF",name:"Isfahan",lat:32.65,lng:51.68,pop:.058},
    {id:"IRN-KHZ",name:"Khuzestan",lat:31.32,lng:48.68,pop:.053},
    {id:"IRN-FRS",name:"Fars",lat:29.62,lng:52.53,pop:.056},
    {id:"IRN-RSH",name:"Razavi Khorasan",lat:36.30,lng:59.57,pop:.072},
    {id:"IRN-AZE",name:"East Azerbaijan",lat:38.08,lng:46.29,pop:.045},
    {id:"IRN-AZW",name:"West Azerbaijan",lat:37.55,lng:45.00,pop:.038},
    {id:"IRN-MAZ",name:"Mazandaran",lat:36.57,lng:53.06,pop:.038},
    {id:"IRN-GIL",name:"Gilan",lat:37.28,lng:49.59,pop:.030},
    {id:"IRN-KRM",name:"Kerman",lat:30.28,lng:57.08,pop:.037},
    {id:"IRN-SBL",name:"Sistan-Baluchestan",lat:29.11,lng:60.20,pop:.032},
    {id:"IRN-ALB",name:"Alborz",lat:35.83,lng:50.99,pop:.030},
    {id:"IRN-KRD",name:"Kurdistan",lat:35.31,lng:47.00,pop:.019},
    {id:"IRN-HMD",name:"Hamadan",lat:34.80,lng:48.51,pop:.021},
    {id:"IRN-LOR",name:"Lorestan",lat:33.49,lng:48.36,pop:.020},
    {id:"IRN-GLS",name:"Golestan",lat:37.25,lng:55.17,pop:.021},
    {id:"IRN-BUS",name:"Bushehr",lat:28.97,lng:50.84,pop:.013},
    {id:"IRN-HOR",name:"Hormozgan",lat:27.19,lng:56.27,pop:.019},
    {id:"IRN-QOM",name:"Qom",lat:34.64,lng:50.88,pop:.015},
    {id:"IRN-ARD",name:"Ardabil",lat:38.25,lng:48.30,pop:.015}
  ],
  IRQ: [
    {id:"IRQ-BG",name:"Baghdad",lat:33.31,lng:44.37,pop:.210},
    {id:"IRQ-BS",name:"Basra",lat:30.51,lng:47.78,pop:.080},
    {id:"IRQ-NI",name:"Nineveh",lat:36.34,lng:43.13,pop:.100},
    {id:"IRQ-SU",name:"Sulaymaniyah",lat:35.56,lng:45.44,pop:.060},
    {id:"IRQ-ER",name:"Erbil",lat:36.19,lng:44.01,pop:.060},
    {id:"IRQ-AN",name:"Anbar",lat:33.43,lng:43.30,pop:.050},
    {id:"IRQ-BB",name:"Babil",lat:32.62,lng:44.42,pop:.060},
    {id:"IRQ-DY",name:"Diyala",lat:33.95,lng:45.15,pop:.045},
    {id:"IRQ-KI",name:"Kirkuk",lat:35.47,lng:44.39,pop:.045},
    {id:"IRQ-NA",name:"Najaf",lat:32.00,lng:44.34,pop:.040},
    {id:"IRQ-KA",name:"Karbala",lat:32.62,lng:44.02,pop:.035},
    {id:"IRQ-WA",name:"Wasit",lat:32.90,lng:45.83,pop:.040},
    {id:"IRQ-DH",name:"Dhi Qar",lat:31.04,lng:46.26,pop:.060},
    {id:"IRQ-MI",name:"Maysan",lat:31.84,lng:47.14,pop:.035},
    {id:"IRQ-MU",name:"Muthanna",lat:31.32,lng:45.23,pop:.020},
    {id:"IRQ-SA",name:"Saladin",lat:34.40,lng:43.49,pop:.050},
    {id:"IRQ-DA",name:"Dahuk",lat:36.87,lng:43.00,pop:.035}
  ],
  ISR: [
    {id:"ISR-TA",name:"Tel Aviv",lat:32.09,lng:34.78,pop:.300},
    {id:"ISR-JM",name:"Jerusalem",lat:31.77,lng:35.23,pop:.200},
    {id:"ISR-HF",name:"Haifa",lat:32.79,lng:34.99,pop:.150},
    {id:"ISR-CE",name:"Central",lat:32.05,lng:34.83,pop:.150},
    {id:"ISR-SO",name:"Southern",lat:31.25,lng:34.79,pop:.100},
    {id:"ISR-NO",name:"Northern",lat:32.70,lng:35.30,pop:.100}
  ],
  SAU: [
    {id:"SAU-RIY",name:"Riyadh",lat:24.71,lng:46.67,pop:.230},
    {id:"SAU-MK",name:"Makkah",lat:21.39,lng:39.86,pop:.230},
    {id:"SAU-EP",name:"Eastern Province",lat:26.42,lng:50.10,pop:.145},
    {id:"SAU-AS",name:"Asir",lat:18.22,lng:42.50,pop:.065},
    {id:"SAU-MD",name:"Madinah",lat:24.47,lng:39.61,pop:.060},
    {id:"SAU-QS",name:"Qassim",lat:26.33,lng:43.97,pop:.040},
    {id:"SAU-JZ",name:"Jazan",lat:17.00,lng:42.75,pop:.050},
    {id:"SAU-TB",name:"Tabuk",lat:28.38,lng:36.57,pop:.028},
    {id:"SAU-HL",name:"Ha'il",lat:27.52,lng:41.69,pop:.022},
    {id:"SAU-NJ",name:"Najran",lat:17.49,lng:44.13,pop:.018},
    {id:"SAU-JF",name:"Al Jawf",lat:29.97,lng:40.00,pop:.015},
    {id:"SAU-NB",name:"Northern Borders",lat:30.98,lng:41.12,pop:.012},
    {id:"SAU-BA",name:"Al Bahah",lat:20.00,lng:41.47,pop:.012}
  ],
  EGY: [
    {id:"EGY-CAI",name:"Cairo",lat:30.04,lng:31.24,pop:.105},
    {id:"EGY-GIZ",name:"Giza",lat:30.01,lng:31.21,pop:.090},
    {id:"EGY-ALX",name:"Alexandria",lat:31.20,lng:29.92,pop:.055},
    {id:"EGY-QAL",name:"Qalyubia",lat:30.33,lng:31.22,pop:.060},
    {id:"EGY-SHQ",name:"Sharqia",lat:30.67,lng:31.50,pop:.075},
    {id:"EGY-DAK",name:"Dakahlia",lat:31.04,lng:31.38,pop:.069},
    {id:"EGY-BHS",name:"Beheira",lat:31.05,lng:30.47,pop:.065},
    {id:"EGY-MNF",name:"Monufia",lat:30.59,lng:30.99,pop:.045},
    {id:"EGY-MIN",name:"Minya",lat:28.11,lng:30.75,pop:.058},
    {id:"EGY-AST",name:"Asyut",lat:27.18,lng:31.17,pop:.047},
    {id:"EGY-SHG",name:"Sohag",lat:26.56,lng:31.69,pop:.053},
    {id:"EGY-GRB",name:"Gharbia",lat:30.87,lng:31.03,pop:.052},
    {id:"EGY-FAY",name:"Fayoum",lat:29.31,lng:30.84,pop:.038},
    {id:"EGY-SUI",name:"Suez",lat:30.06,lng:32.28,pop:.008},
    {id:"EGY-ASW",name:"Aswan",lat:24.09,lng:32.90,pop:.016},
    {id:"EGY-LUX",name:"Luxor",lat:25.69,lng:32.64,pop:.013},
    {id:"EGY-SIN",name:"Sinai",lat:29.50,lng:34.00,pop:.010},
    {id:"EGY-PSD",name:"Port Said",lat:31.26,lng:32.28,pop:.008},
    {id:"EGY-ISM",name:"Ismailia",lat:30.60,lng:32.27,pop:.014},
    {id:"EGY-KFS",name:"Kafr el-Sheikh",lat:31.34,lng:30.94,pop:.036},
    {id:"EGY-QEN",name:"Qena",lat:26.16,lng:32.73,pop:.034},
    {id:"EGY-BNS",name:"Beni Suef",lat:29.07,lng:31.10,pop:.035}
  ],
  ARE: [
    {id:"ARE-AUH",name:"Abu Dhabi",lat:24.45,lng:54.65,pop:.350},
    {id:"ARE-DXB",name:"Dubai",lat:25.20,lng:55.27,pop:.350},
    {id:"ARE-SHJ",name:"Sharjah",lat:25.36,lng:55.39,pop:.160},
    {id:"ARE-AJM",name:"Ajman",lat:25.41,lng:55.48,pop:.060},
    {id:"ARE-RAK",name:"Ras Al Khaimah",lat:25.79,lng:55.94,pop:.040},
    {id:"ARE-FUJ",name:"Fujairah",lat:25.13,lng:56.33,pop:.025},
    {id:"ARE-UMQ",name:"Umm Al-Quwain",lat:25.56,lng:55.55,pop:.015}
  ],
  NGA: [
    {id:"NGA-LA",name:"Lagos",lat:6.52,lng:3.38,pop:.070},
    {id:"NGA-KN",name:"Kano",lat:12.00,lng:8.52,pop:.065},
    {id:"NGA-RI",name:"Rivers",lat:4.82,lng:6.98,pop:.038},
    {id:"NGA-OY",name:"Oyo",lat:7.85,lng:3.93,pop:.043},
    {id:"NGA-KD",name:"Kaduna",lat:10.52,lng:7.43,pop:.044},
    {id:"NGA-KT",name:"Katsina",lat:13.01,lng:7.60,pop:.043},
    {id:"NGA-BA",name:"Bauchi",lat:10.31,lng:9.84,pop:.037},
    {id:"NGA-JI",name:"Jigawa",lat:12.23,lng:9.56,pop:.033},
    {id:"NGA-BO",name:"Borno",lat:11.85,lng:13.15,pop:.032},
    {id:"NGA-DE",name:"Delta",lat:5.89,lng:5.68,pop:.031},
    {id:"NGA-NI",name:"Niger",lat:9.93,lng:5.60,pop:.031},
    {id:"NGA-BE",name:"Benue",lat:7.34,lng:8.74,pop:.033},
    {id:"NGA-AN",name:"Anambra",lat:6.21,lng:7.07,pop:.031},
    {id:"NGA-IM",name:"Imo",lat:5.49,lng:7.03,pop:.030},
    {id:"NGA-AG",name:"Akwa Ibom",lat:5.01,lng:7.85,pop:.031},
    {id:"NGA-SO",name:"Sokoto",lat:13.06,lng:5.24,pop:.028},
    {id:"NGA-ZA",name:"Zamfara",lat:12.17,lng:6.25,pop:.025},
    {id:"NGA-AD",name:"Adamawa",lat:9.33,lng:12.40,pop:.024},
    {id:"NGA-OG",name:"Ogun",lat:7.16,lng:3.35,pop:.028},
    {id:"NGA-FC",name:"Abuja FCT",lat:9.06,lng:7.49,pop:.020},
    {id:"NGA-EN",name:"Enugu",lat:6.44,lng:7.50,pop:.025},
    {id:"NGA-ON",name:"Ondo",lat:7.25,lng:5.21,pop:.023},
    {id:"NGA-OS",name:"Osun",lat:7.56,lng:4.52,pop:.025},
    {id:"NGA-ED",name:"Edo",lat:6.34,lng:5.62,pop:.023},
    {id:"NGA-PL",name:"Plateau",lat:9.22,lng:9.52,pop:.023},
    {id:"NGA-CR",name:"Cross River",lat:5.96,lng:8.34,pop:.022},
    {id:"NGA-YO",name:"Yobe",lat:12.29,lng:11.75,pop:.019},
    {id:"NGA-TA",name:"Taraba",lat:7.87,lng:9.78,pop:.017},
    {id:"NGA-AB",name:"Abia",lat:5.45,lng:7.52,pop:.022}
  ],
  ZAF: [
    {id:"ZAF-GP",name:"Gauteng",lat:-26.20,lng:28.05,pop:.264},
    {id:"ZAF-KZN",name:"KwaZulu-Natal",lat:-29.01,lng:30.29,pop:.192},
    {id:"ZAF-WC",name:"Western Cape",lat:-33.92,lng:18.42,pop:.115},
    {id:"ZAF-EC",name:"Eastern Cape",lat:-32.30,lng:26.52,pop:.105},
    {id:"ZAF-LP",name:"Limpopo",lat:-23.40,lng:29.42,pop:.097},
    {id:"ZAF-MP",name:"Mpumalanga",lat:-25.57,lng:30.53,pop:.076},
    {id:"ZAF-NW",name:"North West",lat:-26.66,lng:25.29,pop:.066},
    {id:"ZAF-FS",name:"Free State",lat:-29.08,lng:26.16,pop:.048},
    {id:"ZAF-NC",name:"Northern Cape",lat:-29.05,lng:21.86,pop:.021}
  ],
  DZA: [
    {id:"DZA-ALG",name:"Algiers",lat:36.75,lng:3.04,pop:.120},
    {id:"DZA-ORA",name:"Oran",lat:35.70,lng:-0.63,pop:.070},
    {id:"DZA-CON",name:"Constantine",lat:36.37,lng:6.61,pop:.060},
    {id:"DZA-BLI",name:"Blida",lat:36.47,lng:2.83,pop:.060},
    {id:"DZA-SET",name:"Sétif",lat:36.19,lng:5.41,pop:.070},
    {id:"DZA-TLM",name:"Tlemcen",lat:34.88,lng:-1.32,pop:.050},
    {id:"DZA-BAT",name:"Batna",lat:35.56,lng:6.17,pop:.055},
    {id:"DZA-MED",name:"Médéa",lat:36.27,lng:2.75,pop:.045},
    {id:"DZA-MSL",name:"M'sila",lat:35.70,lng:4.54,pop:.050},
    {id:"DZA-TIZ",name:"Tizi Ouzou",lat:36.71,lng:4.05,pop:.055},
    {id:"DZA-BEJ",name:"Béjaïa",lat:36.76,lng:5.08,pop:.050},
    {id:"DZA-SKD",name:"Skikda",lat:36.88,lng:6.91,pop:.045},
    {id:"DZA-ANB",name:"Annaba",lat:36.90,lng:7.77,pop:.035},
    {id:"DZA-GHA",name:"Ghardaia",lat:32.49,lng:3.67,pop:.020},
    {id:"DZA-TAM",name:"Tamanrasset",lat:22.79,lng:5.53,pop:.010},
    {id:"DZA-OUA",name:"Ouargla",lat:31.95,lng:5.33,pop:.030},
    {id:"DZA-CHL",name:"Chlef",lat:36.17,lng:1.33,pop:.050},
    {id:"DZA-JIJ",name:"Jijel",lat:36.82,lng:5.77,pop:.035},
    {id:"DZA-ADR",name:"Adrar",lat:27.87,lng:-0.29,pop:.020}
  ],
  ETH: [
    {id:"ETH-AA",name:"Addis Ababa",lat:9.02,lng:38.75,pop:.045},
    {id:"ETH-OR",name:"Oromia",lat:7.55,lng:40.49,pop:.360},
    {id:"ETH-AM",name:"Amhara",lat:11.60,lng:37.95,pop:.210},
    {id:"ETH-SN",name:"SNNPR",lat:6.83,lng:37.58,pop:.160},
    {id:"ETH-TI",name:"Tigray",lat:13.50,lng:39.48,pop:.058},
    {id:"ETH-SO",name:"Somali",lat:6.66,lng:43.79,pop:.055},
    {id:"ETH-AF",name:"Afar",lat:11.76,lng:40.96,pop:.019},
    {id:"ETH-BG",name:"Benishangul-Gumuz",lat:10.78,lng:35.56,pop:.009},
    {id:"ETH-GA",name:"Gambela",lat:8.25,lng:34.59,pop:.004},
    {id:"ETH-HR",name:"Harari",lat:9.31,lng:42.12,pop:.002},
    {id:"ETH-DD",name:"Dire Dawa",lat:9.60,lng:41.85,pop:.004},
    {id:"ETH-SD",name:"Sidama",lat:6.73,lng:38.48,pop:.038}
  ],
  AUS: [
    {id:"AUS-NSW",name:"New South Wales",lat:-33.87,lng:151.21,pop:.308},
    {id:"AUS-VIC",name:"Victoria",lat:-37.81,lng:144.96,pop:.254},
    {id:"AUS-QLD",name:"Queensland",lat:-20.92,lng:142.70,pop:.200},
    {id:"AUS-WA",name:"Western Australia",lat:-31.95,lng:115.86,pop:.105},
    {id:"AUS-SA",name:"South Australia",lat:-34.93,lng:138.60,pop:.069},
    {id:"AUS-TAS",name:"Tasmania",lat:-42.88,lng:147.33,pop:.022},
    {id:"AUS-ACT",name:"ACT",lat:-35.28,lng:149.13,pop:.017},
    {id:"AUS-NT",name:"Northern Territory",lat:-12.46,lng:130.84,pop:.010}
  ],
  NZL: [
    {id:"NZL-AUK",name:"Auckland",lat:-36.85,lng:174.76,pop:.334},
    {id:"NZL-WGN",name:"Wellington",lat:-41.29,lng:174.78,pop:.110},
    {id:"NZL-CAN",name:"Canterbury",lat:-43.53,lng:172.64,pop:.132},
    {id:"NZL-WAI",name:"Waikato",lat:-37.79,lng:175.28,pop:.098},
    {id:"NZL-BOP",name:"Bay of Plenty",lat:-37.69,lng:176.17,pop:.066},
    {id:"NZL-MWT",name:"Manawatū-Whanganui",lat:-39.93,lng:175.05,pop:.048},
    {id:"NZL-OTG",name:"Otago",lat:-45.03,lng:170.48,pop:.048},
    {id:"NZL-HKB",name:"Hawke's Bay",lat:-39.49,lng:176.92,pop:.036},
    {id:"NZL-TKI",name:"Taranaki",lat:-39.06,lng:174.08,pop:.025},
    {id:"NZL-NTL",name:"Northland",lat:-35.73,lng:174.32,pop:.038},
    {id:"NZL-STL",name:"Southland",lat:-46.41,lng:168.35,pop:.020},
    {id:"NZL-GIS",name:"Gisborne",lat:-38.66,lng:178.02,pop:.010},
    {id:"NZL-MBH",name:"Marlborough",lat:-41.51,lng:173.95,pop:.010},
    {id:"NZL-NSN",name:"Nelson",lat:-41.27,lng:173.28,pop:.010},
    {id:"NZL-WTC",name:"West Coast",lat:-42.45,lng:171.21,pop:.007},
    {id:"NZL-TAS",name:"Tasman",lat:-41.27,lng:172.85,pop:.010}
  ]
};

/* ============================================================
   TERRITORY HELPER FUNCTIONS
   ============================================================ */

/**
 * Get the country code from a territory ID (e.g., "USA-CA" → "USA")
 */
function getTerritoryCountry(territoryId) {
  if (!territoryId || typeof territoryId !== "string") return null;
  // Country codes in TERRITORY_DATA are 2-3 uppercase letters before the first dash
  const parts = territoryId.split("-");
  return parts[0] || null;
}

/**
 * Get all territory objects for a country code
 */
function getTerritoriesForCountry(countryCode) {
  return TERRITORY_DATA[countryCode] || [];
}

/**
 * Get a specific territory object by ID
 */
function getTerritoryById(territoryId) {
  const country = getTerritoryCountry(territoryId);
  if (!country || !TERRITORY_DATA[country]) return null;
  return TERRITORY_DATA[country].find(t => t.id === territoryId) || null;
}

/**
 * Get neighboring territory IDs for a given territory.
 * Uses proximity-based adjacency: territories within the same country
 * are always connected. Cross-country adjacency uses geographic proximity
 * via the existing NEIGHBORS map and border distance.
 */
function getTerritoryNeighbors(territoryId) {
  const country = getTerritoryCountry(territoryId);
  if (!country) return [];
  const territory = getTerritoryById(territoryId);
  if (!territory) return [];

  const neighbors = [];

  // All territories in the same country are neighbors (intranational movement)
  const siblings = TERRITORY_DATA[country] || [];
  for (const sib of siblings) {
    if (sib.id !== territoryId) neighbors.push(sib.id);
  }

  // Cross-country: find territories of neighboring countries that are geographically close
  const countryNeighbors = NEIGHBORS[country] || [];
  for (const neighborCountry of countryNeighbors) {
    const neighborTerritories = TERRITORY_DATA[neighborCountry] || [];
    // Find the closest territory in the neighbor country
    let closest = null;
    let closestDist = Infinity;
    for (const nt of neighborTerritories) {
      const dist = Math.sqrt(
        (territory.lat - nt.lat) ** 2 + (territory.lng - nt.lng) ** 2
      );
      if (dist < closestDist) {
        closestDist = dist;
        closest = nt;
      }
    }
    // Add the closest neighbor territory (and any others within 8 degrees)
    for (const nt of neighborTerritories) {
      const dist = Math.sqrt(
        (territory.lat - nt.lat) ** 2 + (territory.lng - nt.lng) ** 2
      );
      if (dist < 8 || nt === closest) {
        if (!neighbors.includes(nt.id)) neighbors.push(nt.id);
      }
    }
  }

  return neighbors;
}

/**
 * Check if a territory is a border territory (adjacent to another country)
 */
function isBorderTerritory(territoryId) {
  const country = getTerritoryCountry(territoryId);
  if (!country) return false;
  const territory = getTerritoryById(territoryId);
  if (!territory) return false;

  const countryNeighbors = NEIGHBORS[country] || [];
  for (const neighborCountry of countryNeighbors) {
    const neighborTerritories = TERRITORY_DATA[neighborCountry] || [];
    for (const nt of neighborTerritories) {
      const dist = Math.sqrt(
        (territory.lat - nt.lat) ** 2 + (territory.lng - nt.lng) ** 2
      );
      if (dist < 8) return true;
    }
  }
  return false;
}

/**
 * Get total number of territories across all countries
 */
function getTotalTerritoryCount() {
  let count = 0;
  for (const territories of Object.values(TERRITORY_DATA)) {
    count += territories.length;
  }
  return count;
}
