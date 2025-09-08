import { EventDefinition } from './types';

export const LIFE_EVENTS: EventDefinition[] = [
  // ───────────────── Positive Events ─────────────────
  { id: 'e1', name: 'Marriage', points: 100, category: 'positive' },
  { id: 'e2', name: 'Has Baby', points: 200, category: 'positive' },
  { id: 'e3', name: 'Gets Promotion', points: 150, category: 'positive' },
  { id: 'e4', name: 'Graduates', points: 75, category: 'positive' },
  { id: 'e5', name: 'Wins Award', points: 50, category: 'positive' },
  { id: 'e6', name: 'Buys House', points: 120, category: 'positive' },
  { id: 'e14', name: 'Hosts Holiday Dinner', points: 30, category: 'positive' },

  // Added positives (minor → epic)
  { id: 'e15', name: 'Gets Engaged', points: 80, category: 'positive' },
  { id: 'e16', name: 'New Job (Lateral Move)', points: 60, category: 'positive' },
  { id: 'e17', name: 'Big Promotion (Exec/Partner)', points: 200, category: 'positive' },
  { id: 'e18', name: 'Starts Business', points: 130, category: 'positive' },
  { id: 'e19', name: 'Business Hits Profitability', points: 150, category: 'positive' },
  { id: 'e20', name: 'Sells Business / Major Liquidity', points: 200, category: 'positive' },
  { id: 'e21', name: 'Publishes Book / Album', points: 90, category: 'positive' },
  { id: 'e22', name: 'Completes Major Certification', points: 70, category: 'positive' },
  { id: 'e23', name: 'Finishes Marathon / Triathlon', points: 60, category: 'positive' },
  { id: 'e24', name: 'Volunteers (Significant Event)', points: 40, category: 'positive' },
  { id: 'e25', name: 'Organizes Community Event', points: 55, category: 'positive' },
  { id: 'e26', name: 'Major Award (State/National)', points: 120, category: 'positive' },
  { id: 'e27', name: 'Buys Car (New/Upgrade)', points: 40, category: 'positive' },
  { id: 'e28', name: 'Pays Off Student Loans', points: 110, category: 'positive' },
  { id: 'e29', name: 'Pays Off Mortgage', points: 140, category: 'positive' },
  { id: 'e30', name: 'Big Raise (≥15%)', points: 100, category: 'positive' },
  { id: 'e31', name: 'Adopts Child', points: 180, category: 'positive' },
  { id: 'e32', name: 'Twins/Multiples', points: 220, category: 'positive' }, // slightly > Baby
  { id: 'e33', name: 'Home Renovation Completed', points: 50, category: 'positive' },
  { id: 'e34', name: 'New Pet', points: 35, category: 'positive' },
  { id: 'e35', name: 'First-Time Homebuyer', points: 130, category: 'positive' }, // first milestone boost
  { id: 'e36', name: 'College Acceptance', points: 60, category: 'positive' },
  { id: 'e37', name: 'Deans List / Honors Term', points: 30, category: 'positive' },
  { id: 'e38', name: 'Scholarship Awarded', points: 80, category: 'positive' },
  { id: 'e39', name: 'Major Health Improvement (Goal Met)', points: 70, category: 'positive' },
  { id: 'e40', name: 'Quit Smoking / Major Habit Change', points: 90, category: 'positive' },
  { id: 'e41', name: 'Family Reunion Hosted', points: 45, category: 'positive' },
  { id: 'e42', name: 'Saves Emergency Fund (6+ months)', points: 85, category: 'positive' },
  { id: 'e43', name: 'Investment Windfall (Realized)', points: 150, category: 'positive' },
  { id: 'e44', name: 'Mentors Someone to a Promotion', points: 60, category: 'positive' },

  // ───────────────── NEW POSITIVE EVENTS ─────────────────
  // Minor Achievements (25-45 points)
  { id: 'e81', name: 'Gets Driver\'s License', points: 35, category: 'positive' },
  { id: 'e82', name: 'Learns New Language (Conversational)', points: 45, category: 'positive' },
  { id: 'e83', name: 'Completes First 5K', points: 30, category: 'positive' },
  { id: 'e84', name: 'Gets Perfect Attendance Award', points: 25, category: 'positive' },
  { id: 'e85', name: 'Cooks Thanksgiving Dinner Successfully', points: 35, category: 'positive' },
  { id: 'e86', name: 'Fixes Major Appliance/Car Issue', points: 40, category: 'positive' },
  { id: 'e87', name: 'Loses 20+ lbs (Documented)', points: 45, category: 'positive' },
  { id: 'e88', name: 'Gives Best Man/Maid of Honor Speech', points: 30, category: 'positive' },
  { id: 'e89', name: 'Organizes Successful Surprise Party', points: 40, category: 'positive' },
  { id: 'e90', name: 'Gets Security Clearance', points: 45, category: 'positive' },

  // Medium Achievements (50-95 points)
  { id: 'e91', name: 'Becomes Godparent', points: 55, category: 'positive' },
  { id: 'e92', name: 'Passes Professional Licensing Exam', points: 85, category: 'positive' },
  { id: 'e93', name: 'Elected to Local Board/Committee', points: 75, category: 'positive' },
  { id: 'e94', name: 'Reaches 6-Figure Salary', points: 90, category: 'positive' },
  { id: 'e95', name: 'Buys First New Car', points: 55, category: 'positive' },
  { id: 'e96', name: 'Gets Tenure', points: 95, category: 'positive' },
  { id: 'e97', name: 'Speaks at Major Conference', points: 70, category: 'positive' },
  { id: 'e98', name: 'Wins Local Political Race', points: 85, category: 'positive' },
  { id: 'e99', name: 'Appears on TV/Podcast (Positive)', points: 60, category: 'positive' },
  { id: 'e100', name: 'Grandchild Born', points: 80, category: 'positive' },
  { id: 'e101', name: 'Becomes Team Captain/Leader', points: 50, category: 'positive' },
  { id: 'e102', name: 'Gets into Graduate School', points: 65, category: 'positive' },
  { id: 'e103', name: 'Wins Lottery (>$1000)', points: 75, category: 'positive' },
  { id: 'e104', name: 'Quits Job to Pursue Dream', points: 85, category: 'positive' },

  // Major Achievements (100-180 points)
  { id: 'e105', name: 'Gets PhD/Doctorate', points: 120, category: 'positive' },
  { id: 'e106', name: 'Elected to Major Office', points: 180, category: 'positive' },
  { id: 'e107', name: 'Saves Someone\'s Life', points: 150, category: 'positive' },
  { id: 'e108', name: 'Buys Vacation Home', points: 110, category: 'positive' },
  { id: 'e109', name: 'Child Gets into Ivy League', points: 100, category: 'positive' },
  { id: 'e110', name: 'Becomes Millionaire (Verified)', points: 170, category: 'positive' },
  { id: 'e111', name: 'Gets TV Show/Movie Role', points: 130, category: 'positive' },
  { id: 'e112', name: 'Wins Nobel/Major International Award', points: 180, category: 'positive' },
  { id: 'e113', name: 'Donates Organ', points: 160, category: 'positive' },
  { id: 'e114', name: 'Adopts Special Needs Child', points: 200, category: 'positive' },

  // Epic Achievements (200+ points)
  { id: 'e115', name: 'Becomes Celebrity (Sustained Fame)', points: 220, category: 'positive' },
  { id: 'e116', name: 'IPO/Company Goes Public', points: 250, category: 'positive' },
  { id: 'e117', name: 'Rescues Multiple People (Disaster)', points: 200, category: 'positive' },

  // ───────────────── Negative Events ─────────────────
  { id: 'e7', name: 'Gets Arrested', points: -200, category: 'negative' },
  { id: 'e8', name: 'Gets Fired', points: -150, category: 'negative' },
  { id: 'e9', name: 'Divorce', points: -100, category: 'negative' },
  { id: 'e10', name: 'Car Accident', points: -50, category: 'negative' },
  { id: 'e11', name: 'Goes to Hospital', points: -75, category: 'negative' },
  { id: 'e13', name: 'Starts a Rumor', points: -20, category: 'negative' },

  // Added negatives (minor → major)
  { id: 'e45', name: 'DUI / DWI', points: -180, category: 'negative' },
  { id: 'e46', name: 'Bankruptcy Filed', points: -180, category: 'negative' },
  { id: 'e47', name: 'Eviction', points: -170, category: 'negative' },
  { id: 'e48', name: 'Academic Probation', points: -60, category: 'negative' },
  { id: 'e49', name: 'Expelled / Dismissed (School/Program)', points: -160, category: 'negative' },
  { id: 'e50', name: 'Fails Licensing / Board Exam', points: -80, category: 'negative' },
  { id: 'e51', name: 'Serious Injury (Surgery Required)', points: -120, category: 'negative' },
  { id: 'e52', name: 'Major Traffic Violation (No DUI)', points: -40, category: 'negative' },
  { id: 'e53', name: 'Public Scandal (Verified)', points: -150, category: 'negative' },
  { id: 'e54', name: 'Relationship Breakup (Non-Marriage)', points: -40, category: 'negative' },
  { id: 'e55', name: 'Laid Off (Not for Cause)', points: -90, category: 'negative' },
  { id: 'e56', name: 'Home Foreclosure', points: -190, category: 'negative' },
  { id: 'e57', name: 'Misses Important Family Event', points: -25, category: 'negative' },
  { id: 'e58', name: 'Academic Year Extended (Delayed Grad)', points: -50, category: 'negative' },
  { id: 'e59', name: 'Restraining Order Issued Against', points: -200, category: 'negative' },
  { id: 'e60', name: 'Job Offer Rescinded', points: -70, category: 'negative' },
  { id: 'e61', name: 'Business Closes', points: -150, category: 'negative' },

  // ───────────────── NEW NEGATIVE EVENTS ─────────────────
  // Minor Issues (-15 to -45 points)
  { id: 'e118', name: 'Fails Driver\'s Test', points: -25, category: 'negative' },
  { id: 'e119', name: 'Gets Food Poisoning at Family Event', points: -20, category: 'negative' },
  { id: 'e120', name: 'Forgets Anniversary/Birthday', points: -30, category: 'negative' },
  { id: 'e121', name: 'Locks Keys in Car', points: -15, category: 'negative' },
  { id: 'e122', name: 'Burns Holiday Dinner', points: -35, category: 'negative' },
  { id: 'e123', name: 'Gets Parking Ticket', points: -20, category: 'negative' },
  { id: 'e124', name: 'Drops Phone in Toilet', points: -25, category: 'negative' },
  { id: 'e125', name: 'Oversleeps Important Event', points: -40, category: 'negative' },
  { id: 'e126', name: 'Gets Caught in Lie (Minor)', points: -35, category: 'negative' },

  // Medium Issues (-50 to -95 points)
  { id: 'e127', name: 'Fails Class/Course', points: -55, category: 'negative' },
  { id: 'e128', name: 'Gets Demoted', points: -85, category: 'negative' },
  { id: 'e129', name: 'Emergency Room Visit', points: -60, category: 'negative' },
  { id: 'e130', name: 'Pet Dies', points: -50, category: 'negative' },
  { id: 'e131', name: 'IRS Audit', points: -75, category: 'negative' },
  { id: 'e132', name: 'Wedding Called Off (< 3 months)', points: -90, category: 'negative' },
  { id: 'e133', name: 'Car Repossessed', points: -85, category: 'negative' },
  { id: 'e134', name: 'Identity Theft', points: -65, category: 'negative' },
  { id: 'e135', name: 'Gambling Debt Discovered', points: -80, category: 'negative' },
  { id: 'e136', name: 'Caught Cheating (Academic)', points: -70, category: 'negative' },
  { id: 'e137', name: 'Miscarriage (Known Pregnancy)', points: -95, category: 'negative' },

  // Major Issues (-100 to -180 points)
  { id: 'e138', name: 'Child Arrested', points: -120, category: 'negative' },
  { id: 'e139', name: 'Loses Professional License', points: -140, category: 'negative' },
  { id: 'e140', name: 'House Fire/Flood (Major Damage)', points: -130, category: 'negative' },
  { id: 'e141', name: 'Ponzi Scheme Victim (>$10k)', points: -110, category: 'negative' },
  { id: 'e142', name: 'Sex Scandal (Public)', points: -170, category: 'negative' },
  { id: 'e143', name: 'Embezzlement Charges', points: -180, category: 'negative' },
  { id: 'e144', name: 'Drug Possession Arrest', points: -160, category: 'negative' },
  { id: 'e145', name: 'Custody Battle Loss', points: -120, category: 'negative' },
  { id: 'e146', name: 'Public Intoxication/Disorderly Conduct', points: -100, category: 'negative' },
  { id: 'e147', name: 'Pyramid Scheme Prosecution', points: -150, category: 'negative' },

  // Catastrophic Issues (-200+ points)
  { id: 'e148', name: 'Felony Conviction', points: -220, category: 'negative' },
  { id: 'e149', name: 'Child Abuse Allegations (Proven)', points: -250, category: 'negative' },
  { id: 'e150', name: 'Causes Fatal Accident (DUI)', points: -300, category: 'negative' },

  // ───────────────── Neutral / Major / Special ─────────────────
  { id: 'e12', name: 'Dies', points: -1000, category: 'negative' }, // special catastrophic
  { id: 'e62', name: 'Moves to New City/State', points: 40, category: 'positive' },
  { id: 'e63', name: 'Retires', points: 120, category: 'positive' },
  { id: 'e64', name: 'Returns to School (Graduate Program)', points: 65, category: 'positive' },
  { id: 'e65', name: 'Military Enlistment', points: 100, category: 'positive' },
  { id: 'e66', name: 'Promotion Denied (Final Round)', points: -45, category: 'negative' },
  { id: 'e67', name: 'Engagement Called Off', points: -70, category: 'negative' },
  { id: 'e68', name: 'Major Travel Achievement (7+ Countries in Year)', points: 50, category: 'positive' },
  { id: 'e69', name: 'Viral Positive Media (≥100k views)', points: 60, category: 'positive' },
  { id: 'e70', name: 'Viral Negative Media (≥100k views)', points: -100, category: 'negative' },
  { id: 'e71', name: 'Court Win (Civil/Family)', points: 80, category: 'positive' },
  { id: 'e72', name: 'Court Loss (Civil/Family)', points: -80, category: 'negative' },
  { id: 'e73', name: 'Major Grant / Fellowship', points: 110, category: 'positive' },
  { id: 'e74', name: 'Patent Granted', points: 140, category: 'positive' },
  { id: 'e75', name: 'Significant Donation Made', points: 60, category: 'positive' },
  { id: 'e76', name: 'Rehab Completed (Documented)', points: 120, category: 'positive' },
  { id: 'e77', name: 'Rehab Abandoned / Relapse (Public)', points: -130, category: 'negative' },
  { id: 'e78', name: 'Major Mentorship Award/Recognition', points: 70, category: 'positive' },
  { id: 'e79', name: 'Sibling/Cousin Conflict Escalates (Mediated)', points: -35, category: 'negative' },
  { id: 'e80', name: 'Reconciles Family Rift', points: 90, category: 'positive' },

  // ───────────────── NEW MIXED/SPECIAL EVENTS ─────────────────
  { id: 'e151', name: 'Empty Nest (Last Child Moves Out)', points: 45, category: 'positive' },
  { id: 'e152', name: 'Child Moves Back Home (>25)', points: -30, category: 'negative' },
  { id: 'e153', name: 'Becomes Power of Attorney', points: 40, category: 'positive' },
  { id: 'e154', name: 'Serves Jury Duty (Completed)', points: 25, category: 'positive' },
  { id: 'e155', name: 'Gets Called for Jury Duty (Dismissed)', points: -15, category: 'negative' },
  { id: 'e156', name: 'Becomes Eagle Scout/Gold Award', points: 70, category: 'positive' },
  { id: 'e157', name: 'Military Deployment', points: 60, category: 'positive' },
  { id: 'e158', name: 'Military Discharge (Honorable)', points: 80, category: 'positive' },
  { id: 'e159', name: 'Military Discharge (Dishonorable)', points: -140, category: 'negative' },
  { id: 'e160', name: 'Becomes Naturalized Citizen', points: 100, category: 'positive' },

  // ───────────────── ADDITIONAL POSITIVE EVENTS ─────────────────
  // Minor Achievements (25-45 points)
  { id: 'e161', name: 'Learns to Play Musical Instrument', points: 40, category: 'positive' },
  { id: 'e162', name: 'Wins Local Talent Show', points: 35, category: 'positive' },
  { id: 'e163', name: 'Completes Home DIY Project', points: 30, category: 'positive' },
  { id: 'e164', name: 'Grows a Successful Garden', points: 25, category: 'positive' },
  { id: 'e165', name: 'Gets Pet Trained (Certified)', points: 45, category: 'positive' },

  // Medium Achievements (50-95 points)
  { id: 'e166', name: 'Completes Coding Bootcamp', points: 70, category: 'positive' },
  { id: 'e167', name: 'Becomes Volunteer Coordinator', points: 55, category: 'positive' },
  { id: 'e168', name: 'Earns Black Belt in Martial Arts', points: 80, category: 'positive' },
  { id: 'e169', name: 'Hosts Charity Fundraiser', points: 65, category: 'positive' },
  { id: 'e170', name: 'Reaches 10-Year Work Anniversary', points: 50, category: 'positive' },
  { id: 'e171', name: 'Learns Second Language Fluently', points: 90, category: 'positive' },
  { id: 'e172', name: 'Wins Company Award', points: 60, category: 'positive' },

  // Major Achievements (100-180 points)
  { id: 'e173', name: 'Becomes Board Member of Non-Profit', points: 110, category: 'positive' },
  { id: 'e174', name: 'Invents Useful Gadget (Patented)', points: 140, category: 'positive' },
  { id: 'e175', name: 'Child Wins Major Scholarship', points: 100, category: 'positive' },
  { id: 'e176', name: 'Reaches Financial Independence', points: 160, category: 'positive' },
  { id: 'e177', name: 'Publishes Scientific Paper', points: 120, category: 'positive' },

  // Epic Achievements (200+ points)
  { id: 'e178', name: 'Founds Successful Non-Profit', points: 210, category: 'positive' },
  { id: 'e179', name: 'Becomes Philanthropist (Major Gifts)', points: 230, category: 'positive' },
  { id: 'e180', name: 'Climbs Major Mountain (e.g., Everest)', points: 220, category: 'positive' },

  // ───────────────── ADDITIONAL NEGATIVE EVENTS ─────────────────
  // Minor Issues (-15 to -45 points)
  { id: 'e181', name: 'Gets Minor Speeding Ticket', points: -20, category: 'negative' },
  { id: 'e182', name: 'Argues at Family Gathering', points: -30, category: 'negative' },
  { id: 'e183', name: 'Breaks Favorite Item', points: -15, category: 'negative' },
  { id: 'e184', name: 'Misses Flight for Vacation', points: -40, category: 'negative' },
  { id: 'e185', name: 'Gets Bad Haircut', points: -25, category: 'negative' },

  // Medium Issues (-50 to -95 points)
  { id: 'e186', name: 'Loses Job Interview (Final Round)', points: -60, category: 'negative' },
  { id: 'e187', name: 'Home Appliance Breaks (Costly Repair)', points: -50, category: 'negative' },
  { id: 'e188', name: 'Child Fails Important Exam', points: -70, category: 'negative' },
  { id: 'e189', name: 'Gets Scammed Online (Minor Loss)', points: -55, category: 'negative' },
  { id: 'e190', name: 'Family Pet Runs Away (Recovered)', points: -65, category: 'negative' },
  { id: 'e191', name: 'Credit Card Debt Accumulates', points: -80, category: 'negative' },

  // Major Issues (-100 to -180 points)
  { id: 'e192', name: 'Lawsuit Filed Against', points: -130, category: 'negative' },
  { id: 'e193', name: 'Major Health Diagnosis', points: -150, category: 'negative' },
  { id: 'e194', name: 'Business Partner Betrays', points: -140, category: 'negative' },
  { id: 'e195', name: 'Child Drops Out of College', points: -110, category: 'negative' },
  { id: 'e196', name: 'Tax Evasion Allegations', points: -170, category: 'negative' },

  // Catastrophic Issues (-200+ points)
  { id: 'e197', name: 'Imprisonment (Over 1 Year)', points: -250, category: 'negative' },
  { id: 'e198', name: 'Family Member Disowns', points: -210, category: 'negative' },
  { id: 'e199', name: 'Causes Major Family Feud', points: -220, category: 'negative' },

  // ───────────────── ADDITIONAL MIXED/SPECIAL EVENTS ─────────────────
  { id: 'e200', name: 'Survives Natural Disaster', points: 100, category: 'positive' },
  { id: 'e201', name: 'Loses Home in Disaster', points: -200, category: 'negative' },
  { id: 'e202', name: 'Becomes Caregiver for Elder', points: 50, category: 'positive' },
  { id: 'e203', name: 'Eldercare Burnout (Hospitalized)', points: -90, category: 'negative' },
  { id: 'e204', name: 'Adopts Pet from Shelter', points: 40, category: 'positive' },
  { id: 'e205', name: 'Pet Needs Expensive Surgery', points: -70, category: 'negative' },
  { id: 'e206', name: 'Wins Family Bet/Challenge', points: 30, category: 'positive' },
  { id: 'e207', name: 'Loses Family Bet/Challenge', points: -20, category: 'negative' },
  { id: 'e208', name: 'Starts Family Tradition', points: 45, category: 'positive' },
  { id: 'e209', name: 'Breaks Family Tradition', points: -35, category: 'negative' },
  { id: 'e210', name: 'Completes Ancestry Research', points: 55, category: 'positive' },
];