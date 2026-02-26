const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5002";

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: { id: string; email: string; name?: string; roles: string[] };
  };
}

export interface ApiError {
  success: false;
  message: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as ApiError).message ?? res.statusText ?? "Request failed";
    throw new Error(message);
  }
  return data as T;
}

export async function apiRegister(body: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "USER" | "ARCHITECT" | "ENGINEER";
  termsAccepted: boolean;
}): Promise<AuthResponse> {
  const res = await fetch(`${getApiUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return handleResponse<AuthResponse>(res);
}

export async function apiLogin(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${getApiUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  return handleResponse<AuthResponse>(res);
}

export async function apiMe(token: string): Promise<{
  success: boolean;
  data: { user: { id: string; email: string; name?: string; roles: string[] } };
}> {
  const res = await fetch(`${getApiUrl()}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  return handleResponse(res);
}

export { getApiUrl };

// Professional (ECOSS) registration
export interface RegistrationPersonalInfo {
  firstName: string;
  middleName?: string;
  thirdName?: string;
  fourthName?: string;
  nationality: string;
  placeOfBirth: string;
  dateOfBirth: string;
  mailingAddress: string;
  email: string;
  telephone: string;
}

export interface RegistrationCategory {
  profession: string;
  otherProfession?: string;
  level: string;
}

export interface AcademicQualification {
  qualificationType: string;
  institution: string;
  specialization: string;
  dateOfAward: string;
}

export interface ProfessionalQualification {
  qualificationType: string;
  institution: string;
  dateOfAward: string;
}

export interface RegistrationPayload {
  personalInfo: RegistrationPersonalInfo;
  category: RegistrationCategory;
  academicQualifications: AcademicQualification[];
  professionalQualifications: ProfessionalQualification[];
}

export async function apiRegistrationCreate(
  token: string,
  body: RegistrationPayload
): Promise<{ success: boolean; data: unknown }> {
  const res = await fetch(`${getApiUrl()}/api/registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return handleResponse(res);
}

// Land verification (citizen: forensic search, LPC)
export interface LandVerificationCreated {
  id: string;
  type: string;
  parcelId: string;
  status: string;
  certificateId?: string;
  createdAt: string;
  [key: string]: unknown;
}

export async function apiRequestForensicSearch(
  token: string,
  body: { parcelId: string }
): Promise<{ success: boolean; data: LandVerificationCreated }> {
  const res = await fetch(`${getApiUrl()}/api/land-verifications/forensic-search`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return handleResponse(res);
}

export async function apiRequestLpc(
  token: string,
  body: { parcelId: string }
): Promise<{ success: boolean; data: LandVerificationCreated }> {
  const res = await fetch(`${getApiUrl()}/api/land-verifications/lpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return handleResponse(res);
}

export interface LandVerificationItem {
  id: string;
  type: string;
  parcelId: string;
  parcelNumber?: string;
  town?: string;
  blockNumber?: string;
  status: string;
  certificateId?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export async function apiLandVerificationsMine(
  token: string,
  params?: { page?: number; limit?: number; type?: string; status?: string }
): Promise<{
  success: boolean;
  data: {
    verifications: LandVerificationItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set("page", String(params.page));
  if (params?.limit != null) sp.set("limit", String(params.limit));
  if (params?.type) sp.set("type", params.type);
  if (params?.status) sp.set("status", params.status);
  const qs = sp.toString();
  const res = await fetch(`${getApiUrl()}/api/land-verifications/mine${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  return handleResponse(res);
}

export async function apiLandVerificationGetMine(
  token: string,
  id: string
): Promise<{ success: boolean; data: LandVerificationItem }> {
  const res = await fetch(`${getApiUrl()}/api/land-verifications/mine/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  return handleResponse(res);
}

// Professional profile (Engineer/Architect submission)
export interface ProfessionalProfileData {
  id: string;
  userId: string;
  professionType: string;
  yearsOfExperience: number;
  licenseNumber: string;
  documents: Record<string, string>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function apiProfessionalProfileGetMe(
  token: string
): Promise<{ success: boolean; data: ProfessionalProfileData | null }> {
  const res = await fetch(`${getApiUrl()}/api/professional-profile/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  return handleResponse(res);
}

export async function apiProfessionalProfileSubmit(
  token: string,
  body: {
    professionType: "Engineer" | "Architect";
    yearsOfExperience: number;
    licenseNumber: string;
    documents?: Record<string, string>;
  }
): Promise<{ success: boolean; data: ProfessionalProfileData }> {
  const res = await fetch(`${getApiUrl()}/api/professional-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return handleResponse(res);
}

/** Upload a file (image or PDF). Returns Cloudinary URL. Field name must be "file". */
export async function apiUpload(
  token: string,
  file: File
): Promise<{ success: boolean; url: string; publicId?: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${getApiUrl()}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
    credentials: "include",
  });
  return handleResponse(res);
}

// Design submissions (professional: upload design)
export interface DesignSubmissionData {
  id: string;
  userId: string;
  projectName: string;
  location: string;
  projectValue: number;
  drawingFileRef: string;
  complianceStatus: "pending" | "passed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export async function apiDesignSubmissionSubmit(
  token: string,
  body: {
    projectName: string;
    location: string;
    projectValue: number;
    drawingFileRef: string;
  }
): Promise<{ success: boolean; data: DesignSubmissionData }> {
  const res = await fetch(`${getApiUrl()}/api/design-submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return handleResponse(res);
}

export async function apiDesignSubmissionMine(
  token: string,
  params?: { limit?: number }
): Promise<{ success: boolean; data: { submissions: DesignSubmissionData[] } }> {
  const sp = new URLSearchParams();
  if (params?.limit != null) sp.set("limit", String(params.limit));
  const qs = sp.toString();
  const res = await fetch(`${getApiUrl()}/api/design-submissions/mine${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  return handleResponse(res);
}

// Permit requests (professional: request permit when design compliance = passed)
export type PermitRequestStatus =
  | "pending_government_approval"
  | "approved"
  | "rejected";

export interface PermitRequestData {
  id: string;
  designSubmissionId: string;
  userId: string;
  status: PermitRequestStatus;
  feeAmount: number;
  permitNumber?: string;
  projectName?: string;
  location?: string;
  projectValue?: number;
  createdAt: string;
  updatedAt: string;
}

export async function apiPermitRequestCreate(
  token: string,
  body: { designSubmissionId: string }
): Promise<{ success: boolean; data: PermitRequestData }> {
  const res = await fetch(`${getApiUrl()}/api/permit-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return handleResponse(res);
}

export async function apiPermitRequestMine(
  token: string,
  params?: { limit?: number }
): Promise<{ success: boolean; data: { permitRequests: PermitRequestData[] } }> {
  const sp = new URLSearchParams();
  if (params?.limit != null) sp.set("limit", String(params.limit));
  const qs = sp.toString();
  const res = await fetch(`${getApiUrl()}/api/permit-requests/mine${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  return handleResponse(res);
}
