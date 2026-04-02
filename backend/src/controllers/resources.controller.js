const locationCatalog = [
  {
    name: "Maharashtra",
    districts: [
      {
        name: "Pune",
        busStands: [
          { id: "mh-pune-central-bus-station", name: "Central Bus Station", state: "Maharashtra", district: "Pune", note: "Main city interchange" },
          { id: "mh-pune-main-market", name: "Main Market", state: "Maharashtra", district: "Pune", note: "Close to hostels and markets" },
          { id: "mh-pune-city-center", name: "City Center", state: "Maharashtra", district: "Pune", note: "Downtown commuter stop" },
          { id: "mh-pune-tech-park", name: "Tech Park", state: "Maharashtra", district: "Pune", note: "IT corridor pickup point" },
          { id: "mh-pune-university-campus", name: "University Campus", state: "Maharashtra", district: "Pune", note: "Nearest access for colleges" },
          { id: "mh-pune-pune-station", name: "Pune Station", state: "Maharashtra", district: "Pune", note: "Rail and bus transfer point" },
        ],
      },
      {
        name: "Nagpur",
        busStands: [
          { id: "mh-nagpur-north-terminal", name: "North Terminal", state: "Maharashtra", district: "Nagpur", note: "Long-route bus terminal" },
          { id: "mh-nagpur-railway-station", name: "Railway Station", state: "Maharashtra", district: "Nagpur", note: "Rail interconnect stop" },
          { id: "mh-nagpur-hospital-junction", name: "Hospital Junction", state: "Maharashtra", district: "Nagpur", note: "Near medical institutions" },
          { id: "mh-nagpur-medical-college", name: "Medical College", state: "Maharashtra", district: "Nagpur", note: "Best for medical campus" },
          { id: "mh-nagpur-orange-market", name: "Orange Market", state: "Maharashtra", district: "Nagpur", note: "Busy commercial pickup" },
          { id: "mh-nagpur-wardha-road", name: "Wardha Road", state: "Maharashtra", district: "Nagpur", note: "Outbound corridor stop" },
        ],
      },
    ],
  },
  {
    name: "Karnataka",
    districts: [
      {
        name: "Bengaluru",
        busStands: [
          { id: "ka-blr-south-gate", name: "South Gate", state: "Karnataka", district: "Bengaluru", note: "South corridor boarding stop" },
          { id: "ka-blr-court-complex", name: "Court Complex", state: "Karnataka", district: "Bengaluru", note: "Near legal and admin offices" },
          { id: "ka-blr-secretariat", name: "Secretariat", state: "Karnataka", district: "Bengaluru", note: "Government district pickup" },
          { id: "ka-blr-law-university", name: "Law University", state: "Karnataka", district: "Bengaluru", note: "College-side drop point" },
          { id: "ka-blr-silk-board", name: "Silk Board", state: "Karnataka", district: "Bengaluru", note: "Major junction" },
          { id: "ka-blr-majestic", name: "Majestic", state: "Karnataka", district: "Bengaluru", note: "Central bus interchange" },
        ],
      },
      {
        name: "Mysuru",
        busStands: [
          { id: "ka-mys-east-point", name: "East Point", state: "Karnataka", district: "Mysuru", note: "Eastern city pickup point" },
          { id: "ka-mys-museum", name: "Museum", state: "Karnataka", district: "Mysuru", note: "Cultural district stop" },
          { id: "ka-mys-library", name: "Library", state: "Karnataka", district: "Mysuru", note: "Academic zone access" },
          { id: "ka-mys-arts-college", name: "Arts College", state: "Karnataka", district: "Mysuru", note: "Closest access for arts students" },
          { id: "ka-mys-jss-campus", name: "JSS Campus", state: "Karnataka", district: "Mysuru", note: "Popular college drop point" },
          { id: "ka-mys-palace-junction", name: "Palace Junction", state: "Karnataka", district: "Mysuru", note: "City transfer stop" },
        ],
      },
    ],
  },
  {
    name: "Tamil Nadu",
    districts: [
      {
        name: "Chennai",
        busStands: [
          { id: "tn-che-west-hub", name: "West Hub", state: "Tamil Nadu", district: "Chennai", note: "Western corridor pickup point" },
          { id: "tn-che-industrial-zone", name: "Industrial Zone", state: "Tamil Nadu", district: "Chennai", note: "Near manufacturing belt" },
          { id: "tn-che-factory-area", name: "Factory Area", state: "Tamil Nadu", district: "Chennai", note: "Useful for shift commuters" },
          { id: "tn-che-polytechnic", name: "Polytechnic", state: "Tamil Nadu", district: "Chennai", note: "Technical college access" },
          { id: "tn-che-anna-nagar", name: "Anna Nagar", state: "Tamil Nadu", district: "Chennai", note: "Residential pickup point" },
          { id: "tn-che-central-station", name: "Central Station", state: "Tamil Nadu", district: "Chennai", note: "Rail and bus interchange" },
        ],
      },
      {
        name: "Coimbatore",
        busStands: [
          { id: "tn-cbe-city-center", name: "City Center", state: "Tamil Nadu", district: "Coimbatore", note: "Central student pickup zone" },
          { id: "tn-cbe-tech-park", name: "Tech Park", state: "Tamil Nadu", district: "Coimbatore", note: "IT and campus commuters" },
          { id: "tn-cbe-university-campus", name: "University Campus", state: "Tamil Nadu", district: "Coimbatore", note: "Best drop for college entry" },
          { id: "tn-cbe-medical-college", name: "Medical College", state: "Tamil Nadu", district: "Coimbatore", note: "Closest stop for hospital campus" },
          { id: "tn-cbe-gandhipuram", name: "Gandhipuram", state: "Tamil Nadu", district: "Coimbatore", note: "City interchange and market stop" },
          { id: "tn-cbe-ukkadam", name: "Ukkadam", state: "Tamil Nadu", district: "Coimbatore", note: "Popular outbound terminal" },
        ],
      },
    ],
  },
  {
    name: "Kerala",
    districts: [
      {
        name: "Ernakulam",
        busStands: [
          { id: "kl-ekm-north-terminal", name: "North Terminal", state: "Kerala", district: "Ernakulam", note: "Long-route terminal" },
          { id: "kl-ekm-kaloor", name: "Kaloor", state: "Kerala", district: "Ernakulam", note: "Busy city boarding point" },
          { id: "kl-ekm-mg-road", name: "MG Road", state: "Kerala", district: "Ernakulam", note: "Central commercial pickup" },
          { id: "kl-ekm-hospital-junction", name: "Hospital Junction", state: "Kerala", district: "Ernakulam", note: "Medical campus access" },
          { id: "kl-ekm-cochin-university", name: "Cochin University", state: "Kerala", district: "Ernakulam", note: "University commuter point" },
          { id: "kl-ekm-high-court", name: "High Court", state: "Kerala", district: "Ernakulam", note: "Government district stop" },
        ],
      },
      {
        name: "Thiruvananthapuram",
        busStands: [
          { id: "kl-tvm-central-bus-station", name: "Central Bus Station", state: "Kerala", district: "Thiruvananthapuram", note: "Main city bus hub" },
          { id: "kl-tvm-main-market", name: "Main Market", state: "Kerala", district: "Thiruvananthapuram", note: "City-side access point" },
          { id: "kl-tvm-city-center", name: "City Center", state: "Kerala", district: "Thiruvananthapuram", note: "Central shopping and transfer area" },
          { id: "kl-tvm-tech-park", name: "Tech Park", state: "Kerala", district: "Thiruvananthapuram", note: "IT corridor stop" },
          { id: "kl-tvm-medical-college", name: "Medical College", state: "Kerala", district: "Thiruvananthapuram", note: "College-side drop point" },
          { id: "kl-tvm-vazhuthacaud", name: "Vazhuthacaud", state: "Kerala", district: "Thiruvananthapuram", note: "Residential commuter stop" },
        ],
      },
    ],
  },
];

const findState = (stateName) => locationCatalog.find((state) => state.name.toLowerCase() === stateName.toLowerCase());

const findDistrict = (stateName, districtName) => {
  const state = findState(stateName);

  return state?.districts.find((district) => district.name.toLowerCase() === districtName.toLowerCase());
};

export const getStates = (req, res) => {
  return res.status(200).json({
    states: locationCatalog.map((state) => state.name),
  });
};

export const getDistricts = (req, res) => {
  const stateName = String(req.query.state ?? "").trim();

  if (!stateName) {
    return res.status(200).json({ districts: [] });
  }

  const state = findState(stateName);

  return res.status(200).json({
    districts: state ? state.districts.map((district) => district.name) : [],
  });
};

export const getBusStands = (req, res) => {
  const stateName = String(req.query.state ?? "").trim();
  const districtName = String(req.query.district ?? "").trim();

  if (!stateName || !districtName) {
    return res.status(200).json({ busStands: [] });
  }

  const district = findDistrict(stateName, districtName);

  return res.status(200).json({
    busStands: district ? district.busStands : [],
  });
};