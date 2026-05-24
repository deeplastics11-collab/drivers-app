
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  LIVE_VOICE = 'LIVE_VOICE',
  DIAGNOSTICS = 'DIAGNOSTICS',
  UNIT_CONVERTER = 'UNIT_CONVERTER',
  QUICK_SPECS = 'QUICK_SPECS',
  NEARBY_SHOPS = 'NEARBY_SHOPS',
  AI_VISION = 'AI_VISION',
  COMPONENT_TESTER = 'COMPONENT_TESTER',
  TSB_RADAR = 'TSB_RADAR',
  GUIDED_DIAGNOSTIC = 'GUIDED_DIAGNOSTIC',
  LABOR_ESTIMATOR = 'LABOR_ESTIMATOR',
  CIRCUIT_GENIUS = 'CIRCUIT_GENIUS',
  FAILURE_PREDICTOR = 'FAILURE_PREDICTOR',
  PRECISION_SPECS = 'PRECISION_SPECS',
  ADAS_GUIDE = 'ADAS_GUIDE',
  INSTALL_GUIDE = 'INSTALL_GUIDE',
  TOOL_MAINTENANCE = 'TOOL_MAINTENANCE',
  TORQUE_SPECS = 'TORQUE_SPECS',
  SHARE_APP = 'SHARE_APP',
  REPAIR_GUIDE = 'REPAIR_GUIDE',
  PART_FINDER = 'PART_FINDER',
  REGISTER = 'REGISTER',
  USER_PROFILE = 'USER_PROFILE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  PREMIUM_UPGRADE = 'PREMIUM_UPGRADE'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  image?: string;
}

export interface DiagnosticResult {
  code: string;
  meaning: string;
  possibleCauses: string[];
  recommendedFix: string;
}

export interface GroundingChunk {
  web?: { uri?: string; title?: string };
  maps?: { uri?: string; title?: string };
}

export interface ServiceRecord {
  id: string;
  date: string;
  type: string;
  notes: string;
  vehicle: string;
  regNo: string;
  engineRef: string;
}
